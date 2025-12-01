import React, { useEffect, useState } from 'react'
import { router } from '@inertiajs/react'

export default function Dashboard() {
  const [consoles, setConsoles] = useState([])
  const [rents, setRents] = useState([])

  const [consoleName, setConsoleName] = useState('')
  const [consolePrice, setConsolePrice] = useState('')

  const [rentUser, setRentUser] = useState('')
  const [rentConsole, setRentConsole] = useState('')
  const [rentDate, setRentDate] = useState('')
  const [rentHours, setRentHours] = useState('')

  const token = localStorage.getItem('token')

  // HEADER GLOBAL
  const AUTH_HEADER = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  }

  // ========== LOADING DATA ==========
  const loadData = async () => {
    try {
      const consolesRes = await fetch('http://localhost:3333/consoles', {
        headers: AUTH_HEADER,
      })
      const rentsRes = await fetch('http://localhost:3333/rents', {
        headers: AUTH_HEADER,
      })

      if (!consolesRes.ok || !rentsRes.ok) {
        console.error('Gagal fetch data')
        return
      }

      setConsoles(await consolesRes.json())
      setRents(await rentsRes.json())
    } catch (err) {
      console.error('Error loadData:', err)
    }
  }

  // ========== CEK TOKEN + LOAD ==========
  useEffect(() => {
    if (!token) return router.visit('/')
    loadData()
  }, [])

  // ========== CREATE CONSOLE ==========
  const createConsole = async (e) => {
    e.preventDefault()

    await fetch('http://localhost:3333/consoles', {
      method: 'POST',
      headers: AUTH_HEADER,
      body: JSON.stringify({
        name: consoleName,
        price_per_hour: consolePrice,
      }),
    })

    setConsoleName('')
    setConsolePrice('')
    loadData()
  }

  // ========== CREATE RENT ==========
  const createRent = async (e) => {
    e.preventDefault()

    await fetch('http://localhost:3333/rents', {
      method: 'POST',
      headers: AUTH_HEADER,
      body: JSON.stringify({
        user_id: rentUser,
        console_id: rentConsole,
        rent_date: rentDate,
        hours: rentHours,
      }),
    })

    setRentUser('')
    setRentConsole('')
    setRentDate('')
    setRentHours('')
    loadData()
  }

  // ========== DELETE CONSOLE ==========
  const deleteConsole = async (id) => {
    await fetch(`http://localhost:3333/consoles/${id}`, {
      method: 'DELETE',
      headers: AUTH_HEADER,
    })
    loadData()
  }

  // ========== DELETE RENT ==========
  const deleteRent = async (id) => {
    await fetch(`http://localhost:3333/rents/${id}`, {
      method: 'DELETE',
      headers: AUTH_HEADER,
    })
    loadData()
  }

  const logout = () => {
    localStorage.removeItem('token')
    router.visit('/')
  }

  return (
    <div style={styles.page}>
      <div style={styles.sidebar}>
        <h2 style={{ color: 'white' }}>Dashboard</h2>
        <p style={styles.menu} onClick={logout}>
          Logout
        </p>
      </div>

      <div style={styles.container}>
        <h1 style={styles.header}>Game Console Dashboard</h1>

        {/* ========== CONSOLES ========== */}
        <div style={styles.section}>
          <h2>Consoles</h2>

          <form style={styles.form} onSubmit={createConsole}>
            <input
              style={styles.input}
              placeholder="Console Name"
              value={consoleName}
              onChange={(e) => setConsoleName(e.target.value)}
            />
            <input
              style={styles.input}
              placeholder="Price Per Hour"
              value={consolePrice}
              onChange={(e) => setConsolePrice(e.target.value)}
            />
            <button style={styles.button}>Add Console</button>
          </form>

          <table style={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Console</th>
                <th>Price/H</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {consoles.map((c) => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.name}</td>
                  <td>{c.price_per_hour}</td>
                  <td>
                    <button style={styles.deleteBtn} onClick={() => deleteConsole(c.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ========== RENTS ========== */}
        <div style={styles.section}>
          <h2>Rents</h2>

          <form style={styles.form} onSubmit={createRent}>
            <input
              style={styles.input}
              placeholder="User ID"
              value={rentUser}
              onChange={(e) => setRentUser(e.target.value)}
            />
            <input
              style={styles.input}
              placeholder="Console ID"
              value={rentConsole}
              onChange={(e) => setRentConsole(e.target.value)}
            />
            <input
              type="date"
              style={styles.input}
              value={rentDate}
              onChange={(e) => setRentDate(e.target.value)}
            />
            <input
              style={styles.input}
              placeholder="Hours"
              value={rentHours}
              onChange={(e) => setRentHours(e.target.value)}
            />

            <button style={styles.button}>Add Rent</button>
          </form>

          <table style={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Console</th>
                <th>Date</th>
                <th>Hours</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {rents.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.user?.name || 'Unknown'}</td>
                  <td>{r.console?.name || 'Unknown'}</td>
                  <td>{r.rent_date}</td>
                  <td>{r.hours}</td>
                  <td>
                    <button style={styles.deleteBtn} onClick={() => deleteRent(r.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: {
    display: 'flex',
    minHeight: '100vh',
    background: '#f2f2f2',
    fontFamily: 'Segoe UI',
  },
  sidebar: {
    width: '220px',
    background: '#5f72bd',
    padding: '20px',
    color: 'white',
  },
  menu: {
    marginTop: '20px',
    cursor: 'pointer',
    color: '#ddd',
  },
  container: {
    flex: 1,
    padding: '30px',
  },
  header: {
    fontSize: '28px',
    marginBottom: '20px',
  },
  section: {
    background: 'white',
    padding: '20px',
    borderRadius: '10px',
    marginBottom: '30px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  form: {
    display: 'flex',
    gap: '10px',
    marginBottom: '15px',
  },
  input: {
    flex: 1,
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '10px 20px',
    background: '#5f72bd',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  deleteBtn: {
    background: 'red',
    color: 'white',
    padding: '6px 12px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '10px',
  },
}
