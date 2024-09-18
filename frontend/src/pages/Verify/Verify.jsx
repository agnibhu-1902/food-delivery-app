import React, { useContext, useEffect } from 'react'
import './Verify.css'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'

const Verify = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const success = searchParams.get('success')
    const orderId = searchParams.get('orderId')
    const {url, setRoute, setDiscount} = useContext(StoreContext)
    const navigate = useNavigate()

    const verifyPayment = async () => {
        const response = await axios.post(`${url}/api/order/verify`, {success, orderId})
        if (response.data.success) {
            setDiscount(0)
            navigate('/myorders')
        }
        else
            navigate('/')
    }
    useEffect(() => {
        verifyPayment()
        setRoute('Verify')
    }, [])

  return (
    <div className='verify'>
        <div className="spinner"></div>
    </div>
  )
}

export default Verify