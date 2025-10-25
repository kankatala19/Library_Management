import { Link, useNavigate } from 'react-router-dom'

export default function NavBar({ me }) {
  const navigate = useNavigate()

  function logout() {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <nav
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '14px 40px',
        background: 'linear-gradient(90deg, #1e3c72, #2a5298)', // nice gradient
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
      }}
    >
      {/* ===== Left Side Links ===== */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
        {[
          { path: '/books', label: 'Books' },
          { path: '/borrow', label: 'Borrow' },
          { path: '/fines', label: 'Fines' },
        ].map((item, i) => (
          <Link
            key={i}
            to={item.path}
            style={{
              color: '#ecf0f1',
              textDecoration: 'none',
              fontWeight: 500,
              letterSpacing: 0.5,
              transition: 'color 0.2s ease',
              marginRight: 20,
            }}
            onMouseEnter={(e) => (e.target.style.color = '#00e6b8')}
            onMouseLeave={(e) => (e.target.style.color = '#ecf0f1')}
          >
            {item.label}
          </Link>
        ))}

        {/* Admin-only Links */}
        {me?.role === 'admin' && (
          <>
            <Link
              to="/manage/books"
              style={{
                color: '#ecf0f1',
                textDecoration: 'none',
                fontWeight: 500,
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => (e.target.style.color = '#00e6b8')}
              onMouseLeave={(e) => (e.target.style.color = '#ecf0f1')}
            >
              Manage Books
            </Link>
            <Link
              to="/manage/users"
              style={{
                color: '#ecf0f1',
                textDecoration: 'none',
                fontWeight: 500,
                transition: 'color 0.2s ease',
                marginRight: 20,
              }}
              onMouseEnter={(e) => (e.target.style.color = '#00e6b8')}
              onMouseLeave={(e) => (e.target.style.color = '#ecf0f1')}
            >
              Manage Users
            </Link>
          </>
        )}
      </div>

      {/* ===== Right Side (User + Logout) ===== */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {me && (
          <span
            style={{
              color: '#ecf0f1',
              fontWeight: 600,
              fontSize: 15,
              marginRight: 24, // gives nice spacing before Logout
            }}
          >
            Hi, {me.username} ({me.role})
          </span>
        )}
        <button
          onClick={logout}
          style={{
            padding: '8px 18px',
            background: '#00e6b8',
            color: '#1e3c72',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: 14,
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.target.style.background = '#00cfa1'
            e.target.style.transform = 'scale(1.05)'
          }}
          onMouseLeave={(e) => {
            e.target.style.background = '#00e6b8'
            e.target.style.transform = 'scale(1)'
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  )
}
