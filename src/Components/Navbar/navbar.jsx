import { useEffect, useState } from 'react'
import './navbar.css'

const navItems = [
  {
    id: 'macros-count',
    label: 'Macros',
    description: 'Macros count',
    icon: (
      <>
        <path d="M4 19V11" />
        <path d="M10 19V5" />
        <path d="M16 19v-6" />
        <path d="M20 19H3" />
      </>
    ),
  },
  {
    id: 'your-target',
    label: 'Target',
    description: 'Your target',
    icon: (
      <>
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
  },
  {
    id: 'add-meals',
    label: 'Meals',
    description: 'Add meals',
    icon: (
      <>
        <circle cx="12" cy="12" r="8" />
        <path d="M12 8.5v7" />
        <path d="M8.5 12h7" />
      </>
    ),
  },
  {
    id: 'progress',
    label: 'Progress',
    description: 'Progress',
    icon: (
      <>
        <path d="M4 15.5 9.5 10l4 4L20 7.5" />
        <path d="M15 7.5h5v5" />
      </>
    ),
  },
]

const Navbar = () => {
  const [activeSection, setActiveSection] = useState(navItems[0].id)

  useEffect(() => {
    const sections = navItems
      .map((item) => document.getElementById(item.id))
      .filter(Boolean)

    // Only count a section as active once it reaches the middle band of the screen.
    const observer = new IntersectionObserver(
      (entries) => {
        const mostVisible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0]
        if (mostVisible) setActiveSection(mostVisible.target.id)
      },
      { rootMargin: '-45% 0px -45% 0px' },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  return (
    <nav className="navbar" aria-label="Sections">
      <span className="nav-brand">MacroTracker</span>
      <ul className="nav-menu">
        {navItems.map((item) => (
          <li className={activeSection === item.id ? 'active' : ''} key={item.id}>
            <a
              href={`#${item.id}`}
              aria-label={item.description}
              aria-current={activeSection === item.id ? 'true' : undefined}
            >
              <svg
                className="nav-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                {item.icon}
              </svg>
              <span className="nav-label">{item.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Navbar
