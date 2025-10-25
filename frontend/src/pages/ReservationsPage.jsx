// import { useEffect, useState } from 'react'
// import api from '../services/api'

// export default function ReservationsPage() {
//   const [reservations, setReservations] = useState([])
//   const [books, setBooks] = useState([])
//   const [users, setUsers] = useState([])
//   const [me, setMe] = useState(null)
//   const [userId, setUserId] = useState('')
//   const [bookId, setBookId] = useState('')

//   // Load data
//   useEffect(() => {
//     async function init() {
//       const meRes = await api.get('/api/auth/me')
//       setMe(meRes.data)

//       fetchReservations()

//       // Load books for all
//       const bookRes = await api.get('/api/books')
//       setBooks(bookRes.data)

//       // Load users only for admin
//       if (meRes.data.role === 'admin') {
//         const userRes = await api.get('/api/users')
//         setUsers(userRes.data)
//       }
//     }
//     init()
//   }, [])

//   // Fetch reservations
//   async function fetchReservations() {
//     const res = await api.get('/api/reservations')
//     setReservations(res.data)
//   }

//   // Add reservation
//   async function addReservation() {
//     try {
//       const uid = me.role === 'student' ? me.id : userId
//       if (!uid || !bookId) return alert('Select user and book!')

//       await api.post(`/api/reservations/${uid}/${bookId}`)
//       setBookId('')
//       if (me.role === 'admin') setUserId('')
//       fetchReservations()
//     } catch (err) {
//       alert(err.response?.data?.message || 'Cannot reserve this book')
//     }
//   }

//   return (
//     <div style={{ padding: 24, fontFamily: 'Arial, sans-serif' }}>
//       <h2>Reservations</h2>

//       {/* Reservation Form */}
//       {(me?.role === 'admin' || me?.role === 'student') && (
//         <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
//           {me.role === 'admin' && (
//             <select value={userId} onChange={e => setUserId(e.target.value)}>
//               <option value="">Select User</option>
//               {users.map(u => (
//                 <option key={u.id} value={u.id}>{u.username}</option>
//               ))}
//             </select>
//           )}

//           <select value={bookId} onChange={e => setBookId(e.target.value)}>
//             <option value="">Select Book</option>
//             {books
//               .filter(b => b.availableCopies > 0)
//               .map(b => (
//                 <option key={b.id} value={b.id}>
//                   {b.title} (Available: {b.availableCopies})
//                 </option>
//               ))}
//           </select>
//           <button onClick={addReservation}>Reserve</button>
//         </div>
//       )}

//       {/* Reservations Table */}
//       <table width="100%" cellPadding="8" style={{ borderCollapse: 'collapse' }}>
//         <thead>
//           <tr style={{ background: '#34495e', color: '#ecf0f1' }}>
//             <th>User</th>
//             <th>Book</th>
//             <th>Reservation Date</th>
//             <th>Status</th>
//           </tr>
//         </thead>
//         <tbody>
//           {reservations.map(r => (
//             <tr key={r.id} style={{ borderTop: '1px solid #ddd' }}>
//               <td>{r.user?.username}</td>
//               <td>{r.book?.title}</td>
//               <td>{r.reservationDate}</td>
//               <td style={{
//                 fontWeight: 'bold',
//                 color:
//                   r.status === 'PENDING' ? '#f39c12' :
//                   r.status === 'COMPLETED' ? '#27ae60' :
//                   '#c0392b'
//               }}>
//                 {r.status}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   )
// }
