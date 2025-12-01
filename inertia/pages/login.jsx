import { useState } from 'react'
import { Head, useForm } from '@inertiajs/react'

export default function Login() {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: '',
  })

  const [showPassword, setShowPassword] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    post('/auth/login')
  }

  return (
    <div style={styles.container}>
      <Head title="Login" />

      <div style={styles.card}>
        <h1 style={styles.title}>Selamat Datang 👋</h1>
        <p style={styles.subtitle}>Silakan login untuk melanjutkan</p>

        <form onSubmit={submit} style={styles.form}>
          {/* EMAIL */}
          <div>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={data.email}
              onChange={(e) => setData('email', e.target.value)}
              placeholder="Masukkan email"
              style={styles.input}
            />
            {errors.email && <p style={styles.error}>{errors.email}</p>}
          </div>

          {/* PASSWORD */}
          <div>
            <label style={styles.label}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={data.password}
                onChange={(e) => setData('password', e.target.value)}
                placeholder="Masukkan password"
                style={styles.input}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.showPasswordBtn}
              >
                {showPassword ? '👁' : '⌣'}
              </button>
            </div>
            {errors.password && <p style={styles.error}>{errors.password}</p>}
          </div>

          <button type="submit" disabled={processing} style={styles.button}>
            {processing ? 'Memproses...' : 'Login'}
          </button>
        </form>

        <p style={styles.footer}>
          Belum punya akun?{' '}
          <a href="/register" style={styles.link}>
            Daftar disini
          </a>
        </p>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #4A6CF7, #6B4CF7)',
    padding: '20px',
  },
  card: {
    width: '100%',
    maxWidth: '400px',
    background: 'white',
    borderRadius: '15px',
    padding: '30px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
  },
  title: {
    textAlign: 'center',
    fontSize: '26px',
    fontWeight: 'bold',
    marginBottom: '10px',
    color: '#333',
  },
  subtitle: {
    textAlign: 'center',
    color: '#666',
    marginBottom: '25px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },
  label: {
    fontSize: '14px',
    color: '#333',
    fontWeight: '600',
    marginBottom: '6px',
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '10px',
    border: '1px solid #ccc',
    fontSize: '14px',
    outline: 'none',
  },
  showPasswordBtn: {
    position: 'absolute',
    right: '10px',
    top: '8px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '18px',
  },
  error: {
    color: 'red',
    fontSize: '12px',
    marginTop: '4px',
  },
  button: {
    marginTop: '10px',
    padding: '12px',
    width: '100%',
    background: '#5B4CF7',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  footer: {
    textAlign: 'center',
    marginTop: '20px',
    color: '#666',
    fontSize: '14px',
  },
  link: {
    color: '#4A6CF7',
    textDecoration: 'none',
    fontWeight: '600',
  },
}
