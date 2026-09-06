import { useState } from 'react'
import { formatINR } from '../data/products'

const METHODS = [
  { id: 'upi', label: 'UPI', hint: 'GPay · PhonePe · Paytm' },
  { id: 'card', label: 'Cards', hint: 'Visa · Mastercard · RuPay' },
  { id: 'net', label: 'Netbanking', hint: 'All Indian banks' },
  { id: 'wallet', label: 'Wallets', hint: 'Paytm · Amazon Pay' },
]

const BANKS = ['HDFC Bank', 'SBI', 'ICICI Bank', 'Axis Bank', 'Kotak', 'Bank of Baroda']

export default function PaySheet({ amount, onClose, onPaid }) {
  const [tab, setTab] = useState('upi')
  const [upi, setUpi] = useState('')
  const [bank, setBank] = useState(BANKS[0])
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  const pay = () => {
    if (tab === 'upi' && upi && !/^[a-zA-Z0-9.\-_]{2,}@[a-zA-Z]{2,}$/.test(upi.trim())) {
      setErr('Enter a UPI ID such as name@okaxis — demo only, not sent anywhere.')
      return
    }
    setErr('')
    setBusy(true)
    window.setTimeout(() => {
      const labels = {
        upi: `Razorpay demo · UPI${upi.trim() ? ` ${upi.trim()}` : ''}`,
        card: 'Razorpay demo · Card',
        net: `Razorpay demo · ${bank}`,
        wallet: 'Razorpay demo · Wallet',
      }
      onPaid(labels[tab])
    }, 900)
  }

  return (
    <div className="rzp-mask" role="dialog" aria-modal="true" aria-labelledby="rzp-title">
      <div className="rzp-sheet">
        <header className="rzp-head">
          <div>
            <p className="eyebrow" style={{ color: '#93c5fd' }}>Secure checkout</p>
            <h2 id="rzp-title">Trendora Pay</h2>
            <p>Amount {formatINR(amount)}</p>
          </div>
          <button type="button" className="icon-btn" style={{ color: '#fff' }} onClick={onClose} aria-label="Close payment">
            ×
          </button>
        </header>
        <p className="rzp-demo">Razorpay-style options · college demo · no money is charged · no bank is connected</p>
        <div className="rzp-tabs">
          {METHODS.map((m) => (
            <button key={m.id} type="button" className={tab === m.id ? 'on' : ''} onClick={() => setTab(m.id)}>
              {m.label}
            </button>
          ))}
        </div>
        <div className="rzp-body">
          {tab === 'upi' && (
            <>
              <p className="muted">{METHODS[0].hint}. Scan is not live; type a UPI ID or pay empty for demo.</p>
              <div className="field">
                <label>UPI ID (optional, not stored)</label>
                <input value={upi} onChange={(e) => setUpi(e.target.value)} placeholder="name@okaxis" autoComplete="off" />
              </div>
            </>
          )}
          {tab === 'card' && (
            <p className="muted">
              A live store would open Razorpay’s card form. We do not collect card number or CVV here — nothing is charged.
            </p>
          )}
          {tab === 'net' && (
            <div className="field">
              <label>Bank</label>
              <select value={bank} onChange={(e) => setBank(e.target.value)}>
                {BANKS.map((b) => (
                  <option key={b}>{b}</option>
                ))}
              </select>
            </div>
          )}
          {tab === 'wallet' && <p className="muted">Wallet apps would open in a live Razorpay checkout. Demo records Wallet only.</p>}
          {err && <div className="error">{err}</div>}
          <button className="btn btn-primary btn-block" type="button" disabled={busy} onClick={pay}>
            {busy ? 'Confirming demo payment…' : `Pay ${formatINR(amount)} (demo)`}
          </button>
          <p className="rzp-foot">Powered by Razorpay layout · Test mode</p>
        </div>
      </div>
    </div>
  )
}
