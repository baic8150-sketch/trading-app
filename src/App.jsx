import { useEffect, useRef, useState } from 'react'
import { createChart, CandlestickSeries } from 'lightweight-charts'

const NAV = ['Dashboard', 'Markets', 'Trading', 'Portfolio']

const icons = {
  Dashboard: '🏠',
  Markets: '📊',
  Trading: '📈',
  Portfolio: '💼',
}

function Sidebar({ active, setActive }) {
  return (
    <div style={{ width: 200, background: '#111418', height: '100vh', display: 'flex', flexDirection: 'column', padding: '24px 0', borderRight: '1px solid #1e2329' }}>
      <div style={{ fontSize: 18, fontWeight: 'bold', color: '#eaecef', padding: '0 24px 32px' }}>⚡ CryptoApp</div>
      {NAV.map(n => (
        <div key={n} onClick={() => setActive(n)} style={{
          padding: '12px 24px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12,
          background: active === n ? '#1e2329' : 'transparent',
          color: active === n ? '#00c853' : '#848e9c',
          borderLeft: active === n ? '3px solid #00c853' : '3px solid transparent',
          fontSize: 14, fontWeight: active === n ? 'bold' : 'normal',
        }}>
          {icons[n]} {n}
        </div>
      ))}
    </div>
  )
}

function Dashboard() {
  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ color: '#eaecef', marginBottom: 24 }}>Dashboard</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {[['Total Balance', '10,000 USDT', '#00c853'], ['BTC Price', 'Loading...', '#f0b90b'], ['24h Change', '+2.34%', '#00c853']].map(([label, val, color]) => (
          <div key={label} style={{ background: '#1e2329', borderRadius: 12, padding: 24 }}>
            <div style={{ color: '#848e9c', fontSize: 12, marginBottom: 8 }}>{label}</div>
            <div style={{ color, fontSize: 22, fontWeight: 'bold' }}>{val}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Markets() {
  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ color: '#eaecef', marginBottom: 24 }}>Markets</h2>
      <div style={{ color: '#848e9c' }}>Coming soon...</div>
    </div>
  )
}

function TradingPage({ price, balance, position }) {
  const chartRef = useRef(null)
  const [amount, setAmount] = useState('')
  const [bal, setBal] = useState(balance)
  const [pos, setPos] = useState(position)
  const [logs, setLogs] = useState([])

  useEffect(() => {
    if (!chartRef.current) return
    const chart = createChart(chartRef.current, {
      width: chartRef.current.offsetWidth,
      height: 400,
      layout: { background: { color: '#0b0e11' }, textColor: '#eaecef' },
      grid: { vertLines: { color: '#1e2329' }, horzLines: { color: '#1e2329' } },
    })
    const series = chart.addSeries(CandlestickSeries, {
      upColor: '#00c853', downColor: '#ef5350',
      borderVisible: false, wickUpColor: '#00c853', wickDownColor: '#ef5350',
    })
    const fetchKlines = async () => {
      const res = await fetch('https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1m&limit=50')
      const data = await res.json()
      series.setData(data.map(k => ({ time: Math.floor(k[0] / 1000), open: +k[1], high: +k[2], low: +k[3], close: +k[4] })))
      chart.timeScale().fitContent()
    }
    fetchKlines()
    const t = setInterval(fetchKlines, 5000)
    return () => { clearInterval(t); chart.remove() }
  }, [])

  const buy = () => {
    const qty = parseFloat(amount)
    const cost = qty * parseFloat(price)
    if (!qty || cost > bal) return
    setBal(b => +(b - cost).toFixed(2))
    setPos(p => +(p + qty).toFixed(6))
    setLogs(l => [`Buy ${qty} BTC @ ${price}`, ...l])
    setAmount('')
  }

  const sell = () => {
    const qty = parseFloat(amount)
    if (!qty || qty > pos) return
    setBal(b => +(b + qty * parseFloat(price)).toFixed(2))
    setPos(p => +(p - qty).toFixed(6))
    setLogs(l => [`Sell ${qty} BTC @ ${price}`, ...l])
    setAmount('')
  }

  return (
    <div style={{ display: 'flex', flex: 1 }}>
      <div style={{ flex: 1, padding: 16 }}>
        <div ref={chartRef} style={{ width: '100%' }} />
      </div>
      <div style={{ width: 260, background: '#1e2329', padding: 20, display: 'flex', flexDirection: 'column', gap: 16, borderLeft: '1px solid #2b3139' }}>
        <div>
          <div style={{ color: '#848e9c', fontSize: 12 }}>Balance</div>
          <div style={{ fontSize: 20, fontWeight: 'bold', color: '#eaecef' }}>{bal} USDT</div>
        </div>
        <div>
          <div style={{ color: '#848e9c', fontSize: 12 }}>Position</div>
          <div style={{ fontSize: 20, fontWeight: 'bold', color: '#eaecef' }}>{pos} BTC</div>
        </div>
        <input type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)}
          style={{ padding: 10, borderRadius: 6, border: '1px solid #2b3139', background: '#0b0e11', color: '#eaecef', fontSize: 14 }} />
        <button onClick={buy} style={{ padding: 12, background: '#00c853', border: 'none', borderRadius: 6, color: '#fff', fontWeight: 'bold', fontSize: 15, cursor: 'pointer' }}>Buy</button>
        <button onClick={sell} style={{ padding: 12, background: '#ef5350', border: 'none', borderRadius: 6, color: '#fff', fontWeight: 'bold', fontSize: 15, cursor: 'pointer' }}>Sell</button>
        <div>
          <div style={{ color: '#848e9c', fontSize: 12, marginBottom: 8 }}>History</div>
          {logs.map((l, i) => <div key={i} style={{ fontSize: 12, color: '#eaecef', padding: '4px 0', borderBottom: '1px solid #2b3139' }}>{l}</div>)}
        </div>
      </div>
    </div>
  )
}

function Portfolio() {
  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ color: '#eaecef', marginBottom: 24 }}>Portfolio</h2>
      <div style={{ color: '#848e9c' }}>Coming soon...</div>
    </div>
  )
}

export default function App() {
  const [active, setActive] = useState('Trading')
  const [price, setPrice] = useState(null)

  useEffect(() => {
    const fetch_ = async () => {
      const res = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT')
      const d = await res.json()
      setPrice(parseFloat(d.price).toFixed(2))
    }
    fetch_()
    const t = setInterval(fetch_, 5000)
    return () => clearInterval(t)
  }, [])

  const pages = { Dashboard: <Dashboard />, Markets: <Markets />, Trading: <TradingPage price={price} balance={10000} position={0} />, Portfolio: <Portfolio /> }

  return (
    <div style={{ display: 'flex', background: '#0b0e11', minHeight: '100vh', color: '#eaecef', fontFamily: 'sans-serif' }}>
      <Sidebar active={active} setActive={setActive} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ background: '#1e2329', padding: '12px 24px', fontSize: 16, fontWeight: 'bold', borderBottom: '1px solid #2b3139' }}>
          BTC/USDT &nbsp; <span style={{ color: '#00c853' }}>{price ? `${price} USDT` : 'Loading...'}</span>
        </div>
        <div style={{ flex: 1, display: 'flex' }}>
          {pages[active]}
        </div>
      </div>
    </div>
  )
}
