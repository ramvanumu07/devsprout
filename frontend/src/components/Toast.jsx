/**
 * Toast Notification System - Professional UI
 * Success, error, warning, and info notifications
 */

import React, { useState, useEffect } from 'react'

const Toast = ({ 
  type = 'info', 
  message, 
  duration = 5000, 
  onClose,
  className = '' 
}) => {
  const [isVisible, setIsVisible] = useState(true)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [duration])

  const handleClose = () => {
    setIsExiting(true)
    setTimeout(() => {
      setIsVisible(false)
      onClose?.()
    }, 300)
  }

  if (!isVisible) return null

  const getToastConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: '✓',
          bgColor: '#f0fdf4',
          borderColor: '#bbf7d0',
          textColor: '#16a34a',
          iconBg: '#22c55e'
        }
      case 'error':
        return {
          icon: '✕',
          bgColor: '#fef2f2',
          borderColor: '#fecaca',
          textColor: '#dc2626',
          iconBg: '#ef4444'
        }
      case 'warning':
        return {
          icon: '⚠',
          bgColor: '#fffbeb',
          borderColor: '#fed7aa',
          textColor: '#d97706',
          iconBg: '#f59e0b'
        }
      default: // info
        return {
          icon: 'ℹ',
          bgColor: '#f0f9ff',
          borderColor: '#bae6fd',
          textColor: '#0369a1',
          iconBg: '#3b82f6'
        }
    }
  }

  const config = getToastConfig()

  return (
    <div 
      className={`toast toast-${type} ${isExiting ? 'toast-exit' : 'toast-enter'} ${className}`}
      style={{
        background: config.bgColor,
        borderColor: config.borderColor,
        color: config.textColor
      }}
    >
      <div 
        className="toast-icon"
        style={{ backgroundColor: config.iconBg }}
      >
        {config.icon}
      </div>
      <div className="toast-content">
        <div className="toast-message">{message}</div>
      </div>
      <button 
        className="toast-close"
        onClick={handleClose}
        style={{ color: config.textColor }}
      >
        ×
      </button>
    </div>
  )
}

// Toast Container Component
export const ToastContainer = ({ toasts = [] }) => {
  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>
  )
}

export default Toast