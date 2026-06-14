import { useEffect, useRef, useState } from 'react'
// import是导入,从官网上（react）导入了三个工具：useEffect, useRef, useState
// useState 是用来"存东西"的，存balance、position，数据变了页面自动刷新
// useEffect 是用来"做事情"的，去Binance拉数据这个动作，就是放在useEffect里触发的
import { createChart, CandlestickSeries } from 'lightweight-charts'
// 从lightweight-charts库中导入了创建图表和添加蜡烛图系列的工具
const NAV = ['Dashboard', 'Markets', 'Trading', 'Portfolio']
// const是常量的意思，这四个是左侧导航菜单
// Dashboard（仪表盘）、Markets（市场）、Trading（交易）和Portfolio（投资组合）
const icons = {
  Dashboard: '🏠',
  Markets: '📊',
  Trading: '📈',
  Portfolio: '💼',
}
// icons是一个对象，对应的emoji图标，用于在侧边栏显示
const MARKET_COINS = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'DOGEUSDT']
// MARKET_COINS是一个数组，存了要展示的币种交易对
// 从Binance拉数据的时候用这些symbol去请求
function Sidebar({ active, setActive }) {
  // function
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

function Dashboard({ initialBalance, setInitialBalance, resetAccount, price, balance }) {
  const [inputVal, setInputVal] = useState(String(initialBalance))

  const handleSave = () => {
    const val = parseFloat(inputVal)
    if (!val || val <= 0) return
    setInitialBalance(val)
  }

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ color: '#eaecef', marginBottom: 24 }}>Dashboard</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {[['Total Balance', `${balance.toFixed(2)} USDT`, '#00c853'], ['BTC Price', price ? `${price} USDT` : 'Loading...', '#f0b90b'], ['24h Change', '+2.34%', '#00c853']].map(([label, val, color]) => (
          <div key={label} style={{ background: '#1e2329', borderRadius: 12, padding: 24 }}>
            <div style={{ color: '#848e9c', fontSize: 12, marginBottom: 8 }}>{label}</div>
            <div style={{ color, fontSize: 22, fontWeight: 'bold' }}>{val}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 32, background: '#1e2329', borderRadius: 12, padding: 24 }}>
        <h3 style={{ color: '#eaecef', marginTop: 0, marginBottom: 20 }}>Account Settings</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <label style={{ color: '#848e9c', fontSize: 14, minWidth: 110 }}>Initial Balance</label>
          <input
            type="number"
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #2b3139', background: '#0b0e11', color: '#eaecef', fontSize: 14, width: 160 }}
          />
          <span style={{ color: '#848e9c', fontSize: 14 }}>USDT</span>
          <button onClick={handleSave} style={{ padding: '8px 18px', background: '#00c853', border: 'none', borderRadius: 6, color: '#fff', fontWeight: 'bold', fontSize: 14, cursor: 'pointer' }}>
            Save
          </button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={resetAccount} style={{ padding: '10px 20px', background: '#ef5350', border: 'none', borderRadius: 6, color: '#fff', fontWeight: 'bold', fontSize: 14, cursor: 'pointer' }}>
            Reset Account
          </button>
          <span style={{ color: '#848e9c', fontSize: 12 }}>Clear all positions & trade history, restore initial balance</span>
        </div>
      </div>
    </div>
  )
}

function Markets() {
  const [coinsData, setCoinsData] = useState([])
  // 有一个叫coinsData的数组，初始是空的，（等数据拉回来再往里塞）
  useEffect(() => {
  const fetchCoins = async () => {
    // fetchCoins是一个异步函数，负责拉所有币种的数据
    const results = await Promise.all(
      // Promise.all同时发多个请求，MARKET_COINS里有几个币就发几个
      MARKET_COINS.map(symbol =>
        fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`)
          .then(res => res.json())
      )
    )
    setCoinsData(results.map(d => ({
      symbol: d.symbol,
      price: parseFloat(d.lastPrice).toFixed(2),
      change: parseFloat(d.priceChangePercent).toFixed(2)
    })))
  }
  // 把返回的数据整理成我们需要的格式，存进coinsData
  fetchCoins()
  // 立刻执行一次
  const t = setInterval(fetchCoins, 5000)
  // 每5秒刷新一次数据
  return () => clearInterval(t)
  // 组件销毁时清除定时器
}, [])
return (
    <div style={{ padding: 32 }}>
    {/* 整个页面的容器，加个内边距 */}
      <h2 style={{ color: '#eaecef', marginBottom: 24 }}>Markets</h2>
      {coinsData.map(coin => (
        // coinsData现在是一个数组，里面有5个币种的数据，我们用map把它们渲染成一行行的div
        <div key={coin.symbol} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#1e2329', borderRadius: 8, padding: '12px 20px', marginBottom: 8 }}>
          <div style={{ color: '#eaecef', fontWeight: 'bold' }}>{coin.symbol}</div>
          {/* 币种名，比如BTCUSDT */}
          <div style={{ color: '#f0b90b' }}>{coin.price} USDT</div>
          {/* 价格 */}
          <div style={{ color: coin.change >= 0 ? '#00c853' : '#ef5350' }}>{coin.change}%</div>
          {/* 24小时涨跌幅，正数是绿色，负数是红色 */}
        </div>
      ))}
    </div>
  )
}

function TradingPage({
  price,
  balance,
  setBalance,
  position,
  setPosition,
  avgPrice,
setAvgPrice,
logs,
  setLogs
}) {
  const chartRef = useRef(null)
  const [amount, setAmount] = useState('')
  

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
    if (!qty || cost > balance) return
    setBalance(
  b => +(b - cost).toFixed(2)
)
console.log('position=', position)
console.log('avgPrice=', avgPrice)
console.log('price=', price)
const newPosition = position + qty

const newAvgPrice =
(
  position * avgPrice +
  qty * Number(price)
) / newPosition

setPosition(
  +newPosition.toFixed(6)
)

setAvgPrice(
  +newAvgPrice.toFixed(2)
)
    setLogs(l => [`Buy ${qty} BTC @ ${price}`, ...l])
    setAmount('')
  }

  const sell = () => {
    const qty = parseFloat(amount)
    if (!qty || qty > position) return
    setBalance(
  b => +(b + qty * parseFloat(price)).toFixed(2)
)

setPosition(
  p => +(p - qty).toFixed(6)
)
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
          <div style={{ fontSize: 20, fontWeight: 'bold', color: '#eaecef' }}>{balance} USDT</div>
        </div>
        <div>
          <div style={{ color: '#848e9c', fontSize: 12 }}>Position</div>
          <div style={{ fontSize: 20, fontWeight: 'bold', color: '#eaecef' }}>{position} BTC</div>
          <div
  style={{
    color: '#f0b90b',
    fontSize: 16,
    marginTop: 8
  }}
>
  Value: {(position * Number(price)).toFixed(2)} USDT
  <div style={{color:'#888'}}>
  Avg Price: {avgPrice}
</div>
  <div
  style={{
    color:
      Number(price) >= avgPrice
        ? '#00c853'
        : '#ef5350',
    fontSize: 16,
    marginTop: 8
  }}
>
  PnL: {((Number(price) - avgPrice) * position).toFixed(2)} USDT
</div>
</div>
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

function Portfolio({ balance, position, price }) {
  return (
  <div style={{ padding: 32 }}>
    <h2 style={{ color: '#eaecef' }}>Portfolio</h2>

    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 16,
        marginTop: 20
      }}
    >
      <div style={{
        background:'#1e2329',
        padding:20,
        borderRadius:12
      }}>
        <div style={{color:'#848e9c'}}>Cash</div>
        <div style={{fontSize:24,fontWeight:'bold'}}>
          {balance.toFixed(2)} USDT
        </div>
      </div>

      <div style={{
        background:'#1e2329',
        padding:20,
        borderRadius:12
      }}>
        <div style={{color:'#848e9c'}}>BTC</div>
        <div style={{fontSize:24,fontWeight:'bold'}}>
          {position} BTC
        </div>
        <div style={{marginTop:10,color:'#848e9c'}}>
  Value
</div>

<div style={{fontSize:20,fontWeight:'bold'}}>
  {(position * Number(price)).toFixed(2)} USDT
</div>
      </div>

      <div style={{
        background:'#1e2329',
        padding:20,
        borderRadius:12
      }}>
        <div style={{color:'#848e9c'}}>Current BTC Price</div>

<div style={{
  fontSize:24,
  fontWeight:'bold',
  color:'#f0b90b'
}}>
  {price} USDT
</div>
        <div style={{color:'#848e9c'}}>Total Assets</div>
        <div style={{
          fontSize:24,
          fontWeight:'bold',
          color:'#00c853'
        }}>
          {(balance + position * Number(price)).toFixed(2)} USDT
        </div>
      </div>
    </div>
  </div>
)
}

export default function App() {
  const [active, setActive] = useState('Trading')
  const [price, setPrice] = useState(null)
  const [balance, setBalance] = useState(() => {
  return Number(localStorage.getItem('balance')) || 10000
})

const [position, setPosition] = useState(() => {

  return Number(localStorage.getItem('position')) || 0
})

const [avgPrice, setAvgPrice] = useState(() => {
  return Number(localStorage.getItem('avgPrice')) || 0
})

const [logs, setLogs] = useState(() => {
  return JSON.parse(localStorage.getItem('logs')) || []
})

const [initialBalance, setInitialBalance] = useState(() => {
  return Number(localStorage.getItem('initialBalance')) || 10000
})
useEffect(() => {
  localStorage.setItem('balance', balance)
}, [balance])

useEffect(() => {
  localStorage.setItem('position', position)
}, [position])

useEffect(() => {
  localStorage.setItem('logs', JSON.stringify(logs))
}, [logs])

useEffect(() => {
  localStorage.setItem('avgPrice', avgPrice)
}, [avgPrice])

useEffect(() => {
  localStorage.setItem('initialBalance', initialBalance)
}, [initialBalance])

const resetAccount = () => {
  if (!window.confirm('Reset account? All positions and trade history will be cleared, and your balance will be restored to the initial amount. This action cannot be undone.')) return
  setBalance(initialBalance)
  setPosition(0)
  setAvgPrice(0)
  setLogs([])
}

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

  const pages = { Dashboard: <Dashboard initialBalance={initialBalance} setInitialBalance={setInitialBalance} resetAccount={resetAccount} price={price} balance={balance} />, Markets: <Markets />, Trading: <TradingPage
  price={price}
  balance={balance}
  setBalance={setBalance}
  position={position}
  setPosition={setPosition}
  avgPrice={avgPrice}
setAvgPrice={setAvgPrice}
logs={logs}
  setLogs={setLogs}
/>, Portfolio: <Portfolio balance={balance} position={position} price={price} /> }

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
