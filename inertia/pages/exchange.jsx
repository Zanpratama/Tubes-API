import { useEffect, useState } from 'react'

export default function Exchange() {
  const token = localStorage.getItem('token')

  const [consoles, setConsoles] = useState([])
  const [selectedId, setSelectedId] = useState('')
  const [price, setPrice] = useState(null)
  const [from, setFrom] = useState('IDR')
  const [to, setTo] = useState('USD')
  const [converted, setConverted] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchConsoles() {
      try {
        const res = await fetch('http://localhost:3333/consoles', {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        setConsoles(data)
      } catch (err) {
        alert('Failed to load consoles')
      }
    }
    fetchConsoles()
  }, [])

  const getPriceAndConvert = async () => {
    if (!selectedId) return alert('Please select a console')
    
    setLoading(true)
    try {
      const resConsole = await fetch(
        `http://localhost:3333/auth/consoles/price-convert/${selectedId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      const dataConsole = await resConsole.json()
      const priceIdr = dataConsole.price_per_hour_idr
      setPrice(priceIdr)

      const resExchange = await fetch(
        `http://localhost:3333/auth/exchange?from=${from}&to=${to}&amount=${priceIdr}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      const dataExchange = await resExchange.json()
      const convertedValue = dataExchange.result.conversion_rate * priceIdr
      setConverted(convertedValue.toFixed(2))
    } catch (err) {
      console.error(err)
      alert('Failed to convert price')
    } finally {
      setLoading(false)
    }
  }

  const goDashboard = () => {
    window.location.href = '/dashboard'
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
        .btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.2); }
        .btn:active { transform: translateY(0); }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .loading { animation: pulse 1.5s ease-in-out infinite; }
      `}</style>

      <div style={styles.page}>
        <div style={styles.container}>
          <button className="btn" style={styles.backBtn} onClick={goDashboard}>
            ← Back to Dashboard
          </button>

          <div style={styles.header}>
            <div style={styles.iconBox}></div>
            <h1 style={styles.title}>Currency Converter</h1>
            <p style={styles.subtitle}>Convert console rental prices in real-time</p>
          </div>

          <div style={styles.formCard}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Select Console</label>
              <select 
                style={styles.select} 
                value={selectedId} 
                onChange={(e) => setSelectedId(e.target.value)}
              >
                <option value="">Choose a console...</option>
                {consoles.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.currencyBox}>
              <div style={styles.currencyCard}>
                <label style={styles.label}>From</label>
                <select style={styles.select} value={from} onChange={(e) => setFrom(e.target.value)}>
                  <option value="IDR">🇮🇩 IDR</option>
                </select>
              </div>

              <div style={styles.arrowBox}>
                <div style={styles.arrow}>→</div>
              </div>

              <div style={styles.currencyCard}>
                <label style={styles.label}>To</label>
                <select style={styles.select} value={to} onChange={(e) => setTo(e.target.value)}>
                  <option value="USD">🇺🇸 USD</option>
                  <option value="EUR">🇪🇺 EUR</option>
                  <option value="GBP">🇬🇧 GBP</option>
                  <option value="JPY">🇯🇵 JPY</option>
                  <option value="SGD">🇸🇬 SGD</option>
                  <option value="MYR">🇲🇾 MYR</option>
                  <option value="AUD">🇦🇺 AUD</option>
                </select>
              </div>
            </div>

            <button 
              className="btn" 
              style={loading ? styles.convertBtnLoading : styles.convertBtn} 
              onClick={getPriceAndConvert} 
              disabled={loading}
            >
              {loading ? 'Converting...' : 'Convert Now'}
            </button>

            {price && (
              <div style={styles.resultBox}>
                <div style={styles.resultHeader}>
                  <div style={styles.resultIcon}></div>
                  <span style={styles.resultTitle}>Conversion Result</span>
                </div>

                <div style={styles.resultItem}>
                  <div style={styles.resultLabelBox}>
                    <span style={styles.resultLabel}>Original Price</span>
                    <span style={styles.resultCurrency}>{from}</span>
                  </div>
                  <div style={styles.resultValueBox}>
                    <span style={styles.resultValue}>
                      {price.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                {converted && (
                  <>
                    <div style={styles.divider}></div>
                    <div style={styles.resultItem}>
                      <div style={styles.resultLabelBox}>
                        <span style={styles.resultLabel}>Converted Price</span>
                        <span style={styles.resultCurrency}>{to}</span>
                      </div>
                      <div style={styles.resultValueBox}>
                        <span style={styles.resultHighlight}>
                          {parseFloat(converted).toLocaleString('en-US', { 
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2 
                          })}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          <div style={styles.infoBox}>
            <div style={styles.infoIcon}></div>
            <div>
              <div style={styles.infoTitle}>Exchange Rate Information</div>
              <div style={styles.infoText}>
                Real-time exchange rates powered by ExchangeRate-API
              </div>
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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '30px 20px',
  },
  container: {
    width: '100%',
    maxWidth: '600px',
  },
  backBtn: {
    padding: '10px 18px',
    background: 'rgba(255,255,255,0.2)',
    backdropFilter: 'blur(10px)',
    color: 'white',
    border: '2px solid rgba(255,255,255,0.3)',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    marginBottom: '24px',
    transition: 'all 0.3s',
  },
  header: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  iconBox: {
    fontSize: '64px',
    marginBottom: '16px',
    textShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    color: 'white',
    marginBottom: '8px',
    textShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  subtitle: {
    fontSize: '15px',
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
  },
  formCard: {
    background: 'white',
    borderRadius: '20px',
    padding: '32px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
    marginBottom: '24px',
  },
  formGroup: {
    marginBottom: '24px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#4a5568',
    marginBottom: '8px',
  },
  select: {
    width: '100%',
    padding: '14px 16px',
    fontSize: '15px',
    border: '2px solid #cbd5e0',
    borderRadius: '12px',
    color: '#2d3748',
    cursor: 'pointer',
    background: 'white',
    transition: 'all 0.2s',
    fontWeight: '500',
  },
  currencyBox: {
    display: 'grid',
    gridTemplateColumns: '1fr auto 1fr',
    gap: '16px',
    alignItems: 'end',
    marginBottom: '24px',
  },
  currencyCard: {
    flex: 1,
  },
  arrowBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: '8px',
  },
  arrow: {
    fontSize: '24px',
    color: '#a0aec0',
    fontWeight: 'bold',
  },
  convertBtn: {
    width: '100%',
    padding: '16px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s',
    boxShadow: '0 8px 20px rgba(102, 126, 234, 0.4)',
  },
  convertBtnLoading: {
    width: '100%',
    padding: '16px',
    background: 'linear-gradient(135deg, #a0aec0 0%, #718096 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'not-allowed',
    opacity: 0.7,
  },
  resultBox: {
    background: 'linear-gradient(135deg, #f6f8fb 0%, #e9ecef 100%)',
    padding: '24px',
    borderRadius: '16px',
    marginTop: '24px',
    border: '2px solid #e2e8f0',
  },
  resultHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '20px',
  },
  resultIcon: {
    fontSize: '24px',
  },
  resultTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#2d3748',
  },
  resultItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 0',
  },
  resultLabelBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  resultLabel: {
    fontSize: '13px',
    color: '#718096',
    fontWeight: '600',
  },
  resultCurrency: {
    fontSize: '11px',
    color: '#a0aec0',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  resultValueBox: {
    textAlign: 'right',
  },
  resultValue: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#2d3748',
  },
  resultHighlight: {
    fontSize: '24px',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  divider: {
    height: '2px',
    background: 'linear-gradient(90deg, transparent, #cbd5e0, transparent)',
    margin: '8px 0',
  },
  infoBox: {
    background: 'rgba(255,255,255,0.15)',
    backdropFilter: 'blur(10px)',
    padding: '16px 20px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    border: '1px solid rgba(255,255,255,0.2)',
  },
  infoIcon: {
    fontSize: '28px',
  },
  infoTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: 'white',
    marginBottom: '2px',
  },
  infoText: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.8)',
  },
}