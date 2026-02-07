/**
 * Authentication Routes - Sara Learning Platform
 * Enhanced authentication with signup, login, forgot password, and profile management
 */

import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import {
  createUser,
  getUserById,
  getUserByUsername,
  getUserByEmail,
  updateUserProfile,
  updateLastLogin,
  createPasswordResetToken,
  getPasswordResetToken,
  markPasswordResetTokenUsed,
  updateUserPassword,
  createUserSession,
  getUserSession,
  updateSessionLastAccessed,
  deleteUserSession
} from '../services/database.js'
import { handleErrorResponse, createSuccessResponse, createErrorResponse } from '../utils/responses.js'
import { rateLimitMiddleware } from '../middleware/rateLimiting.js'

const router = express.Router()

// ============ MIDDLEWARE ============

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

  if (!token) {
    return res.status(401).json(createErrorResponse('Access token required'))
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(403).json(createErrorResponse('Invalid or expired token'))
    }

    try {
      // Verify session is still valid
      const session = await getUserSession(token)
      if (!session) {
        return res.status(403).json(createErrorResponse('Session expired'))
      }

      // Update session last accessed
      await updateSessionLastAccessed(session.id)

      req.user = {
        userId: decoded.userId,
        username: decoded.username,
        email: decoded.email,
        name: decoded.name,
        sessionId: session.id
      }
      next()
    } catch (error) {
      console.error('Session validation error:', error)
      return res.status(403).json(createErrorResponse('Session validation failed'))
    }
  })
}

// ============ VALIDATION FUNCTIONS ============

function validateEmail(email) {
  if (!email) return { isValid: false, errors: ['Email is required'] }

  const errors = []
  const trimmedEmail = email.trim().toLowerCase()

  // Basic format validation
  const basicEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!basicEmailRegex.test(trimmedEmail)) {
    errors.push('Please enter a valid email address')
    return { isValid: false, errors }
  }

  // Advanced format validation
  const advancedEmailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
  if (!advancedEmailRegex.test(trimmedEmail)) {
    errors.push('Email format is not valid')
    return { isValid: false, errors }
  }

  const [localPart, domain] = trimmedEmail.split('@')

  // Local part validation
  if (localPart.length > 64) {
    errors.push('Email address is too long')
    return { isValid: false, errors }
  }

  if (localPart.startsWith('.') || localPart.endsWith('.') || localPart.includes('..')) {
    errors.push('Email format is not valid')
    return { isValid: false, errors }
  }

  // Domain validation
  if (domain.length > 255) {
    errors.push('Email domain is too long')
    return { isValid: false, errors }
  }

  // Disposable email providers
  const disposableProviders = [
    '10minutemail.com', 'guerrillamail.com', 'mailinator.com', 'tempmail.org',
    'throwaway.email', 'temp-mail.org', 'getnada.com', 'maildrop.cc',
    'sharklasers.com', 'guerrillamailblock.com', 'pokemail.net', 'spam4.me'
  ]

  if (disposableProviders.includes(domain)) {
    errors.push('Disposable email addresses are not allowed')
    return { isValid: false, errors }
  }

  return { isValid: true, errors: [] }
}

function validateUsername(username) {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/
  return usernameRegex.test(username)
}

function validatePassword(password) {
  if (!password) return { isValid: false, errors: ['Password is required'] }

  const errors = []

  // Length check
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  }

  if (password.length > 128) {
    errors.push('Password must be no more than 128 characters long')
  }

  // Character requirements
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }

  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number')
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\?]/.test(password)) {
    errors.push('Password must contain at least one special character')
  }

  // Common passwords check
  const commonPasswords = [
    'password', 'password123', '123456', '123456789', 'qwerty', 'abc123',
    'password1', 'admin', 'letmein', 'welcome', 'monkey', '1234567890'
  ]

  if (commonPasswords.includes(password.toLowerCase())) {
    errors.push('This password is too common. Please choose a more unique password')
  }

  // Personal info validation removed as requested

  return {
    isValid: errors.length === 0,
    errors
  }
}

function validateName(name) {
  return name && name.trim().length >= 2
}

// ============ UTILITY FUNCTIONS ============

async function generateToken(user) {
  const payload = {
    userId: user.id,
    username: user.username,
    email: user.email,
    name: user.name
  }

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.SESSION_TIMEOUT_HOURS ? `${process.env.SESSION_TIMEOUT_HOURS}h` : '24h'
  })

  // Create session in database
  const expiresAt = new Date()
  expiresAt.setHours(expiresAt.getHours() + parseInt(process.env.SESSION_TIMEOUT_HOURS || '24'))

  await createUserSession(
    user.id,
    token,
    expiresAt.toISOString(),
    null, // IP address - could be added from req.ip
    null  // User agent - could be added from req.get('User-Agent')
  )

  return token
}


// ============ AUTHENTICATION ROUTES ============

// Lightweight rate limiter for username checking (more lenient)
const usernameCheckLimiter = new Map()

function checkUsernameRateLimit(identifier) {
  const now = Date.now()
  const LIMIT = 60 // 60 requests per minute (more lenient)
  const WINDOW = 60 * 1000 // 1 minute

  const userRequests = usernameCheckLimiter.get(identifier) || []
  const validRequests = userRequests.filter(timestamp => now - timestamp < WINDOW)

  if (validRequests.length >= LIMIT) {
    return false
  }

  validRequests.push(now)
  usernameCheckLimiter.set(identifier, validRequests)
  return true
}

// Check email existence
router.post('/check-email', async (req, res) => {
  const identifier = req.ip || 'anonymous'

  if (!checkUsernameRateLimit(identifier)) {
    return res.status(429).json({
      success: false,
      message: 'Too many email checks. Please wait a moment.',
      retryAfter: 60
    })
  }

  try {
    const { email } = req.body

    if (!email) {
      return res.json({
        success: true,
        data: {
          exists: false,
          message: 'Email is required'
        }
      })
    }

    // Check if email exists
    const existingUser = await getUserByEmail(email)

    return res.json({
      success: true,
      data: {
        exists: !!existingUser,
        message: existingUser ? 'Email is already registered' : 'Email is available'
      }
    })

  } catch (error) {
    console.error('Email check error:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to check email availability'
    })
  }
})

// Check email availability (GET)
router.get('/check-email/:email', async (req, res) => {
  const identifier = req.ip || 'anonymous'

  if (!checkUsernameRateLimit(identifier)) {
    return res.status(429).json({
      success: false,
      message: 'Too many email checks. Please wait a moment.',
      retryAfter: 60
    })
  }

  try {
    const { email } = req.params

    if (!email) {
      return res.json({
        success: true,
        data: {
          available: false,
          message: 'Email is required'
        }
      })
    }

    // Check if email exists
    const existingUser = await getUserByEmail(email)

    return res.json({
      success: true,
      data: {
        available: !existingUser,
        message: existingUser ? 'Email is already registered' : 'Email is available'
      }
    })

  } catch (error) {
    console.error('Email check error:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to check email availability'
    })
  }
})

// Check username availability
router.get('/check-username/:username', async (req, res) => {
  // Apply lighter rate limiting for username checks
  const identifier = req.ip || 'anonymous'

  if (!checkUsernameRateLimit(identifier)) {
    return res.status(429).json({
      success: false,
      message: 'Too many username checks. Please wait a moment.',
      retryAfter: 60
    })
  }
  try {
    const { username } = req.params

    // Validate username format
    if (!validateUsername(username)) {
      return res.json({
        success: true,
        data: {
          available: false,
          reason: 'invalid_format',
          message: 'Username must be 3-20 characters and contain only letters, numbers, and underscores'
        }
      })
    }

    // Check if username exists
    const existingUser = await getUserByUsername(username)

    if (existingUser) {
      // Generate suggestions
      const suggestions = generateUsernameSuggestions(username)

      return res.json({
        success: true,
        data: {
          available: false,
          reason: 'taken',
          message: 'Username is already taken',
          suggestions
        }
      })
    }

    return res.json({
      success: true,
      data: {
        available: true,
        message: 'Username is available'
      }
    })

  } catch (error) {
    console.error('Username check error:', error)
    return res.status(500).json(createErrorResponse('Failed to check username availability'))
  }
})

// Generate username suggestions
function generateUsernameSuggestions(username) {
  const suggestions = []
  const baseUsername = username.toLowerCase()

  // Add numbers
  for (let i = 1; i <= 3; i++) {
    suggestions.push(`${baseUsername}${i}`)
    suggestions.push(`${baseUsername}${Math.floor(Math.random() * 100)}`)
  }

  // Add common suffixes
  const suffixes = ['_dev', '_code', '_js', '_user', '_pro']
  suffixes.forEach(suffix => {
    suggestions.push(`${baseUsername}${suffix}`)
  })

  // Add year
  const currentYear = new Date().getFullYear()
  suggestions.push(`${baseUsername}${currentYear}`)

  // Remove duplicates and return first 5
  return [...new Set(suggestions)].slice(0, 5)
}

router.post('/signup', rateLimitMiddleware, async (req, res) => {
  try {
    const { username, email, name, password, confirmPassword, securityQuestion, securityAnswer } = req.body

    // Validation
    if (!username || !email || !name || !password || !confirmPassword || !securityQuestion || !securityAnswer) {
      return res.status(400).json(createErrorResponse('All fields are required'))
    }

    if (!validateUsername(username)) {
      return res.status(400).json(createErrorResponse('Username must be 3-20 characters and contain only letters, numbers, and underscores'))
    }

    const emailValidation = validateEmail(email)
    if (!emailValidation.isValid) {
      return res.status(400).json(createErrorResponse(emailValidation.errors[0]))
    }

    if (!validateName(name)) {
      return res.status(400).json(createErrorResponse('Name must be at least 2 characters long'))
    }

    const passwordValidation = validatePassword(password)
    if (!passwordValidation.isValid) {
      return res.status(400).json(createErrorResponse(passwordValidation.errors[0]))
    }

    if (password !== confirmPassword) {
      return res.status(400).json(createErrorResponse('Passwords do not match'))
    }

    // Check if user already exists
    const [existingUsername, existingEmail] = await Promise.all([
      getUserByUsername(username),
      getUserByEmail(email)
    ])

    if (existingUsername) {
      return res.status(409).json(createErrorResponse('Username already exists'))
    }

    if (existingEmail) {
      return res.status(409).json(createErrorResponse('Email already registered'))
    }

    // Hash password and security answer
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '12')
    const hashedPassword = await bcrypt.hash(password, saltRounds)
    const hashedSecurityAnswer = await bcrypt.hash(securityAnswer.toLowerCase().trim(), saltRounds)

    // Create user
    const user = await createUser(username, email, name.trim(), hashedPassword, securityQuestion, hashedSecurityAnswer)

    // Generate token and create session
    const token = await generateToken(user)

    // Update last login
    await updateLastLogin(user.id)

    console.log(`✅ New user registered: ${username} (${email})`)

    res.status(201).json(createSuccessResponse({
      message: 'Account created successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name
      },
      token
    }))
  } catch (error) {
    if (error.message.includes('already exists')) {
      return res.status(409).json(createErrorResponse(error.message))
    }
    handleErrorResponse(res, error, 'signup')
  }
})

router.post('/login', rateLimitMiddleware, async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body

    if (!usernameOrEmail || !password) {
      return res.status(400).json(createErrorResponse('Username/email and password are required'))
    }

    // Find user by username or email
    let user = null
    const isEmail = validateEmail(usernameOrEmail).isValid

    if (isEmail) {
      console.log(`🔍 Backend - Looking up user by email: ${usernameOrEmail}`)
      user = await getUserByEmail(usernameOrEmail)
    } else {
      console.log(`🔍 Backend - Looking up user by username: ${usernameOrEmail}`)
      user = await getUserByUsername(usernameOrEmail)
    }

    if (user) {
      console.log(`🔍 Backend - Found user:`, {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        nameType: typeof user.name,
        nameValue: JSON.stringify(user.name)
      })
    }

    if (!user) {
      return res.status(401).json(createErrorResponse('Username or email not found. Please check your credentials or create an account.'))
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return res.status(401).json(createErrorResponse('Incorrect password. Please try again or use "Forgot Password" if needed.'))
    }

    // Check if user has access
    if (!user.has_access) {
      return res.status(403).json(createErrorResponse('Account access has been revoked'))
    }

    // Check if access has expired
    if (user.access_expires_at && new Date(user.access_expires_at) < new Date()) {
      return res.status(403).json(createErrorResponse('Account access has expired'))
    }

    // Generate token and create session
    const token = await generateToken(user)

    // Update last login
    await updateLastLogin(user.id)

    console.log(`✅ User logged in: ${user.username}`)
    console.log(`🔐 Backend - User data from DB:`, {
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.name,
      nameType: typeof user.name,
      nameLength: user.name?.length
    })

    const responseUserData = {
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.name,
      lastLogin: user.last_login
    }

    console.log(`🔐 Backend - Response user data:`, responseUserData)

    res.json(createSuccessResponse({
      message: 'Login successful',
      user: responseUserData,
      token
    }))
  } catch (error) {
    handleErrorResponse(res, error, 'login')
  }
})

router.post('/logout', authenticateToken, async (req, res) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1]

    if (token) {
      await deleteUserSession(token)
    }

    console.log(`✅ User logged out: ${req.user.username}`)

    res.json(createSuccessResponse({
      message: 'Logout successful'
    }))
  } catch (error) {
    handleErrorResponse(res, error, 'logout')
  }
})

// ============ PASSWORD RESET ============

router.post('/reset-password', rateLimitMiddleware, async (req, res) => {
  try {
    const { token, password, confirmPassword } = req.body

    if (!token || !password || !confirmPassword) {
      return res.status(400).json(createErrorResponse('Token, password, and confirm password are required'))
    }

    if (!validatePassword(password)) {
      return res.status(400).json(createErrorResponse('Password must be at least 6 characters long'))
    }

    if (password !== confirmPassword) {
      return res.status(400).json(createErrorResponse('Passwords do not match'))
    }

    // Validate token
    const resetToken = await getPasswordResetToken(token)
    if (!resetToken) {
      return res.status(400).json(createErrorResponse('Invalid or expired reset token'))
    }

    // Hash new password
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '12')
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Update password
    await updateUserPassword(resetToken.user_id, hashedPassword)

    // Mark token as used
    await markPasswordResetTokenUsed(resetToken.id)

    console.log(`✅ Password reset completed: ${resetToken.users.username}`)

    res.json(createSuccessResponse({
      message: 'Password reset successful. You can now log in with your new password.'
    }))
  } catch (error) {
    handleErrorResponse(res, error, 'reset password')
  }
})

// ============ PROFILE MANAGEMENT ============

router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = req.user

    res.json(createSuccessResponse({
      user: {
        id: user.userId,
        username: user.username,
        email: user.email,
        name: user.name
      }
    }))
  } catch (error) {
    handleErrorResponse(res, error, 'get profile')
  }
})

router.put('/profile', authenticateToken, rateLimitMiddleware, async (req, res) => {
  try {
    const { name, email, username, currentPassword, newPassword, confirmNewPassword } = req.body
    const userId = req.user.userId

    // Get current user data
    console.log(`🔍 Looking for user with ID: ${req.user.userId}`)
    const currentUser = await getUserById(req.user.userId)
    if (!currentUser) {
      console.error(`❌ User not found in database: ${req.user.userId}`)
      console.error(`🔍 JWT payload:`, req.user)
      return res.status(404).json(createErrorResponse('User not found'))
    }
    console.log(`✅ User found: ${currentUser.username} (ID: ${currentUser.id})`)

    // Verify current password only if password is being changed
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json(createErrorResponse('Current password is required to change password'))
      }

      const isValidPassword = await bcrypt.compare(currentPassword, currentUser.password)
      if (!isValidPassword) {
        return res.status(401).json(createErrorResponse('Current password is incorrect'))
      }
    }

    const updates = {}

    // Validate and update name
    if (name !== undefined) {
      if (!validateName(name)) {
        return res.status(400).json(createErrorResponse('Name must be at least 2 characters long'))
      }
      updates.name = name.trim()
    }

    // Validate and update email
    if (email !== undefined && email !== currentUser.email) {
      if (!validateEmail(email)) {
        return res.status(400).json(createErrorResponse('Please enter a valid email address'))
      }

      const existingEmail = await getUserByEmail(email)
      if (existingEmail) {
        return res.status(409).json(createErrorResponse('Email already in use'))
      }

      updates.email = email
    }

    // Validate and update username
    if (username !== undefined && username !== currentUser.username) {
      if (!validateUsername(username)) {
        return res.status(400).json(createErrorResponse('Username must be 3-20 characters and contain only letters, numbers, and underscores'))
      }

      const existingUsername = await getUserByUsername(username)
      if (existingUsername) {
        return res.status(409).json(createErrorResponse('Username already taken'))
      }

      updates.username = username
    }

    // Update password if provided
    if (newPassword) {
      if (!validatePassword(newPassword)) {
        return res.status(400).json(createErrorResponse('New password must be at least 6 characters long'))
      }

      if (newPassword !== confirmNewPassword) {
        return res.status(400).json(createErrorResponse('New passwords do not match'))
      }

      const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '12')
      updates.password = await bcrypt.hash(newPassword, saltRounds)
    }

    // Update user profile
    const updatedUser = await updateUserProfile(userId, updates)

    console.log(`✅ Profile updated: ${updatedUser.username}`)

    res.json(createSuccessResponse({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        name: updatedUser.name
      }
    }))
  } catch (error) {
    if (error.message.includes('already')) {
      return res.status(409).json(createErrorResponse(error.message))
    }
    handleErrorResponse(res, error, 'update profile')
  }
})

// ============ SESSION VALIDATION ============

router.get('/validate', authenticateToken, async (req, res) => {
  try {
    // Get fresh user data from database instead of JWT
    console.log(`🔍 Validation - Looking for user with ID: ${req.user.userId}`)
    const currentUser = await getUserById(req.user.userId)

    if (!currentUser) {
      console.error(`❌ Validation - User not found: ${req.user.userId}`)
      return res.status(404).json(createErrorResponse('User not found'))
    }

    console.log(`✅ Validation - Fresh user data from DB:`, {
      id: currentUser.id,
      username: currentUser.username,
      email: currentUser.email,
      name: currentUser.name,
      nameType: typeof currentUser.name,
      nameValue: JSON.stringify(currentUser.name)
    })

    const responseData = {
      valid: true,
      user: {
        id: currentUser.id,
        username: currentUser.username,
        email: currentUser.email,
        name: currentUser.name
      }
    }

    console.log(`🔍 Validation - Sending response:`, responseData)
    res.json(createSuccessResponse(responseData))
  } catch (error) {
    handleErrorResponse(res, error, 'validate token')
  }
})

// ============ LEGACY COMPATIBILITY ============

// Support old student_id based login
router.post('/login-legacy', rateLimitMiddleware, async (req, res) => {
  try {
    const { studentId, password } = req.body

    if (!studentId || !password) {
      return res.status(400).json(createErrorResponse('Student ID and password are required'))
    }

    // Map studentId to username for backward compatibility
    const user = await getUserByUsername(studentId)

    if (!user) {
      return res.status(401).json(createErrorResponse('Invalid credentials'))
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return res.status(401).json(createErrorResponse('Invalid credentials'))
    }

    // Generate token and create session
    const token = await generateToken(user)

    // Update last login
    await updateLastLogin(user.id)

    res.json(createSuccessResponse({
      message: 'Login successful',
      user: {
        id: user.id,
        student_id: user.username, // Map username back to student_id for compatibility
        name: user.name
      },
      token
    }))
  } catch (error) {
    handleErrorResponse(res, error, 'legacy login')
  }
})

// Get Security Question endpoint
router.post('/get-security-question', async (req, res) => {
  try {
    const { usernameOrEmail } = req.body

    if (!usernameOrEmail) {
      return res.status(400).json(createErrorResponse('Username or email is required'))
    }

    const input = usernameOrEmail.trim()

    // Validate email format if it contains @
    if (input.includes('@')) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(input)) {
        return res.status(400).json(createErrorResponse('Please enter a valid email address'))
      }
    }

    // Check if user exists
    let user = null
    const isEmail = input.includes('@')

    if (isEmail) {
      user = await getUserByEmail(input)
    } else {
      user = await getUserByUsername(input)
    }

    if (!user) {
      return res.status(404).json(createErrorResponse('Account with this username/email does not exist'))
    }

    if (!user.security_question) {
      return res.status(400).json(createErrorResponse('This account does not have a security question set up'))
    }

    // Return user info and security question (but not the answer)
    res.json(createSuccessResponse({
      username: user.username,
      securityQuestion: user.security_question
    }))

  } catch (error) {
    console.error('Get security question error:', error)
    res.status(500).json(createErrorResponse('Failed to get security question'))
  }
})

// Verify Security Answer Only endpoint (for step validation)
router.post('/verify-security-answer-only', async (req, res) => {
  try {
    const { usernameOrEmail, securityAnswer } = req.body

    if (!usernameOrEmail || !securityAnswer) {
      return res.status(400).json(createErrorResponse('Username/email and security answer are required'))
    }

    const input = usernameOrEmail.trim()

    // Check if user exists
    let user = null
    const isEmail = input.includes('@')

    if (isEmail) {
      user = await getUserByEmail(input)
    } else {
      user = await getUserByUsername(input)
    }

    if (!user) {
      return res.status(404).json(createErrorResponse('Account not found'))
    }

    if (!user.security_answer) {
      return res.status(400).json(createErrorResponse('No security answer set for this account'))
    }

    // Verify security answer
    const isAnswerCorrect = await bcrypt.compare(securityAnswer.toLowerCase().trim(), user.security_answer)

    if (!isAnswerCorrect) {
      return res.status(401).json(createErrorResponse('Incorrect security answer'))
    }

    // Security answer is correct
    res.json(createSuccessResponse({
      message: 'Security answer verified successfully',
      username: user.username
    }))

  } catch (error) {
    console.error('Verify security answer error:', error)
    res.status(500).json(createErrorResponse('Failed to verify security answer'))
  }
})

// Verify Security Answer and Reset Password endpoint
router.post('/verify-security-answer', async (req, res) => {
  try {
    const { usernameOrEmail, securityAnswer, newPassword, confirmPassword } = req.body

    if (!usernameOrEmail || !securityAnswer || !newPassword || !confirmPassword) {
      return res.status(400).json(createErrorResponse('All fields are required'))
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json(createErrorResponse('Passwords do not match'))
    }

    const input = usernameOrEmail.trim()

    // Check if user exists
    let user = null
    const isEmail = input.includes('@')

    if (isEmail) {
      user = await getUserByEmail(input)
    } else {
      user = await getUserByUsername(input)
    }

    if (!user) {
      return res.status(404).json(createErrorResponse('Account not found'))
    }

    if (!user.security_answer) {
      return res.status(400).json(createErrorResponse('No security answer set for this account'))
    }

    // Validate new password
    const passwordValidation = validatePassword(newPassword)
    if (!passwordValidation.isValid) {
      return res.status(400).json(createErrorResponse(passwordValidation.errors[0]))
    }

    // Verify security answer
    const isAnswerCorrect = await bcrypt.compare(securityAnswer.toLowerCase().trim(), user.security_answer)

    if (!isAnswerCorrect) {
      return res.status(401).json(createErrorResponse('Incorrect security answer'))
    }

    // Hash the new password
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '12')
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds)

    // Update user's password in database
    await updateUserPassword(user.id, hashedNewPassword)
    // Password successfully reset
    res.json(createSuccessResponse({
      message: 'Password reset successfully. You can now login with your new password.'
    }))

  } catch (error) {
    console.error('Verify security answer error:', error)
    res.status(500).json(createErrorResponse('Failed to verify security answer'))
  }
})

// ============ GET USER PASSWORD STATUS ============
router.get('/profile/password', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId

    // Get current user data
    console.log(`🔍 Looking for user with ID: ${req.user.userId}`)
    const currentUser = await getUserById(req.user.userId)
    if (!currentUser) {
      console.error(`❌ User not found in database: ${req.user.userId}`)
      console.error(`🔍 JWT payload:`, req.user)
      return res.status(404).json(createErrorResponse('User not found'))
    }
    console.log(`✅ User found: ${currentUser.username} (ID: ${currentUser.id})`)

    // Return password status (we can't return actual password as it's hashed)
    // This endpoint confirms the user has a password set
    res.json(createSuccessResponse({
      hasPassword: !!currentUser.password,
      message: 'Password is set and secure'
    }))
  } catch (error) {
    console.error('Get password status error:', error)
    handleErrorResponse(res, error, 'get password status')
  }
})


export default router