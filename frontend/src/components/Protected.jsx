import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function Protected({ children, setMe }) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function init() {
      try {
        const res = await api.get('/api/auth/me')
        setMe(res.data)
        setLoading(false)
      } catch {
        navigate('/login')
      }
    }
    init()
  }, [])

  if (loading) return <div style={{ padding: 24 }}>Loading...</div>
  return children
}



