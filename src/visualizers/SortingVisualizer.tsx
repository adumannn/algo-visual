import { useState, useRef, useCallback, useEffect } from 'react'

type SortAlgo = 'bubble' | 'insertion' | 'selection' | 'quick'

interface Bar {
  value: number
  state: 'idle' | 'comparing' | 'swapping' | 'sorted'
}

function generateArray(size: number): Bar[] {
  return Array.from({ length: size }, () => ({
    value: Math.floor(Math.random() * 300) + 20,
    state: 'idle' as const,
  }))
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export default function SortingVisualizer() {
  const [bars, setBars] = useState<Bar[]>(() => generateArray(40))
  const [algo, setAlgo] = useState<SortAlgo>('bubble')
  const [speed, setSpeed] = useState(50)
  const [sorting, setSorting] = useState(false)
  const [comparisons, setComparisons] = useState(0)
  const stopRef = useRef(false)
  const barsRef = useRef(bars)

  useEffect(() => {
    barsRef.current = bars
  }, [bars])

  const delay = useCallback(() => sleep(Math.max(1, 200 - speed * 2)), [speed])

  const reset = () => {
    stopRef.current = true
    setSorting(false)
    setComparisons(0)
    setBars(generateArray(40))
  }

  const updateBars = (arr: Bar[]) => {
    setBars([...arr])
    barsRef.current = [...arr]

  }
//bubble
  const bubbleSort = async (arr: Bar[]) => {
    let cmps = 0
    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        if (stopRef.current) return
        arr[j].state = 'comparing'
        arr[j + 1].state = 'comparing'
        updateBars(arr)
        cmps++
        setComparisons(cmps)
        await delay()

        if (arr[j].value > arr[j + 1].value) {
          arr[j].state = 'swapping'
          arr[j + 1].state = 'swapping'
          updateBars(arr)
          await delay()
          ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
        }
        arr[j].state = 'idle'
        arr[j + 1].state = 'idle'
      }
      arr[arr.length - 1 - i].state = 'sorted'
      updateBars(arr)
    }
    arr[0].state = 'sorted'
    updateBars(arr)
  }
  //insertion
  const insertionSort = async (arr: Bar[]) => {
    let cmps = 0
    arr[0].state = 'sorted'
    updateBars(arr)
    for (let i = 1; i < arr.length; i++) {
      if (stopRef.current) return
      const key = arr[i]
      key.state = 'comparing'
      updateBars(arr)
      await delay()
      let j = i - 1
      while (j >= 0 && arr[j].value > key.value) {
        if (stopRef.current) return
        cmps++
        setComparisons(cmps)
        arr[j].state = 'swapping'
        arr[j + 1] = arr[j]
        updateBars(arr)
        await delay()
        arr[j].state = 'sorted'
        j--
      }
      cmps++
      setComparisons(cmps)
      arr[j + 1] = key
      key.state = 'sorted'
      updateBars(arr)
      await delay()
    }
  }

  const selectionSort = async (arr: Bar[]) => {
    let cmps = 0
    for (let i = 0; i < arr.length - 1; i++) {
      let minIdx = i
      arr[i].state = 'comparing'
      updateBars(arr)
      for (let j = i + 1; j < arr.length; j++) {
        if (stopRef.current) return
        arr[j].state = 'comparing'
        updateBars(arr)
        cmps++
        setComparisons(cmps)
        await delay()
        if (arr[j].value < arr[minIdx].value) {
          if (minIdx !== i) arr[minIdx].state = 'idle'
          minIdx = j
          arr[minIdx].state = 'swapping'
        } else {
          arr[j].state = 'idle'
        }
        updateBars(arr)
      }
      if (minIdx !== i) {
        ;[arr[i], arr[minIdx]] = [arr[minIdx], arr[i]]
      }
      arr[minIdx].state = 'idle'
      arr[i].state = 'sorted'
      updateBars(arr)
    }
    arr[arr.length - 1].state = 'sorted'
    updateBars(arr)
  }

  const quickSort = async (arr: Bar[]) => {
    let cmps = 0
    const partition = async (low: number, high: number): Promise<number> => {
      const pivot = arr[high]
      pivot.state = 'swapping'
      let i = low - 1
      for (let j = low; j < high; j++) {
        if (stopRef.current) return -1
        arr[j].state = 'comparing'
        updateBars(arr)
        cmps++
        setComparisons(cmps)
        await delay()
        if (arr[j].value < pivot.value) {
          i++
          ;[arr[i], arr[j]] = [arr[j], arr[i]]
        }
        arr[j].state = 'idle'
        updateBars(arr)
      }
      ;[arr[i + 1], arr[high]] = [arr[high], arr[i + 1]]
      arr[i + 1].state = 'sorted'
      updateBars(arr)
      return i + 1
    }

    const sort = async (low: number, high: number) => {
      if (low < high && !stopRef.current) {
        const pi = await partition(low, high)
        if (pi === -1) return
        await sort(low, pi - 1)
        await sort(pi + 1, high)
      } else if (low >= 0 && low < arr.length) {
        arr[low].state = 'sorted'
        updateBars(arr)
      }
    }
    await sort(0, arr.length - 1)
  }

  const startSort = async () => {
    stopRef.current = false
    setSorting(true)
    setComparisons(0)
    const arr = bars.map(b => ({ ...b, state: 'idle' as const }))
    setBars(arr)
    barsRef.current = arr

    switch (algo) {
      case 'bubble': await bubbleSort(arr); break
      case 'insertion': await insertionSort(arr); break
      case 'selection': await selectionSort(arr); break
      case 'quick': await quickSort(arr); break
    }
    setSorting(false)
  }

  const maxVal = Math.max(...bars.map(b => b.value))

  return (
    <div>
      <div className="viz-header">
        <h1>Sorting Algorithms</h1>
        <p>swapping, comparing</p>
      </div>

      <div className="controls">
        <select
          className="select"
          value={algo}
          onChange={e => setAlgo(e.target.value as SortAlgo)}
          disabled={sorting}
        >
          <option value="bubble">Bubble Sort</option>
          <option value="insertion">Insertion Sort</option>
          <option value="selection">Selection Sort</option>
          <option value="quick">Quick Sort</option>
        </select>

        <div className="slider-group">
          <label>Speed</label>
          <input
            type="range"
            className="slider"
            min="1"
            max="100"
            value={speed}
            onChange={e => setSpeed(Number(e.target.value))}
          />
        </div>

        <div className="separator" />

        <button className="btn btn-primary" onClick={startSort} disabled={sorting}>
          {sorting ? 'Sorting...' : 'Start'}
        </button>
        <button className="btn btn-secondary" onClick={reset}>
          Reset
        </button>

        {comparisons > 0 && (
          <span className="badge badge-accent">{comparisons} comparisons</span>
        )}
      </div>

      <div className="viz-area">
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: '2px',
          height: '340px',
          width: '100%',
        }}>
          {bars.map((bar, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: `${(bar.value / maxVal) * 100}%`,
                borderRadius: '3px 3px 0 0',
                transition: 'height 0.1s ease, background 0.1s ease',
                background: bar.state === 'sorted'
                  ? 'var(--success)'
                  : bar.state === 'swapping'
                  ? 'var(--danger)'
                  : bar.state === 'comparing'
                  ? 'var(--warning)'
                  : 'var(--accent)',
              }}
            />
          ))}
        </div>

        <div style={{
          display: 'flex',
          gap: '16px',
          marginTop: '16px',
          fontSize: '0.7rem',
          color: 'var(--text-dim)',
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--accent)' }} /> Idle
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--warning)' }} /> Comparing
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--danger)' }} /> Swapping
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--success)' }} /> Sorted
          </span>
        </div>
      </div>
    </div>
  )
}
