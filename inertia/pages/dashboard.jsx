import { useEffect, useState } from 'react'

export default function Dashboard() {
  const token = localStorage.getItem('token')

  const [consoles, setConsoles] = useState([])
  const [rents, setRents] = useState([])
  const [showConsoleForm, setShowConsoleForm] = useState(false)
  const [showRentForm, setShowRentForm] = useState(false)
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
    setTimeout(() => setSuccessMsg(null), 3500)
  }

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

  const saveConsole = async () => {
    const method = consoleForm.id ? 'PUT' : 'POST'
    const url = consoleForm.id
      ? `http://localhost:3333/consoles/${consoleForm.id}`
      : 'http://localhost:3333/consoles'

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(consoleForm),
    })

    showSuccess(consoleForm.id ? '✅ Console updated' : '✅ Console added')
    setConsoleForm({ id: null, name: '', price_per_hour: '' })
    setShowConsoleForm(false)
    fetchAll()
  }

  const deleteConsole = async (id) => {
    if (!confirm('Delete this console?')) return
    await fetch(`http://localhost:3333/consoles/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    showSuccess('🗑️ Console deleted')
    fetchAll()
  }

  const saveRent = async () => {
    const method = rentForm.id ? 'PUT' : 'POST'
    const url = rentForm.id
      ? `http://localhost:3333/rents/${rentForm.id}`
      : 'http://localhost:3333/rents'

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(rentForm),
    })

    showSuccess(rentForm.id ? '✅ Rental updated' : '✅ Rental created')
    setRentForm({ id: null, user_id: '', console_id: '', rent_date: '', hours: '' })
    setShowRentForm(false)
    fetchAll()
  }

  const deleteRent = async (id) => {
    if (!confirm('Delete this rental?')) return
    await fetch(`http://localhost:3333/rents/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    showSuccess('🗑️ Rental deleted')
    fetchAll()
  }

  const logout = () => {
    localStorage.removeItem('token')
    window.location.href = '/'
  }

  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
        }
        .btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.15); }
        .btn:active { transform: translateY(0); }
        tr:hover { background: #f8f9ff; }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .toast-animate { animation: slideIn 0.3s ease; }
      `}</style>

      <div style={styles.page}>
        {/* NAVBAR */}
        <div style={styles.navbar}>
          <div style={styles.navContent}>
            <div style={styles.brand}>
              <div style={styles.brandLogo}></div>
              <div>
                <div style={styles.brandText}>Console Rental</div>
                <div style={styles.brandSub}>Management System</div>
              </div>
            </div>
            <div style={styles.navActions}>
              <button
                className="btn"
                style={styles.exchangeBtn}
                onClick={() => (window.location.href = '/exchange_pages')}
              >
                Exchange
              </button>
              <button className="btn" onClick={logout} style={styles.logoutBtn}>
                Logout
              </button>
            </div>
          </div>
        </div>

        <div style={styles.container}>
          {/* SUCCESS TOAST */}
          {successMsg && (
            <div className="toast-animate" style={styles.toast}>
              {successMsg}
            </div>
          )}

          {/* STATS CARDS */}
          <div style={styles.statsGrid}>
            <div style={styles.statCard1}>
              <div style={styles.statIcon}></div>
              <div>
                <div style={styles.statLabel}>Total Consoles</div>
                <div style={styles.statValue}>{consoles.length}</div>
              </div>
            </div>
            <div style={styles.statCard2}>
              <div style={styles.statIcon}></div>
              <div>
                <div style={styles.statLabel}>Active Rentals</div>
                <div style={styles.statValue}>{rents.length}</div>
              </div>
            </div>
          </div>

          {/* CONSOLE SECTION */}
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <div style={styles.headerLeft}>
                <div style={styles.sectionIcon}></div>
                <div>
                  <h2 style={styles.sectionTitle}>Console Management</h2>
                  <p style={styles.sectionSubtitle}>Manage your gaming consoles inventory</p>
                </div>
              </div>
              <button
                className="btn"
                style={showConsoleForm ? styles.cancelBtn : styles.addBtn}
                onClick={() => {
                  setShowConsoleForm(!showConsoleForm)
                  if (showConsoleForm) setConsoleForm({ id: null, name: '', price_per_hour: '' })
                }}
              >
                {showConsoleForm ? '✕ Close' : '+ Add Console'}
              </button>
            </div>

            {showConsoleForm && (
              <div style={styles.formBox}>
                <div style={styles.formGrid}>
                  <div>
                    <label style={styles.label}>Console Name</label>
                    <input
                      style={styles.input}
                      placeholder="e.g. PlayStation 5"
                      value={consoleForm.name}
                      onChange={(e) => setConsoleForm({ ...consoleForm, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label style={styles.label}>Price per Hour (IDR)</label>
                    <input
                      style={styles.input}
                      placeholder="50000"
                      type="number"
                      value={consoleForm.price_per_hour}
                      onChange={(e) =>
                        setConsoleForm({ ...consoleForm, price_per_hour: e.target.value })
                      }
                    />
                  </div>
                </div>
                <button className="btn" style={styles.submitBtn} onClick={saveConsole}>
                  {consoleForm.id ? 'Update Console' : 'Add Console'}
                </button>
              </div>
            )}

            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>ID</th>
                    <th style={styles.th}>Console Name</th>
                    <th style={styles.th}>Price/Hour</th>
                    <th style={styles.thRight}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {consoles.map((c) => (
                    <tr key={c.id}>
                      <td style={styles.td}>
                        <span style={styles.badge}>{c.id}</span>
                      </td>
                      <td style={styles.td}>
                        <div style={styles.consoleName}>{c.name}</div>
                      </td>
                      <td style={styles.td}>
                        <span style={styles.price}>Rp {c.pricePerHour?.toLocaleString('id-ID')}</span>
                      </td>
                      <td style={styles.tdRight}>
                        <button
                          className="btn"
                          style={styles.editBtn}
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
                        <button className="btn" style={styles.deleteBtn} onClick={() => deleteConsole(c.id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* RENT SECTION */}
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <div style={styles.headerLeft}>
                <div style={styles.sectionIcon}></div>
                <div>
                  <h2 style={styles.sectionTitle}>Rental Management</h2>
                  <p style={styles.sectionSubtitle}>Track and manage console rentals</p>
                </div>
              </div>
              <button
                className="btn"
                style={showRentForm ? styles.cancelBtn : styles.addBtn}
                onClick={() => {
                  setShowRentForm(!showRentForm)
                  if (showRentForm)
                    setRentForm({ id: null, user_id: '', console_id: '', rent_date: '', hours: '' })
                }}
              >
                {showRentForm ? '✕ Close' : '+ New Rental'}
              </button>
            </div>

            {showRentForm && (
              <div style={styles.formBox}>
                <div style={styles.formGrid}>
                  <div>
                    <label style={styles.label}>User ID</label>
                    <input
                      style={styles.input}
                      placeholder="1"
                      type="number"
                      value={rentForm.user_id}
                      onChange={(e) => setRentForm({ ...rentForm, user_id: e.target.value })}
                    />
                  </div>
                  <div>
                    <label style={styles.label}>Console ID</label>
                    <input
                      style={styles.input}
                      placeholder="1"
                      type="number"
                      value={rentForm.console_id}
                      onChange={(e) => setRentForm({ ...rentForm, console_id: e.target.value })}
                    />
                  </div>
                  <div>
                    <label style={styles.label}>Rental Date</label>
                    <input
                      style={styles.input}
                      type="datetime-local"
                      value={rentForm.rent_date}
                      onChange={(e) => setRentForm({ ...rentForm, rent_date: e.target.value })}
                    />
                  </div>
                  <div>
                    <label style={styles.label}>Duration (hours)</label>
                    <input
                      style={styles.input}
                      placeholder="3"
                      type="number"
                      value={rentForm.hours}
                      onChange={(e) => setRentForm({ ...rentForm, hours: e.target.value })}
                    />
                  </div>
                </div>
                <button className="btn" style={styles.submitBtn} onClick={saveRent}>
                  {rentForm.id ? 'Update Rental' : 'Create Rental'}
                </button>
              </div>
            )}

            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>ID</th>
                    <th style={styles.th}>User ID</th>
                    <th style={styles.th}>Console ID</th>
                    <th style={styles.th}>Date</th>
                    <th style={styles.th}>Duration</th>
                    <th style={styles.thRight}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rents.map((r) => (
                    <tr key={r.id}>
                      <td style={styles.td}>
                        <span style={styles.badge}>{r.id}</span>
                      </td>
                      <td style={styles.td}>User #{r.userId}</td>
                      <td style={styles.td}>Console #{r.consoleId}</td>
                      <td style={styles.td}>
                        {new Date(r.rentDate).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td style={styles.td}>
                        <span style={styles.hoursBadge}>{r.hours}h</span>
                      </td>
                      <td style={styles.tdRight}>
                        <button
                          className="btn"
                          style={styles.editBtn}
                          onClick={() => {
                            setRentForm(r)
                            setShowRentForm(true)
                          }}
                        >
                          Edit
                        </button>
                        <button className="btn" style={styles.deleteBtn} onClick={() => deleteRent(r.id)}>
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
      </div>
    </>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    paddingBottom: '40px',
  },
  navbar: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderBottom: '3px solid rgba(255,255,255,0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    backdropFilter: 'blur(10px)',
  },
  navContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  brandLogo: {
    fontSize: '32px',
  },
  brandText: {
    fontSize: '20px',
    fontWeight: '700',
    color: 'white',
    lineHeight: '1.2',
  },
  brandSub: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  navActions: {
    display: 'flex',
    gap: '12px',
  },
  exchangeBtn: {
    padding: '10px 20px',
    background: 'rgba(255,255,255,0.2)',
    backdropFilter: 'blur(10px)',
    color: 'white',
    border: '2px solid rgba(255,255,255,0.3)',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  logoutBtn: {
    padding: '10px 20px',
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
    boxShadow: '0 4px 15px rgba(245, 87, 108, 0.3)',
  },
  container: {
    maxWidth: '1200px',
    margin: '30px auto',
    padding: '0 24px',
  },
  toast: {
    background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    color: 'white',
    padding: '16px 24px',
    borderRadius: '12px',
    marginBottom: '24px',
    fontSize: '15px',
    fontWeight: '600',
    boxShadow: '0 8px 20px rgba(17, 153, 142, 0.3)',
    textAlign: 'center',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  statCard1: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '24px',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)',
  },
  statCard2: {
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    padding: '24px',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    boxShadow: '0 8px 24px rgba(240, 147, 251, 0.3)',
  },
  statIcon: {
    fontSize: '40px',
  },
  statLabel: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
    marginBottom: '4px',
  },
  statValue: {
    fontSize: '32px',
    fontWeight: '700',
    color: 'white',
  },
  section: {
    background: 'white',
    borderRadius: '16px',
    padding: '28px',
    marginBottom: '24px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '16px',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  sectionIcon: {
    fontSize: '36px',
  },
  sectionTitle: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: '4px',
  },
  sectionSubtitle: {
    fontSize: '14px',
    color: '#718096',
  },
  addBtn: {
    padding: '11px 22px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
  },
  cancelBtn: {
    padding: '11px 22px',
    background: 'linear-gradient(135deg, #cbd5e0 0%, #a0aec0 100%)',
    color: '#2d3748',
    border: 'none',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  formBox: {
    background: 'linear-gradient(135deg, #f6f8fb 0%, #e9ecef 100%)',
    padding: '24px',
    borderRadius: '12px',
    marginBottom: '24px',
    border: '2px solid #e2e8f0',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '18px',
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#4a5568',
    marginBottom: '8px',
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    fontSize: '14px',
    border: '2px solid #cbd5e0',
    borderRadius: '8px',
    color: '#2d3748',
    transition: 'all 0.2s',
    background: 'white',
  },
  submitBtn: {
    width: '100%',
    padding: '14px',
    background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
    boxShadow: '0 4px 15px rgba(17, 153, 142, 0.3)',
  },
  tableWrapper: {
    overflowX: 'auto',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    padding: '14px 16px',
    textAlign: 'left',
    fontSize: '13px',
    fontWeight: '700',
    color: '#4a5568',
    background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
    borderBottom: '2px solid #cbd5e0',
  },
  thRight: {
    padding: '14px 16px',
    textAlign: 'right',
    fontSize: '13px',
    fontWeight: '700',
    color: '#4a5568',
    background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
    borderBottom: '2px solid #cbd5e0',
  },
  td: {
    padding: '16px',
    fontSize: '14px',
    color: '#2d3748',
    borderBottom: '1px solid #e2e8f0',
  },
  tdRight: {
    padding: '16px',
    textAlign: 'right',
    borderBottom: '1px solid #e2e8f0',
  },
  badge: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '600',
  },
  consoleName: {
    fontWeight: '600',
    color: '#2d3748',
  },
  price: {
    color: '#38a169',
    fontWeight: '600',
    fontSize: '15px',
  },
  hoursBadge: {
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    color: 'white',
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '600',
  },
  editBtn: {
    padding: '8px 16px',
    background: 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    marginRight: '8px',
    transition: 'all 0.3s',
  },
  deleteBtn: {
    padding: '8px 16px',
    background: 'linear-gradient(135deg, #fc8181 0%, #f56565 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
}