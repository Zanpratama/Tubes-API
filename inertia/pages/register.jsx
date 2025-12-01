import React, { useState } from 'react'
import { Link } from '@inertiajs/react'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState()

  const handleRegister = async (e) => {
    e.preventDefault()
    setErrors()

    try {
      const res = await fetch('http://localhost:3333/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setErrors({ message: data.message || 'Register failed' })
        return
      }

      alert('Register Berhasil!')
    } catch (err) {
      setErrors({ message: 'Server error' })
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Create Account</h1>

        {errors && <div style={styles.errorBox}>• {errors.message}</div>}

        <form
          onSubmit={handleRegister}
          style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}
        >
          <div>
            <label>Name</label>
            <input
              style={styles.input}
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

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
            Register
          </button>
        </form>

        <div style={styles.switchText}>
          Already have an account?
          <Link href="/" style={styles.link}>
            Login
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
