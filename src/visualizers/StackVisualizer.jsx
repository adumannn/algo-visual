import { useState } from 'react'

let nextId = 0

export default function StackVisualizer() {
  const [items, setItems] = useState([])
  const [inputVal, setInputVal] = useState('')
  const [lastOp, setLastOp] = useState(null)
  const [peeked, setPeeked] = useState(null)

  const push = () => {
    const val = inputVal.trim() === '' ? Math.floor(Math.random() * 99) + 1 : parseInt(inputVal)
    if (isNaN(val)) return
    const item = { id: nextId++, value: val, entering: true }
    setItems(prev => [...prev, item])
    setInputVal('')
    setLastOp(`Pushed ${val}`)
    setPeeked(null)
    setTimeout(() => {
      setItems(prev => prev.map(i => i.id === item.id ? { ...i, entering: false } : i))
    }, 50)
  }

  const pop = () => {
    if (items.length === 0) return
    const removed = items[items.length - 1]
    setLastOp(`Popped ${removed.value}`)
    setItems(prev => prev.slice(0, -1))
    setPeeked(null)
  }

  const peek = () => {
    if (items.length === 0) return
    const target = items[items.length - 1]
    setPeeked(target.id)
    setLastOp(`Peek: ${target.value}`)
  }

  const clear = () => {
    setItems([])
    setLastOp(null)
    setPeeked(null)
  }

  return (
    <div>
      <div className="viz-header">
        <h1>Stack</h1>
        <p>Visualize LIFO (Last In, First Out) data structure</p>
      </div>

      <div className="controls">
        <input
          className="input"
          type="number"
          placeholder="Value"
          value={inputVal}
          onChange={e => setInputVal(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && push()}
        />
        <button className="btn btn-primary" onClick={push}>
          Push
        </button>
        <button className="btn btn-danger" onClick={pop} disabled={items.length === 0}>
          Pop
        </button>
        <button className="btn btn-secondary" onClick={peek} disabled={items.length === 0}>
          Peek
        </button>
        <button className="btn btn-secondary" onClick={clear}>
          Clear
        </button>

        {lastOp && <span className="badge badge-accent">{lastOp}</span>}
        <span className="badge badge-warning">Size: {items.length}</span>
      </div>

      <div className="viz-area">
        {items.length === 0 ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '340px',
            color: 'var(--text-dim)',
            fontSize: '0.85rem',
          }}>
            Push items onto the stack
          </div>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column-reverse',
            alignItems: 'center',
            gap: '4px',
            minHeight: '340px',
            justifyContent: 'flex-start',
            paddingTop: '20px',
          }}>
            {items.map((item, idx) => (
              <div
                key={item.id}
                style={{
                  width: '140px',
                  padding: '12px 16px',
                  background: peeked === item.id
                    ? 'var(--accent)'
                    : 'var(--surface-2)',
                  border: `1px solid ${
                    peeked === item.id
                      ? 'var(--accent)'
                      : idx === items.length - 1
                      ? 'var(--accent-hover)'
                      : 'var(--border)'
                  }`,
                  borderRadius: 'var(--radius)',
                  textAlign: 'center',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  transition: 'all 0.2s ease',
                  transform: item.entering ? 'scale(1.1)' : 'scale(1)',
                  opacity: item.entering ? 0.7 : 1,
                  position: 'relative',
                }}
              >
                {item.value}
                {idx === items.length - 1 && (
                  <span style={{
                    position: 'absolute',
                    right: '-45px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '0.65rem',
                    color: 'var(--accent)',
                  }}>← TOP</span>
                )}
                {idx === 0 && items.length > 1 && (
                  <span style={{
                    position: 'absolute',
                    right: '-60px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '0.65rem',
                    color: 'var(--text-dim)',
                  }}>← BOTTOM</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
