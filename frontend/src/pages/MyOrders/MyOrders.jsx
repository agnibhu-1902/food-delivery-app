import React, { useContext, useEffect, useState } from 'react'
import './MyOrders.css'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../../assets/assets'

const MyOrders = () => {
    const [data, setData] = useState([])
    const {url, token, setRoute} = useContext(StoreContext)

    const fetchOrders = async () => {
        const response = await axios.post(`${url}/api/order/userorders`, {}, {headers: {token}})
        if (response.data.success)
            setData(response.data.data)
        else
            toast.error(response.data.message)
    }

    useEffect(() => {
        setRoute('MyOrders')
      }, [])

    useEffect(() => {
        if (token)
            fetchOrders()
    }, [token])

  return (
    <div className='my-orders'>
        <h2>My Orders</h2>
        <div className="container">
            {data.map((order, index) => {
                return (
                    <div key={index} className="my-orders-order">
                        <img src={assets.parcel_icon} alt="Parcel Icon" />
                        <p>{order.items.map((item, index) => {
                            if (index === order.items.length - 1)
                                return item.name + " x " + item.quantity
                            else
                            return item.name + " x " + item.quantity + ", "
                        })}</p>
                        <p>₹{order.amount}</p>
                        <p>Items: {order.items.length}</p>
                        <p><span className={order.status === 'Food Processing' ? 'red' : (order.status === 'Out for Delivery' ? 'yellow' : 'green')}>&#x25cf;</span>&nbsp;<b>{order.status}</b></p>
                        <button onClick={fetchOrders}>Track Order</button>
                    </div>
                )
            })}
        </div>
    </div>
  )
}

export default MyOrders