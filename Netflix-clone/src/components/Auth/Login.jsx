import React, { useState } from 'react'
import './Auth.css'

const Login = ({ onLoginSuccess, onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
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
      
      // For demo purposes, accept any email/password
      const userData = {
        id: 1,
        email: formData.email,
        firstName: 'John',
        lastName: 'Doe',
        profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png'
      }

      localStorage.setItem('authToken', 'demo-token')
      localStorage.setItem('user', JSON.stringify(userData))
      
      onLoginSuccess(userData)
    } catch (err) {
      setError('Login failed. Please try again.')
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
          <h1>Sign In</h1>
          
          {error && <div className="auth-error">{error}</div>}
          
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
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
          
          <div className="auth-help">
            <div className="auth-checkbox">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Remember me</label>
            </div>
            <a href="#help" className="auth-help-link">Need help?</a>
          </div>
          
          <div className="auth-switch">
            <span>New to Netflix? </span>
            <button type="button" onClick={onSwitchToRegister} className="auth-switch-btn">
              Sign up now.
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login

