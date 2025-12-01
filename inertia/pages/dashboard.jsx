import { useEffect, useState } from 'react'

export default function Dashboard() {
  const [consoles, setConsoles] = useState([])
  const [rents, setRents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : ''

  const fetchData = async () => {
    try {
      const resConsoles = await fetch('http://localhost:3333/consoles', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const resRents = await fetch('http://localhost:3333/rents', {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!resConsoles.ok || !resRents.ok) {
        setError('Failed to load data')
        setLoading(false)
        return
      }

      setConsoles(await resConsoles.json())
      setRents(await resRents.json())
      setLoading(false)
    } catch {
      setError('Server error')
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!token) {
      window.location.href = '/' // redirect jika tidak ada token
      return
    }
    fetchData()
  }, [token])

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Dashboard</h1>
      {loading && <p style={{ color: 'white' }}>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={styles.card}>
        <h2>Consoles</h2>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {consoles.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.name}</td>
                <td>{c.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={styles.card}>
        <h2>Rents</h2>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Console</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {rents.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.user_id}</td>
                <td>{r.console_id}</td>
                <td>{r.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Styles
const styles = {
  page: {
    minHeight: '100vh',
    padding: '40px',
    background: 'linear-gradient(135deg, #5e60ce, #4361ee, #3a0ca3)',
    color: 'white',
  },
  title: { fontSize: '32px', fontWeight: 'bold', marginBottom: '20px' },
  card: {
    background: 'rgba(255,255,255,0.15)',
    padding: '25px',
    borderRadius: '20px',
    marginBottom: '30px',
    backdropFilter: 'blur(15px)',
    border: '1px solid rgba(255,255,255,0.3)',
  },
  table: { width: '100%', borderCollapse: 'collapse', color: 'white' },
}
