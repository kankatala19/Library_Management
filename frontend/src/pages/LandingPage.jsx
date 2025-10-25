import { useNavigate } from 'react-router-dom'

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-5xl font-bold mb-10">Library Management</h1>

      <div className="space-y-6">
        <button
          onClick={() => navigate('/login')}
          className="block w-48 py-3 text-xl rounded-lg bg-blue-500 hover:bg-blue-600 transition"
        >
          Login
        </button>

        <button
          onClick={() => navigate('/register')}
          className="block w-48 py-3 text-xl rounded-lg bg-purple-500 hover:bg-purple-600 transition"
        >
          Register
        </button>
      </div>
    </div>
  )
}
