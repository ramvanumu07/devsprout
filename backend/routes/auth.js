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
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function validateUsername(username) {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/
  return usernameRegex.test(username)
}

function validatePassword(password) {
  return password && password.length >= 6
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

async function sendPasswordResetEmail(email, token) {
  // TODO: Implement email sending
  // For now, just log the token (in production, send actual email)
  console.log(`Password reset token for ${email}: ${token}`)
  console.log(`Reset URL: ${process.env.APP_URL}/reset-password?token=${token}`)
}

// ============ AUTHENTICATION ROUTES ============

router.post('/signup', rateLimitMiddleware, async (req, res) => {
  try {
    const { username, email, name, password, confirmPassword } = req.body

    // Validation
    if (!username || !email || !name || !password || !confirmPassword) {
      return res.status(400).json(createErrorResponse('All fields are required'))
    }

    if (!validateUsername(username)) {
      return res.status(400).json(createErrorResponse('Username must be 3-20 characters and contain only letters, numbers, and underscores'))
    }

    if (!validateEmail(email)) {
      return res.status(400).json(createErrorResponse('Please enter a valid email address'))
    }

    if (!validateName(name)) {
      return res.status(400).json(createErrorResponse('Name must be at least 2 characters long'))
    }

    if (!validatePassword(password)) {
      return res.status(400).json(createErrorResponse('Password must be at least 6 characters long'))
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

    // Hash password
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '12')
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Create user
    const user = await createUser(username, email, name.trim(), hashedPassword)

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
    if (validateEmail(usernameOrEmail)) {
      user = await getUserByEmail(usernameOrEmail)
    } else {
      user = await getUserByUsername(usernameOrEmail)
    }

    if (!user) {
      return res.status(401).json(createErrorResponse('Invalid credentials'))
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return res.status(401).json(createErrorResponse('Invalid credentials'))
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

    res.json(createSuccessResponse({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        lastLogin: user.last_login
      },
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

router.post('/forgot-password', rateLimitMiddleware, async (req, res) => {
  try {
    const { usernameOrEmail } = req.body

    if (!usernameOrEmail) {
      return res.status(400).json(createErrorResponse('Username or email is required'))
    }

    // Find user by username or email
    let user = null
    if (validateEmail(usernameOrEmail)) {
      user = await getUserByEmail(usernameOrEmail)
    } else {
      user = await getUserByUsername(usernameOrEmail)
    }

    // Always return success to prevent user enumeration
    const successMessage = 'If an account with that username/email exists, a password reset link has been sent'

    if (!user) {
      return res.json(createSuccessResponse({ message: successMessage }))
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + parseInt(process.env.PASSWORD_RESET_TIMEOUT_HOURS || '1'))

    // Save token to database
    await createPasswordResetToken(user.id, resetToken, expiresAt.toISOString())

    // Send reset email
    await sendPasswordResetEmail(user.email, resetToken)

    console.log(`✅ Password reset requested: ${user.username}`)

    res.json(createSuccessResponse({ message: successMessage }))
  } catch (error) {
    handleErrorResponse(res, error, 'forgot password')
  }
})

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
    const currentUser = await getUserByUsername(req.user.username)
    if (!currentUser) {
      return res.status(404).json(createErrorResponse('User not found'))
    }

    // Verify current password for any profile changes
    if (!currentPassword) {
      return res.status(400).json(createErrorResponse('Current password is required to update profile'))
    }

    const isValidPassword = await bcrypt.compare(currentPassword, currentUser.password)
    if (!isValidPassword) {
      return res.status(401).json(createErrorResponse('Current password is incorrect'))
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
    res.json(createSuccessResponse({
      valid: true,
      user: {
        id: req.user.userId,
        username: req.user.username,
        email: req.user.email,
        name: req.user.name
      }
    }))
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

export default router