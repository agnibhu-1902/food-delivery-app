import React, { useState, useContext } from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'
import {toast} from 'react-toastify'

const LoginPopup = ({ setShowLogin }) => {
    const [currState, setCurrState] = useState('Login')
    const {url, setToken} = useContext(StoreContext)
    const [data, setData] = useState({
        name: '',
        email: '',
        password: ''
    })

    const onChangeHandler = event => {
        const name = event.target.name
        const value = event.target.value
        setData(data => ({...data, [name]: value}))
    }

    const onLogin = async event => {
        event.preventDefault()
        let newUrl = url
        if (currState === 'Login')
            newUrl += '/api/user/login'
        else
            newUrl += '/api/user/register'
        const response = await axios.post(newUrl, data)
        if (response.data.success) {
            setToken(response.data.token)
            localStorage.setItem("token", response.data.token)
            setShowLogin(false)
        } else {
            toast.error(response.data.message)
        }
    }

    // useEffect(() => {
    //     console.log(data)
    // }, [data])

  return (
    <div className='login-popup'>
        <form onSubmit={onLogin} className="login-popup-container">
            <div className="login-popup-title">
                <h2>{currState}</h2>
                <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="Close" />
            </div>
            <div className="login-popup-inputs">
                {currState === 'Login' ? <></> : <input onChange={onChangeHandler} name='name' value={data.name} type="text" placeholder='Full Name' required autoComplete='off' />}
                <input onChange={onChangeHandler} name='email' value={data.email} type="email" placeholder='Email' required />
                <input onChange={onChangeHandler} name='password' value={data.password} type="password" placeholder='Password' required />
            </div>
            {currState === 'Login'
            ? <></>
            : <div className="login-popup-condition">
                <input type="checkbox" id='checkbox' required />
                <label htmlFor='checkbox'>By continuing, I agree to the terms of use and privacy policy.</label>
            </div>}
            <button type='submit'>{currState === 'Sign Up' ? 'Create Account' : 'Login'}</button>
            {currState === 'Login'
            ? <p>Create a new account? <span onClick={() => setCurrState('Sign Up')}>&nbsp;Click here</span></p>
            : <p>Already have an account? <span onClick={() => setCurrState('Login')}>&nbsp;Login</span></p>}
        </form>
    </div>
  )
}

export default LoginPopup