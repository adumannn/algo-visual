import { useState } from 'react'

let nextId = 1

function createNode(value) {
  return { id: nextId++, value }
}

export default function LinkedListVisualizer() {
  const [nodes, setNodes] = useState([])
  const [inputVal, setInputVal] = useState('')
  const [indexVal, setIndexVal] = useState('')
  const [lastOp, setLastOp] = useState(null)
  const [highlightId, setHighlightId] = useState(null)
  const [searchResult, setSearchResult] = useState(null)

  const getVal = () => {
    const v = inputVal.trim() === '' ? Math.floor(Math.random() * 99) + 1 : parseInt(inputVal)
    if (isNaN(v)) return null
    return v
  }

  const flash = (id) => {
    setHighlightId(id)
    setTimeout(() => setHighlightId(null), 600)
  }

  const addToHead = () => {
    const v = getVal()
    if (v === null) return
    const node = createNode(v)
    setNodes(prev => [node, ...prev])
    setInputVal('')
    setLastOp(`Added ${v} at head`)
    setSearchResult(null)
    flash(node.id)
  }

  const addToTail = () => {
    const v = getVal()
    if (v === null) return
    const node = createNode(v)
    setNodes(prev => [...prev, node])
    setInputVal('')
    setLastOp(`Added ${v} at tail`)
    setSearchResult(null)
    flash(node.id)
  }

  const insertAt = () => {
    const v = getVal()
    if (v === null) return
    const idx = parseInt(indexVal)
    if (isNaN(idx) || idx < 0 || idx > nodes.length) {
      setLastOp(`Invalid index (0-${nodes.length})`)
      return
    }
    const node = createNode(v)
    setNodes(prev => {
      const copy = [...prev]
      copy.splice(idx, 0, node)
      return copy
    })
    setInputVal('')
    setIndexVal('')
    setLastOp(`Inserted ${v} at index ${idx}`)
    setSearchResult(null)
    flash(node.id)
  }

  const removeHead = () => {
    if (nodes.length === 0) return
    const removed = nodes[0]
    setNodes(prev => prev.slice(1))
    setLastOp(`Removed ${removed.value} from head`)
    setSearchResult(null)
  }

  const removeTail = () => {
    if (nodes.length === 0) return
    const removed = nodes[nodes.length - 1]
    setNodes(prev => prev.slice(0, -1))
    setLastOp(`Removed ${removed.value} from tail`)
    setSearchResult(null)
  }

  const searchValue = () => {
    const v = getVal()
    if (v === null) return
    const idx = nodes.findIndex(n => n.value === v)
    if (idx === -1) {
      setLastOp(`${v} not found`)
      setSearchResult(null)
    } else {
      setLastOp(`Found ${v} at index ${idx}`)
      setSearchResult(nodes[idx].id)
      flash(nodes[idx].id)
    }
  }

  const clear = () => {
    setNodes([])
    setLastOp(null)
    setSearchResult(null)
    setHighlightId(null)
  }

  return (
    <div>
      <div className="viz-header">
        <h1>Linked List</h1>
        <p>Visualize singly linked list operations — add, remove, search</p>
      </div>

      <div className="controls">
        <input
          className="input"
          type="number"
          placeholder="Value"
          value={inputVal}
          onChange={e => setInputVal(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addToTail()}
        />
        <button className="btn btn-primary" onClick={addToHead}>
          Add Head
        </button>
        <button className="btn btn-primary" onClick={addToTail}>
          Add Tail
        </button>

        <div className="separator" />

        <input
          className="input"
          type="number"
          placeholder="Index"
          value={indexVal}
          onChange={e => setIndexVal(e.target.value)}
          style={{ width: 60 }}
        />
        <button className="btn btn-secondary" onClick={insertAt}>
          Insert At
        </button>

        <div className="separator" />

        <button className="btn btn-danger" onClick={removeHead} disabled={nodes.length === 0}>
          Remove Head
        </button>
        <button className="btn btn-danger" onClick={removeTail} disabled={nodes.length === 0}>
          Remove Tail
        </button>
        <button className="btn btn-secondary" onClick={searchValue}>
          Search
        </button>
        <button className="btn btn-secondary" onClick={clear}>
          Clear
        </button>

        {lastOp && <span className="badge badge-accent">{lastOp}</span>}
        <span className="badge badge-warning">Size: {nodes.length}</span>
      </div>

      <div className="viz-area">
        {nodes.length === 0 ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '200px',
            color: 'var(--text-dim)',
            fontSize: '0.85rem',
          }}>
            Add nodes to the linked list
          </div>
        ) : (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0',
            minHeight: '200px',
            padding: '12px',
            flexWrap: 'wrap',
            rowGap: '16px',
          }}>
            <div style={{
              fontSize: '0.6rem',
              color: 'var(--accent)',
              fontWeight: 600,
              marginRight: '8px',
            }}>HEAD</div>

            {nodes.map((node, idx) => (
              <div key={node.id} style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{
                  display: 'flex',
                  border: `1px solid ${
                    highlightId === node.id || searchResult === node.id
                      ? 'var(--accent)'
                      : 'var(--border)'
                  }`,
                  borderRadius: 'var(--radius)',
                  overflow: 'hidden',
                  background: highlightId === node.id || searchResult === node.id
                    ? 'rgba(99, 102, 241, 0.15)'
                    : 'var(--surface-2)',
                  transition: 'all 0.3s ease',
                  transform: highlightId === node.id ? 'scale(1.08)' : 'scale(1)',
                }}>
                  {/* Data part */}
                  <div style={{
                    padding: '12px 16px',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    borderRight: '1px solid var(--border)',
                    minWidth: '50px',
                    textAlign: 'center',
                  }}>
                    {node.value}
                  </div>
                  {/* Pointer part */}
                  <div style={{
                    padding: '12px 10px',
                    fontSize: '0.65rem',
                    color: 'var(--text-dim)',
                    display: 'flex',
                    alignItems: 'center',
                  }}>
                    {idx < nodes.length - 1 ? '●' : '∅'}
                  </div>
                </div>
                {/* Arrow between nodes */}
                {idx < nodes.length - 1 && (
                  <div style={{
                    color: 'var(--text-dim)',
                    fontSize: '0.8rem',
                    padding: '0 4px',
                  }}>→</div>
                )}
              </div>
            ))}

            <div style={{
              fontSize: '0.6rem',
              color: 'var(--text-dim)',
              fontWeight: 600,
              marginLeft: '8px',
            }}>NULL</div>
          </div>
        )}

        {nodes.length > 0 && (
          <div style={{
            display: 'flex',
            gap: '12px',
            marginTop: '16px',
            fontSize: '0.7rem',
            color: 'var(--text-dim)',
            borderTop: '1px solid var(--border)',
            paddingTop: '12px',
          }}>
            <span>Nodes: {nodes.length}</span>
            <span>•</span>
            <span>Head: {nodes[0].value}</span>
            <span>•</span>
            <span>Tail: {nodes[nodes.length - 1].value}</span>
          </div>
        )}
      </div>
    </div>
  )
}
