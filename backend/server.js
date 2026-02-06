/**
 * EduBridge API Server - Industry Level
 * Professional Express.js server with proper architecture
 */

import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import { createServer } from 'http'

// Import routes
import authRoutes from './routes/auth.js'
import chatRoutes from './routes/chat.js'
import learningRoutes from './routes/learning.js'
import progressRoutes from './routes/progress.js'

// Import middleware
import { performanceMonitor } from './middleware/performance.js'

const app = express()
const PORT = process.env.PORT || 5000

// ============ SECURITY MIDDLEWARE ============
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
}))

// ============ CORS CONFIGURATION ============
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:5176',
    'http://localhost:5177',
    'http://localhost:5178',
    'http://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'X-Correlation-ID',
  ],
}))

// ============ PERFORMANCE MIDDLEWARE ============
app.use(compression({
  level: 6,
  threshold: 1024,
}))

// ============ BODY PARSING ============
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// ============ PERFORMANCE MONITORING ============
app.use(performanceMonitor)

// ============ ROUTES ============
app.use('/api/auth', authRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/learn', learningRoutes)
app.use('/api/progress', progressRoutes)

// ============ HEALTH CHECK ============
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: '2.0.1'
  })
})

// ============ ERROR HANDLING ============
app.use((err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] Error:`, err.message)

  const isDevelopment = process.env.NODE_ENV === 'development'

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(isDevelopment && { stack: err.stack })
  })
})

// ============ 404 HANDLER ============
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
    timestamp: new Date().toISOString()
  })
})

// ============ SERVER STARTUP ============
const server = createServer(app)

server.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║                        EduBridge API                         ║
║                    Industry Level v2.0                      ║
╠══════════════════════════════════════════════════════════════╣
║  Server:      http://localhost:${PORT.toString().padEnd(29)} ║
║  Environment: ${(process.env.NODE_ENV || 'development').padEnd(29)} ║
║  Status:      Production Ready                               ║
║  Health:      http://localhost:${PORT}/health${' '.repeat(18)} ║
╚══════════════════════════════════════════════════════════════╝
  `)
})

// ============ GRACEFUL SHUTDOWN ============
const gracefulShutdown = (signal) => {
  console.log(`\n[${new Date().toISOString()}] Received ${signal}. Starting graceful shutdown...`)

  server.close(() => {
    console.log(`[${new Date().toISOString()}] Server closed successfully.`)
    process.exit(0)
  })

  // Force close after 10 seconds
  setTimeout(() => {
    console.log(`[${new Date().toISOString()}] Force closing server.`)
    process.exit(1)
  }, 10000)
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
process.on('SIGINT', () => gracefulShutdown('SIGINT'))

export default app

