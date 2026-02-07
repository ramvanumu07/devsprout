/**
 * Debug Schema Route - Check Current Database Structure
 */

import express from 'express'
import { getSupabaseClient } from '../services/database.js'

const router = express.Router()

// Get current database schema information
router.get('/schema', async (req, res) => {
  try {
    const client = getSupabaseClient()
    
    if (client === 'DEV_MODE') {
      return res.json({
        mode: 'development',
        message: 'Running in development mode - using in-memory database',
        tables: {
          users: 'In-memory Map',
          progress: 'In-memory Map', 
          chat_sessions: 'In-memory Map'
        }
      })
    }

    // Test each table directly to see which ones exist
    const tablesToCheck = ['users', 'progress', 'chat_sessions', 'admins', 'password_reset_tokens', 'user_sessions', 'learning_analytics']
    const schemaInfo = {}
    const existingTables = []
    
    for (const tableName of tablesToCheck) {
      try {
        const { data, error } = await client
          .from(tableName)
          .select('*')
          .limit(1)
        
        if (!error) {
          existingTables.push(tableName)
          schemaInfo[tableName] = {
            status: 'exists',
            has_data: data && data.length > 0,
            sample_record: data?.[0] || null
          }
        } else {
          schemaInfo[tableName] = {
            status: 'error',
            error: error.message
          }
        }
      } catch (err) {
        schemaInfo[tableName] = {
          status: 'does_not_exist',
          error: err.message
        }
      }
    }

    res.json({
      mode: 'production',
      existing_tables: existingTables,
      schema: schemaInfo,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Schema debug error:', error)
    res.status(500).json({
      error: 'Failed to get schema information',
      message: error.message,
      timestamp: new Date().toISOString()
    })
  }
})

// Test database connectivity and basic operations
router.get('/test-db', async (req, res) => {
  try {
    const client = getSupabaseClient()
    
    if (client === 'DEV_MODE') {
      return res.json({
        mode: 'development',
        status: 'connected',
        message: 'Development mode - in-memory database working'
      })
    }

    // Test basic query
    const { data, error } = await client
      .from('users')
      .select('id')
      .limit(1)

    if (error) {
      throw new Error(`Database test failed: ${error.message}`)
    }

    res.json({
      mode: 'production',
      status: 'connected',
      has_users: data && data.length > 0,
      message: 'Database connection successful'
    })

  } catch (error) {
    console.error('Database test error:', error)
    res.status(500).json({
      status: 'error',
      message: error.message,
      timestamp: new Date().toISOString()
    })
  }
})

export default router