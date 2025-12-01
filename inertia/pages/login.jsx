import { useState } from 'react'
import { Link } from '@inertiajs/react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState()

  const handleLogin = async (e) => {
    e.preventDefault()
    setErrors()

    try {
      const res = await fetch('http://localhost:3333/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setErrors({ message: data.message || 'Login failed' })
        return
      }

      // Simpan token sementara
      localStorage.setItem('token', data.token)

      alert('Login berhasil!')
    } catch (err) {
      setErrors({ message: 'Server error' })
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Welcome Back</h1>

        {errors && <div style={styles.errorBox}>• {errors.message}</div>}

        <form
          onSubmit={handleLogin}
          style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}
        >
          <div>
            <label>Email</label>
            <input
              style={styles.input}
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label>Password</label>
            <input
              style={styles.input}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button style={styles.button} type="submit">
            Login
          </button>
        </form>

        <div style={styles.switchText}>
          Don't have an account?
          <Link href="/register" style={styles.link}>
            Register
          </Link>
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #5e60ce, #4361ee, #3a0ca3)',
    padding: '20px',
  },
  card: {
    width: '100%',
    maxWidth: '420px',
    background: 'rgba(255, 255, 255, 0.15)',
    padding: '40px',
    borderRadius: '20px',
    color: 'white',
    backdropFilter: 'blur(15px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '25px',
  },
  input: {
    width: '100%',
    padding: '12px',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.4)',
    background: 'rgba(255,255,255,0.2)',
    color: 'white',
    marginTop: '5px',
    outline: 'none',
  },
  button: {
    width: '100%',
    padding: '12px',
    borderRadius: '12px',
    border: 'none',
    background: 'white',
    color: '#3a0ca3',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '16px',
  },
  errorBox: {
    background: 'rgba(255,0,0,0.4)',
    padding: '10px',
    borderRadius: '10px',
    marginBottom: '10px',
  },
  switchText: {
    textAlign: 'center',
    marginTop: '20px',
    fontSize: '14px',
  },
  link: {
    color: '#ffb703',
    fontWeight: 'bold',
    marginLeft: '5px',
  },
}
