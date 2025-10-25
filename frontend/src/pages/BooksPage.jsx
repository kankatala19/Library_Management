import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function BooksPage() {
  const navigate = useNavigate()
  const [books, setBooks] = useState([])
  const [q, setQ] = useState('')
  const [me, setMe] = useState(null)

  useEffect(() => {
    async function init() {
      try {
        const meRes = await api.get('/api/auth/me')
        setMe(meRes.data)
      } catch {
        navigate('/login')
        return
      }
      fetchBooks()
    }
    init()
  }, [])

  async function fetchBooks() {
    const res = await api.get('/api/books')
    setBooks(res.data)
  }

  async function search() {
    if (!q) return fetchBooks()
    const res = await api.get('/api/books/search/title', { params: { title: q } })
    setBooks(res.data)
  }

  function logout() {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <div style={{ padding: 24, fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20,
        }}
      >
        <h2 style={{ color: '#2c3e50' }}>📚 Library Books</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {me && (
            <span style={{ color: '#2c3e50', fontWeight: 'bold' }}>
              Hi, {me.username} ({me.role})
            </span>
          )}
          <button
            onClick={logout}
            style={{
              padding: '6px 14px',
              background: '#e74c3c',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              fontWeight: 500,
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => (e.target.style.background = '#c0392b')}
            onMouseLeave={(e) => (e.target.style.background = '#e74c3c')}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Search Section */}
      <div
        style={{
          display: 'flex',
          gap: 8,
          marginBottom: 16,
          justifyContent: 'center',
        }}
      >
        <input
          placeholder="🔍 Search by title..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{
            padding: 8,
            borderRadius: 6,
            border: '1px solid #ccc',
            width: 250,
          }}
        />
        <button
          onClick={search}
          style={{
            padding: '8px 16px',
            background: '#1abc9c',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => (e.target.style.background = '#16a085')}
          onMouseLeave={(e) => (e.target.style.background = '#1abc9c')}
        >
          Search
        </button>
        <button
          onClick={fetchBooks}
          style={{
            padding: '8px 16px',
            background: '#95a5a6',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => (e.target.style.background = '#7f8c8d')}
          onMouseLeave={(e) => (e.target.style.background = '#95a5a6')}
        >
          Reset
        </button>
      </div>

      {/* Books Table */}
      <table
        width="100%"
        cellPadding="8"
        style={{
          borderCollapse: 'collapse',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderRadius: 8,
          overflow: 'hidden',
        }}
      >
        <thead style={{ background: '#34495e', color: 'white' }}>
          <tr>
            <th align="left">Title</th>
            <th align="left">Author</th>
            <th align="left">Category</th>
            <th align="left">ISBN</th>
            <th align="left">Availability</th>
          </tr>
        </thead>
        <tbody>
          {books.map((b) => (
            <tr
              key={b.id}
              style={{
                borderTop: '1px solid #ddd',
                backgroundColor: '#0c46c2ff',
              }}
            >
              <td>{b.title}</td>
              <td>{b.author}</td>
              <td>{b.category || '-'}</td>
              <td>{b.isbn}</td>
              <td
                style={{
                  fontWeight: 'bold',
                  color: b.availableCopies > 0 ? '#27ae60' : '#c0392b',
                }}
              >
                {b.availableCopies > 0
                  ? `Yes (${b.availableCopies}/${b.totalCopies})`
                  : 'No (0 available)'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
