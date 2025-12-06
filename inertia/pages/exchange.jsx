import { useEffect, useState } from 'react'

export default function Exchange() {
  const token = localStorage.getItem('token')

  const [consoles, setConsoles] = useState([])
  const [selectedId, setSelectedId] = useState('')
  const [price, setPrice] = useState(null)
  const [from, setFrom] = useState('IDR')
  const [to, setTo] = useState('USD')
  const [converted, setConverted] = useState(null)

  /* --------------------- AMBIL DAFTAR KONSOL --------------------- */
  useEffect(() => {
    async function fetchConsoles() {
      try {
        const res = await fetch('http://localhost:3333/consoles', {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        setConsoles(data)
      } catch (err) {
        alert('Gagal memuat daftar konsol')
      }
    }
    fetchConsoles()
  }, [])

  /* --------------------- AMBIL HARGA DAN KONVERSI --------------------- */
  const getPriceAndConvert = async () => {
    if (!selectedId) return
    try {
      // Ambil harga konsol
      const resConsole = await fetch(
        `http://localhost:3333/auth/consoles/price-convert/${selectedId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      const dataConsole = await resConsole.json()
      console.log('DATA KONSOL:', dataConsole)

      const priceIdr = dataConsole.price_per_hour_idr
      setPrice(priceIdr)

      // Ambil conversion rate dari API exchange
      const resExchange = await fetch(
        `http://localhost:3333/auth/exchange?from=${from}&to=${to}&amount=${priceIdr}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      const dataExchange = await resExchange.json()
      console.log('DATA EXCHANGE:', dataExchange)

      const convertedValue = dataExchange.result.conversion_rate * priceIdr
      setConverted(convertedValue.toFixed(2))
    } catch (err) {
      console.error(err)
      alert('Gagal mengambil harga atau melakukan konversi')
    }
  }

  const goDashboard = () => {
    window.location.href = '/dashboard'
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>Konversi Harga Konsol</h1>

          <button style={styles.backBtn} onClick={goDashboard}>
            Kembali
          </button>
        </div>

        {/* SELECT KONSOL */}
        <label style={styles.label}>Pilih Konsol:</label>
        <select
          style={styles.input}
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
        >
          <option value="">-- Pilih --</option>
          {consoles.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <button style={styles.button} onClick={getPriceAndConvert}>
          Ambil Harga & Konversi
        </button>

        {price && (
          <div style={styles.resultBox}>
            <div style={styles.resultRow}>
              <span>Harga Asli:</span>
              <b>
                {price} {from}
              </b>
            </div>
            {converted && (
              <div style={styles.resultRow}>
                <span>Hasil Konversi:</span>
                <b>
                  {converted} {to}
                </b>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

/* --------------------- STYLE MIRIP DASHBOARD --------------------- */
const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #5e60ceff, #4361ee, #3a0ca3)',
    padding: '20px',
  },

  card: {
    width: '100%',
    maxWidth: '450px',
    background: 'rgba(255, 255, 255, 0.15)',
    padding: '30px',
    borderRadius: '20px',
    color: 'white',
    backdropFilter: 'blur(15px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },

  backBtn: {
    background: 'white',
    color: '#3a0ca3',
    padding: '8px 15px',
    borderRadius: '10px',
    cursor: 'pointer',
    border: 'none',
    fontWeight: 'bold',
  },

  title: {
    fontSize: '28px',
    fontWeight: 'bold',
  },

  label: {
    marginTop: '10px',
    display: 'block',
    fontWeight: 'bold',
  },

  input: {
    width: '100%',
    padding: '12px',
    marginTop: '5px',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.4)',
    background: 'rgba(255,255,255,0.2)',
    color: 'black',
  },

  button: {
    width: '100%',
    padding: '12px',
    marginTop: '15px',
    borderRadius: '12px',
    border: 'none',
    background: 'white',
    color: '#3a0ca3',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '16px',
  },

  resultBox: {
    marginTop: '20px',
    background: 'rgba(255,255,255,0.2)',
    padding: '15px',
    borderRadius: '15px',
    border: '1px solid rgba(255,255,255,0.3)',
    backdropFilter: 'blur(10px)',
  },

  resultRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '8px',
    fontSize: '16px',
  },
}
