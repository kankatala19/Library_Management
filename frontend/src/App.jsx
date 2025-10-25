import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import BooksPage from './pages/BooksPage.jsx'
import BorrowPage from './pages/BorrowPage.jsx'
// import ReservationsPage from './pages/ReservationsPage.jsx'
import FinesPage from './pages/FinesPage.jsx'
import ManageUserPage from './pages/ManageUsersPage.jsx'
import ManageBooksPage from './pages/ManageBooksPage.jsx'
import LandingPage from './pages/LandingPage.jsx'
import Protected from './components/Protected.jsx'
import NavBar from './components/NavBar.jsx'
import { useState } from 'react'

function App() {
  const [me, setMe] = useState(null)

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      {/* Auth routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected routes */}
      <Route
        path="/books"
        element={
          <Protected setMe={setMe}>
            <NavBar me={me} />
            <BooksPage />
          </Protected>
        }
      />
      <Route
        path="/borrow"
        element={
          <Protected setMe={setMe}>
            <NavBar me={me} />
            <BorrowPage />
          </Protected>
        }
      />

      <Route
        path="/fines"
        element={
          <Protected setMe={setMe}>
            <NavBar me={me} />
            <FinesPage />
          </Protected>
        }
      />
      <Route
        path="/manage/books"
        element={
          <Protected setMe={setMe}>
            <NavBar me={me} />
            <ManageBooksPage />
          </Protected>
        }
      />
      <Route
        path="/manage/users"
        element={
          <Protected setMe={setMe}>
            <NavBar me={me} />
            <ManageUserPage />
          </Protected>
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/books" replace />} />
    </Routes>
  )
}

export default App
