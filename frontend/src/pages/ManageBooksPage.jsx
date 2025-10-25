import { useEffect, useState } from 'react'
import api from '../services/api'

export default function ManageBooksPage() {
  const [books, setBooks] = useState([])
  const [form, setForm] = useState({
    title: '',
    author: '',
    isbn: '',
    publisher: '',
    category: '',
    totalCopies: 1,
    availableCopies: 1
  })
  const [editingId, setEditingId] = useState(null)

  async function load() {
    const res = await api.get('/api/books')
    setBooks(res.data)
  }

  useEffect(() => { load() }, [])

  async function save(e) {
    e.preventDefault()
    if (editingId) {
      await api.put(`/api/books/${editingId}`, form)
    } else {
      await api.post('/api/books', form)
    }
    setForm({
      title: '',
      author: '',
      isbn: '',
      publisher: '',
      category: '',
      totalCopies: 1,
      availableCopies: 1
    })
    setEditingId(null)
    load()
  }

  async function edit(b) {
    setEditingId(b.id)
    setForm({
      title: b.title,
      author: b.author,
      isbn: b.isbn,
      publisher: b.publisher,
      category: b.category,
      totalCopies: b.totalCopies,
      availableCopies: b.availableCopies
    })
  }

  async function remove(id) {
    await api.delete(`/api/books/${id}`)
    load()
  }

  const inputStyle = {
    padding: '6px 8px',
    height: 36,
    borderRadius: 4,
    border: '1px solid #ccc',
    boxSizing: 'border-box',
    flex: 1,         // make all inputs take equal width
  }

  const formStyle = {
  display: 'flex',
  gap: 8,
  margin: '12px 0',
  flexWrap: 'nowrap', // <- keep everything in one row
}


  return (
    <div style={{ padding: 24 }}>
      <h2>Manage Books</h2>
      <form onSubmit={save} style={formStyle}>
        <input placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required style={inputStyle} />
        <input placeholder="Author" value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} required style={inputStyle} />
        <input placeholder="ISBN" value={form.isbn} onChange={e => setForm({ ...form, isbn: e.target.value })} required style={inputStyle} />
        <input placeholder="Publisher" value={form.publisher} onChange={e => setForm({ ...form, publisher: e.target.value })} style={inputStyle} />
        <input placeholder="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={inputStyle} />
        <input type="number" min="1" placeholder="Total Copies" value={form.totalCopies} onChange={e => setForm({ ...form, totalCopies: parseInt(e.target.value) })} required style={inputStyle} />
        <input type="number" min="0" placeholder="Available Copies" value={form.availableCopies} onChange={e => setForm({ ...form, availableCopies: parseInt(e.target.value) })} required style={inputStyle} />
        <button type="submit" style={{ height: 36 }}>{editingId ? 'Update' : 'Add'}</button>
        {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ title: '', author: '', isbn: '', publisher: '', category: '', totalCopies: 1, availableCopies: 1 }) }} style={{ height: 36 }}>Cancel</button>}
      </form>

      <table width="100%" cellPadding="8" style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th align="left">Title</th>
            <th align="left">Author</th>
            <th align="left">ISBN</th>
            <th align="left">Publisher</th>
            <th align="left">Category</th>
            <th align="left">Total Copies</th>
            <th align="left">Available Copies</th>
            <th align="left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map(b => (
            <tr key={b.id} style={{ borderTop: '1px solid #ddd' }}>
              <td>{b.title}</td>
              <td>{b.author}</td>
              <td>{b.isbn}</td>
              <td>{b.publisher}</td>
              <td>{b.category}</td>
              <td>{b.totalCopies}</td>
              <td>{b.availableCopies}</td>
              <td>
                <button onClick={() => edit(b)} style={{ marginRight: 8 }}>Edit</button>
                <button onClick={() => remove(b.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
