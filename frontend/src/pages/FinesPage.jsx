import { useEffect, useState } from 'react'
import api from '../services/api'

export default function FinesPage() {
  const [me, setMe] = useState(null)
  const [fines, setFines] = useState([])

  // ✅ Load current logged-in user info
  async function loadMe() {
    try {
      const res = await api.get('/api/auth/me')
      setMe(res.data)
    } catch (err) {
      console.error('Error loading user info:', err)
    }
  }

  // ✅ Load fines (admin sees all, student sees own)
  async function loadFines() {
    if (!me) return
    try {
      let res
      if (me.role === 'admin') {
        res = await api.get('/api/fines/all')
      } else {
        res = await api.get(`/api/fines/user/${me.id}`)
      }
      setFines(res.data)
    } catch (err) {
      console.error('Error loading fines:', err)
    }
  }

  // ✅ Mark fine as paid (admin only)
  async function markPaid(id) {
    try {
      await api.put(`/api/fines/pay/${id}`)
      loadFines()
    } catch (err) {
      console.error('Error paying fine:', err)
      alert('Error while updating fine status')
    }
  }

  useEffect(() => {
    loadMe()
  }, [])

  useEffect(() => {
    if (me) loadFines()
  }, [me])

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 16 }}>Fines</h2>

      <table
        width="100%"
        cellPadding="10"
        style={{
          borderCollapse: 'collapse',
          width: '100%',
          textAlign: 'center',
          border: '1px solid #ccc',
        }}
      >
        <thead style={{ backgroundColor: '#0e0d0dff' }}>
          <tr>
            {me?.role === 'admin' && (
              <th style={{ textAlign: 'left', width: '25%' }}>User</th>
            )}
            <th style={{ textAlign: 'center', width: '25%' }}>Amount</th>
            <th style={{ textAlign: 'center', width: '25%' }}>Status</th>
            {me?.role === 'admin' && (
              <th style={{ textAlign: 'center', width: '25%' }}>Actions</th>
            )}
          </tr>
        </thead>

        <tbody>
          {fines.length > 0 ? (
            fines.map((fine) => (
              <tr key={fine.id} style={{ borderTop: '1px solid #ddd' }}>
                {me?.role === 'admin' && (
                  <td style={{ textAlign: 'left' }}>
                    {fine.user?.username || fine.userId}
                  </td>
                )}

                <td style={{ textAlign: 'center', fontWeight: 500 }}>
                  ₹{fine.amount}
                </td>

                <td
                  style={{
                    textAlign: 'center',
                    color: fine.paid ? 'green' : 'red',
                    fontWeight: 600,
                  }}
                >
                  {fine.paid ? 'Paid' : 'Unpaid'}
                </td>

                {me?.role === 'admin' && (
                  <td style={{ textAlign: 'center' }}>
                    {!fine.paid && (
                      <button
                        onClick={() => markPaid(fine.id)}
                        style={{
                          backgroundColor: '#eef3eeff',
                          color: 'white',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '5px',
                          cursor: 'pointer',
                        }}
                      >
                        Mark Paid
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={me?.role === 'admin' ? 4 : 3}
                align="center"
                style={{ padding: 16 }}
              >
                No fines found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
