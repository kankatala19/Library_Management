import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function LoginPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      const res = await api.post('/api/auth/login', { username, password })
      const token = res.data.token
      localStorage.setItem('token', token)
      navigate('/books')
    } catch (err) {
      setError('Invalid credentials')
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 80 }}>
      <form onSubmit={handleSubmit} style={{ width: 360 }}>
        <h2>Sign in</h2>
        {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
          <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
          <button type="submit">Login</button>
        </div>
      </form>
    </div>
  )
}



