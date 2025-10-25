import { useEffect, useState } from 'react'
import api from '../services/api'

export default function BorrowPage() {
  const [records, setRecords] = useState([])
  const [books, setBooks] = useState([])
  const [users, setUsers] = useState([])
  const [selectedBook, setSelectedBook] = useState('')
  const [selectedUser, setSelectedUser] = useState('')
  const [me, setMe] = useState(null)

  // Load current logged-in user info
  async function loadMe() {
    try {
      const res = await api.get('/api/auth/me')
      setMe(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  // Load borrow records
  async function loadRecords() {
    if (!me) return
    try {
      let res
      if (me.role === 'student') {
        res = await api.get(`/api/borrow/user/${me.id}`)
      } else {
        res = await api.get('/api/borrow')
      }
      setRecords(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  // Load all books
  async function loadBooks() {
    try {
      const res = await api.get('/api/books')
      setBooks(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  // Load all users (for admin only)
  async function loadUsers() {
    if (me?.role !== 'admin') return
    try {
      const res = await api.get('/api/users')
      setUsers(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    async function init() {
      await loadMe()
    }
    init()
  }, [])

  useEffect(() => {
    if (!me) return
    loadRecords()
    loadBooks()
    loadUsers()
  }, [me])

  // Borrow a book (admin only)
  async function borrowBook() {
    if (!selectedUser || !selectedBook) return alert('Select both user and book')
    try {
      await api.post(`/api/borrow/${selectedUser}/${selectedBook}`)
      setSelectedUser('')
      setSelectedBook('')
      loadRecords()
    } catch (err) {
      console.error(err)
      alert('Error borrowing book')
    }
  }

  // Return a book
  async function returnBook(recordId) {
    try {
      await api.put(`/api/borrow/return/${recordId}`)
      loadRecords()
    } catch (err) {
      console.error(err)
      alert('Error returning book')
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <h2>Borrow Records</h2>

      {/* Borrow section for admin */}
      {me?.role === 'admin' && (
        <div style={{ marginBottom: 16, display: 'flex', gap: 8 }}>
          <select value={selectedUser} onChange={e => setSelectedUser(e.target.value)}>
            <option value="">Select User</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>
                {u.username} ({u.role})
              </option>
            ))}
          </select>

          <select value={selectedBook} onChange={e => setSelectedBook(e.target.value)}>
            <option value="">Select Book</option>
            {books.map(b => (
              <option key={b.id} value={b.id}>
                {b.title} (Available: {b.availableCopies})
              </option>
            ))}
          </select>

          <button onClick={borrowBook}>Borrow</button>
        </div>
      )}

      <table width="100%" cellPadding="8" style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {me?.role === 'admin' && <th>User</th>}
            <th>Book</th>
            <th>Borrowed At</th>
            <th>Due Date</th>
            <th>Return Date</th>
            <th>Status</th>
            {me?.role !== 'student' && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {records.map(r => (
            <tr key={r.id} style={{ borderTop: '1px solid #ddd' }}>
              {me?.role === 'admin' && <td>{r.user?.username || r.userId}</td>}
              <td>{r.book?.title || r.bookId}</td>
              <td>{r.borrowDate}</td>
              <td>{r.dueDate}</td>
              <td>{r.returnDate ?? '-'}</td>
              <td>{r.status}</td>
              {me?.role !== 'student' && (
                <td>
                  {r.status === 'BORROWED' && (
                    <button onClick={() => returnBook(r.id)}>Return</button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
