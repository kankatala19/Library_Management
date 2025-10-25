import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      // Always send role as STUDENT
      const res = await api.post('/api/auth/register', { 
        username, 
        password, 
        email, 
        role: 'student' 
      });
      setSuccess('Registration successful! You can now login.');
      // Redirect to login after a short delay
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      console.error(err);
      setError('Registration failed. Username or email may already exist.');
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 80 }}>
      <form onSubmit={handleSubmit} style={{ width: 360 }}>
        <h2>Register</h2>
        {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
        {success && <div style={{ color: 'green', marginBottom: 8 }}>{success}</div>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <input
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
          <input
            placeholder="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button type="submit">Register</button>
        </div>
      </form>
    </div>
  );
}
