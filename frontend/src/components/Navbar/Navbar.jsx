import React, { useContext } from 'react'
import { useState } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext'

const Navbar = ({ setShowLogin }) => {

    const [menu, setMenu] = useState('home')
    const {getTotalCartAmount, token, setToken, route} = useContext(StoreContext)
    const navigate = useNavigate()

    const logout = () => {
        localStorage.removeItem('token')
        setToken('')
        navigate('/')
    }

  return (
    <div className='navbar'>
        <Link to='/'><img src={assets.logo} alt="Logo" className='logo' /></Link>
        <ul className="navbar-menu">
            <Link to='/' onClick={() => setMenu('home')} className={route === 'Home' && menu === 'home' ? 'active' : ''}>Home</Link>
            {route === 'Home'
            ? <><a href='#explore-menu' onClick={() => setMenu('menu')} className={menu === 'menu' ? 'active' : ''}>Menu</a>
              <a href='#app-download' onClick={() => setMenu('mobileApp')} className={menu === 'mobileApp' ? 'active' : ''}>Mobile App</a></>
            : ''}
            <a href='#footer' onClick={() => setMenu('contactUs')} className={menu === 'contactUs' ? 'active' : ''}>Contact Us</a>
        </ul>
        <div className="navbar-right">
            <img src={assets.search_icon} alt="Search Icon" />
            <div className="navbar-search-icon">
                <Link to='/cart'><img src={assets.basket_icon} alt="Basket Icon" /></Link>
                <div className={getTotalCartAmount() > 0 ? 'dot' : ''}></div>
            </div>
            {!token
                ? <button onClick={() => setShowLogin(true)}>Sign In</button>
                : <div className='navbar-profile'>
                    <img src={assets.profile_icon} alt="Profile Icon" />
                    <ul className="navbar-profile-dropdown">
                        <li onClick={() => navigate('/myorders')}><img src={assets.bag_icon} alt="Bag Icon" /><p>Orders</p></li>
                        <hr />
                        <li onClick={logout}><img src={assets.logout_icon} alt="Logout Icon" /><p>Logout</p></li>
                    </ul>
                </div>
            }
        </div>
    </div>
  )
}

export default Navbar