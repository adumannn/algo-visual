import { useState } from 'react'
import { Routes, Route, NavLink, useLocation } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import SortingVisualizer from './visualizers/SortingVisualizer'
import LinkedListVisualizer from './visualizers/LinkedListVisualizer'
import StackVisualizer from './visualizers/StackVisualizer'
import './App.css'


//nav
const navItems = [
  { path: '/', label: 'Sorting' },
  { path: '/linked-list', label: 'Linked List' },
  { path: '/stack', label: 'Stack' },
]

//insert. bubble quick linked lifo fifo

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  const handleNavClick = () => setMenuOpen(false)

  return (
    <div className="app">
      <button
        className="menu-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <span className={`hamburger ${menuOpen ? 'open' : ''}`} />
      </button>

      {menuOpen && <div className="sidebar-overlay" onClick={() => setMenuOpen(false)} />}

      <nav className={`sidebar ${menuOpen ? 'sidebar-open' : ''}`}>
        <div className="logo">
          <span>algo</span>
        </div>
        <div className="nav-links">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={handleNavClick}
            >
              {item.label}
            </NavLink>
          ))}
        </div>
        <div className="sidebar-footer">
          <span className="text-dim">версия 1</span>
        </div>
      </nav>
      <main className="content">
        <Routes>
          <Route path="/" element={<SortingVisualizer />} />
          <Route path="/linked-list" element={<LinkedListVisualizer />} />
          <Route path="/stack" element={<StackVisualizer />} />
        </Routes>
      </main>
      <Analytics />
    </div>
  )
}