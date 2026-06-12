import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './ResetPassword.css'

function getStrength(password) {
  if (password.length === 0) return null
  if (password.length < 6) return 'weak'
  if (password.length < 10 || !/[0-9]/.test(password) || !/[^a-zA-Z0-9]/.test(password)) return 'fair'
  return 'strong'
}

export default function ResetPassword() {
  const [token, setToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const t = params.get('token')
    if (!t) {
      setError('Invalid or missing reset link. Please request a new one.')
    } else {
      setToken(t)
    }
  }, [])

  const strength = getStrength(newPassword)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Reset link is invalid or has expired. Please request a new one.')
        return
      }

      setDone(true)
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const EyeIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )

  const EyeOffIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  )

  return (
    <div className="reset-page">
      <div className="reset-card">
        {!done ? (
          <>
            <h2>Set new password</h2>
            <p className="subtitle">
              Choose a strong password. It must be at least 8 characters long.
            </p>

            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="new-password">New Password</label>
                <div className="input-wrapper">
                  <input
                    id="new-password"
                    type={showNew ? 'text' : 'password'}
                    placeholder="At least 8 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    autoFocus
                  />
                  <button type="button" className="toggle-password" onClick={() => setShowNew(!showNew)} aria-label="Toggle password visibility">
                    {showNew ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
                {strength && (
                  <div className="password-strength">
                    <div className="strength-bar">
                      <div className={`strength-fill ${strength}`} />
                    </div>
                    <span className={`strength-label ${strength}`}>
                      {strength === 'weak' ? 'Weak' : strength === 'fair' ? 'Fair' : 'Strong'}
                    </span>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="confirm-password">Confirm Password</label>
                <div className="input-wrapper">
                  <input
                    id="confirm-password"
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Repeat your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button type="button" className="toggle-password" onClick={() => setShowConfirm(!showConfirm)} aria-label="Toggle password visibility">
                    {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>

              <button className="btn-primary" type="submit" disabled={loading || !token}>
                {loading ? 'Updating…' : 'Reset password'}
              </button>
            </form>

            <p className="back-link">
              <Link to="/login">← Back to sign in</Link>
            </p>
          </>
        ) : (
          <div className="success-state">
            <div className="check-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2>Password updated!</h2>
            <p>
              Your password has been reset successfully. You can now sign in with your new password.
            </p>
            <Link to="/login" className="btn-go-login">Go to sign in</Link>
          </div>
        )}
      </div>
    </div>
  )
}
