import React from 'react'
import './navbar.css'

const Navbar = () => {
  return (
    <div className='navbar'>
        <ul className="nav-menu">
        <li><a href="#macros-count">Macros Count</a></li>
        <li><a href="#your-target">Your Target</a></li>
        <li><a href="#add-meals">Add Meals</a></li>
        <li><a href="#progress">Progress</a></li>
        </ul>
        
    </div>
  )
}

export default Navbar
