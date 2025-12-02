import { useEffect, useState } from 'react'

export default function Dashboard() {
  const token = localStorage.getItem('token')

  const [consoles, setConsoles] = useState([])
  const [rents, setRents] = useState([])

  const [showConsoleForm, setShowConsoleForm] = useState(false)
  const [showRentForm, setShowRentForm] = useState(false)

  // FORM STATE
  const [consoleForm, setConsoleForm] = useState({ id: null, name: '', price_per_hour: '' })
  const [rentForm, setRentForm] = useState({
    id: null,
    user_id: '',
    console_id: '',
    rent_date: '',
    hours: '',
  })

  const [successMsg, setSuccessMsg] = useState(null)

  const showSuccess = (msg) => {
    setSuccessMsg(msg)
    setTimeout(() => setSuccessMsg(null), 2000)
  }

  // Fetch data
  const fetchAll = async () => {
    const headers = { Authorization: `Bearer ${token}` }

    const consoleRes = await fetch('http://localhost:3333/consoles', { headers })
    setConsoles(await consoleRes.json())

    const rentRes = await fetch('http://localhost:3333/rents', { headers })
    setRents(await rentRes.json())
  }

  useEffect(() => {
    fetchAll()
  }, [])

  // CRUD Console
  const saveConsole = async () => {
    const method = consoleForm.id ? 'PUT' : 'POST'
    const url = consoleForm.id
      ? `http://localhost:3333/consoles/${consoleForm.id}`
      : 'http://localhost:3333/consoles'

    await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(consoleForm),
    })

    showSuccess(consoleForm.id ? 'Console updated' : 'Console added')

    setConsoleForm({ id: null, name: '', price_per_hour: '' })
    setShowConsoleForm(false)
    fetchAll()
  }

  const deleteConsole = async (id) => {
    await fetch(`http://localhost:3333/consoles/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    showSuccess('Console deleted')
    fetchAll()
  }

  // CRUD Rent
  const saveRent = async () => {
    const method = rentForm.id ? 'PUT' : 'POST'
    const url = rentForm.id
      ? `http://localhost:3333/rents/${rentForm.id}`
      : 'http://localhost:3333/rents'

    await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(rentForm),
    })

    showSuccess(rentForm.id ? 'Rent updated' : 'Rent added')

    setRentForm({ id: null, user_id: '', console_id: '', rent_date: '', hours: '' })
    setShowRentForm(false)
    fetchAll()
  }

  const deleteRent = async (id) => {
    await fetch(`http://localhost:3333/rents/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    showSuccess('Rent deleted')
    fetchAll()
  }

  const logout = () => {
    localStorage.removeItem('token')
    window.location.href = '/'
  }

  return (
    <>
      <style>
        {`
      input::placeholder {
        color: white;
        opacity: 1;
      }
    `}
      </style>

      <div style={styles.page}>
        <div style={styles.cardLarge}>
          {/* HEADER */}
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <h1 style={styles.title}>Dashboard</h1>
            <button onClick={logout} style={styles.logoutBtn}>
              Logout
            </button>
          </div>

          {/* SUCCESS POPUP */}
          {successMsg && <div style={styles.successBox}>{successMsg}</div>}

          {/* ========== TABLES SECTION ========== */}
          <div style={styles.section}>
            <h2 style={styles.subtitle}>Console List</h2>

            <button style={styles.addBtn} onClick={() => setShowConsoleForm(!showConsoleForm)}>
              {showConsoleForm ? 'Close Form' : 'Add Console'}
            </button>

            {/* FORM CONSOLE */}
            {showConsoleForm && (
              <div style={styles.form}>
                <input
                  style={styles.input}
                  placeholder="Name"
                  value={consoleForm.name}
                  onChange={(e) => setConsoleForm({ ...consoleForm, name: e.target.value })}
                />
                <input
                  style={styles.input}
                  placeholder="Price / Hour"
                  type="number"
                  value={consoleForm.price_per_hour}
                  onChange={(e) =>
                    setConsoleForm({ ...consoleForm, price_per_hour: e.target.value })
                  }
                />

                <button style={styles.button} onClick={saveConsole}>
                  {consoleForm.id ? 'Update Console' : 'Create Console'}
                </button>
              </div>
            )}

            {/* TABLE CONSOLE */}
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Price/Hour</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {consoles.map((c) => (
                  <tr key={c.id}>
                    <td>{c.id}</td>
                    <td>{c.name}</td>
                    <td>{c.pricePerHour}</td>
                    <td>
                      <button
                        style={styles.smallBtn}
                        onClick={() => {
                          setConsoleForm({
                            id: c.id,
                            name: c.name,
                            price_per_hour: c.pricePerHour,
                          })
                          setShowConsoleForm(true)
                        }}
                      >
                        Edit
                      </button>
                      <button style={styles.deleteBtn} onClick={() => deleteConsole(c.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* RENT TABLE */}
          <div style={styles.section}>
            <h2 style={styles.subtitle}>Rent List</h2>

            <button style={styles.addBtn} onClick={() => setShowRentForm(!showRentForm)}>
              {showRentForm ? 'Close Form' : 'Add Rent'}
            </button>

            {/* FORM RENT */}
            {showRentForm && (
              <div style={styles.form}>
                <input
                  style={styles.input}
                  placeholder="User ID"
                  value={rentForm.user_id}
                  onChange={(e) => setRentForm({ ...rentForm, user_id: e.target.value })}
                />
                <input
                  style={styles.input}
                  placeholder="Console ID"
                  value={rentForm.console_id}
                  onChange={(e) => setRentForm({ ...rentForm, console_id: e.target.value })}
                />
                <input
                  style={styles.input}
                  type="datetime-local"
                  value={rentForm.rent_date}
                  onChange={(e) => setRentForm({ ...rentForm, rent_date: e.target.value })}
                />
                <input
                  style={styles.input}
                  placeholder="Hours"
                  type="number"
                  value={rentForm.hours}
                  onChange={(e) => setRentForm({ ...rentForm, hours: e.target.value })}
                />

                <button style={styles.button} onClick={saveRent}>
                  {rentForm.id ? 'Update Rent' : 'Create Rent'}
                </button>
              </div>
            )}

            {/* TABLE RENT */}
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
                    <td>{r.userId}</td>
                    <td>{r.consoleId}</td>
                    <td>{r.rentDate}</td>
                    <td>{r.hours}</td>
                    <td>
                      <button
                        style={styles.smallBtn}
                        onClick={() => {
                          setRentForm(r)
                          setShowRentForm(true)
                        }}
                      >
                        Edit
                      </button>

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
    </>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    padding: '30px',
    background: 'linear-gradient(135deg, #5e60ce, #4361ee, #3a0ca3)',
    display: 'flex',
    justifyContent: 'center',
  },

  cardLarge: {
    width: '100%',
    maxWidth: '1100px',
    background: 'rgba(255, 255, 255, 0.15)',
    padding: '40px',
    borderRadius: '20px',
    color: 'white',
    backdropFilter: 'blur(15px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
  },

  title: { fontSize: '32px', fontWeight: 'bold' },
  subtitle: { fontSize: '24px', marginBottom: '10px' },

  logoutBtn: {
    background: 'white',
    color: '#3a0ca3',
    padding: '10px 20px',
    borderRadius: '10px',
    cursor: 'pointer',
    border: 'none',
    fontWeight: 'bold',
  },

  addBtn: {
    background: 'white',
    color: '#3a0ca3',
    padding: '8px 15px',
    borderRadius: '10px',
    cursor: 'pointer',
    border: 'none',
    fontWeight: 'bold',
    marginBottom: '10px',
  },

  table: {
    width: '100%',
    marginTop: '15px',
    background: 'rgba(255,255,255,0.2)',
    borderRadius: '10px',
    padding: '10px',
    tableLayout: 'fixed',
    borderCollapse: 'collapse',
    width: '100%',
    textAlign: 'center',
  },

  smallBtn: {
    marginRight: '10px',
    background: 'white',
    color: '#3a0ca3',
    padding: '5px 10px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },

  deleteBtn: {
    background: 'red',
    color: 'white',
    padding: '5px 10px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },

  form: {
    marginTop: '10px',
    marginBottom: '10px',
    background: 'rgba(255,255,255,0.1)',
    padding: '15px',
    borderRadius: '15px',
  },

  input: {
    width: '100%',
    padding: '12px',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.4)',
    background: 'rgba(255,255,255,0.2)',
    color: 'white',
    marginBottom: '10px',
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
  },

  section: { marginTop: '30px' },

  successBox: {
    background: 'rgba(0,255,0,0.4)',
    padding: '10px',
    borderRadius: '10px',
    marginBottom: '15px',
    textAlign: 'center',
    fontWeight: 'bold',
  },

  th: {
    padding: '10px',
    textAlign: 'left',
    borderBottom: '1px solid rgba(255,255,255,0.3)',
    color: 'white',
    textAlign: 'center',
    verticalAlign: 'middle',
  },

  td: {
    padding: '10px',
    borderBottom: '1px solid rgba(255,255,255,0.2)',
    color: 'white',
    wordWrap: 'break-word',
    textAlign: 'center',
    verticalAlign: 'middle',
  },
}
