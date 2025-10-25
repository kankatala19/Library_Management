import { useEffect, useState } from 'react'
import api from '../services/api'

export default function ManageUsersPage() {
  const [users, setUsers] = useState([])
  const [form, setForm] = useState({ username: '', role: 'student', password: '' })
  const [editingId, setEditingId] = useState(null)

  // Load all users
  async function loadUsers() {
    try {
      const res = await api.get('/api/users')
      setUsers(res.data)
    } catch (err) {
      console.error(err)
      alert('Error loading users')
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  // Add or update user
  async function saveUser(e) {
    e.preventDefault()
    try {
      if (editingId) {
        await api.put(`/api/users/${editingId}`, form)
      } else {
        await api.post('/api/users', form)
      }
      setForm({ username: '', role: 'student', password: '' })
      setEditingId(null)
      loadUsers()
    } catch (err) {
      console.error(err)
      alert('Error saving user')
    }
  }

  // Edit user
  function editUser(user) {
    setEditingId(user.id)
    setForm({ username: user.username, role: user.role, password: '' })
  }

  // Delete user
  async function deleteUser(id) {
    if (!window.confirm('Are you sure you want to delete this user?')) return
    try {
      await api.delete(`/api/users/${id}`)
      loadUsers()
    } catch (err) {
      console.error(err)
      alert('Error deleting user')
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <h2>Manage Users</h2>

      <form onSubmit={saveUser} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input
          placeholder="Username"
          value={form.username}
          onChange={e => setForm({ ...form, username: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          required={!editingId} // password required only for new user
        />
        <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
          <option value="student">Student</option>
          <option value="librarian">Librarian</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">{editingId ? 'Update' : 'Add'}</button>
        {editingId && (
          <button type="button" onClick={() => { setEditingId(null); setForm({ username: '', role: 'student', password: '' }) }}>
            Cancel
          </button>
        )}
      </form>

      <table width="100%" cellPadding="8" style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Username</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id} style={{ borderTop: '1px solid #ddd' }}>
              <td>{u.username}</td>
              <td>{u.role}</td>
              <td>
                <button onClick={() => editUser(u)} style={{ marginRight: 8 }}>Edit</button>
                <button onClick={() => deleteUser(u.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
