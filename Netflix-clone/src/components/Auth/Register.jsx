import React, { useState } from 'react'
import './Auth.css'

const Register = ({ onRegisterSuccess, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // For demo purposes, create user with provided data
      const userData = {
        id: Date.now(),
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png'
      }

      localStorage.setItem('authToken', 'demo-token')
      localStorage.setItem('user', JSON.stringify(userData))
      
      onRegisterSuccess(userData)
    } catch (err) {
      setError('Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-form">
        <div className="auth-header">
          <img
            className="auth-logo"
            src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg"
            alt="Netflix Logo"
          />
        </div>

        <form onSubmit={handleSubmit} className="auth-form-content">
          <h1>Sign Up</h1>
          
          {error && <div className="auth-error">{error}</div>}
          
          <div className="auth-input-group">
            <input
              type="text"
              name="firstName"
              placeholder="First name"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="auth-input-group">
            <input
              type="text"
              name="lastName"
              placeholder="Last name"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="auth-input-group">
            <input
              type="email"
              name="email"
              placeholder="Email or phone number"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="auth-input-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          
          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
          
          <div className="auth-switch">
            <span>Already have an account? </span>
            <button type="button" onClick={onSwitchToLogin} className="auth-switch-btn">
              Sign in now.
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register

