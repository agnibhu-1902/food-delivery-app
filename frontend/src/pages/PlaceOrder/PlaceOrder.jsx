import React, { useState, useContext, useEffect } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../context/StoreContext'
import { toast } from 'react-toastify'
import axios from 'axios'
import { assets } from '../../assets/assets'
import { redirect, useNavigate } from 'react-router-dom'

const PlaceOrder = () => {
    const {getTotalCartAmount, deliveryFee, token, food_list, cartItems, url, setRoute, discount} = useContext(StoreContext)
    const [data, setData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        phone: ''
    })

    const navigate = useNavigate()

    useEffect(() => {
        setRoute('PlaceOrder')
      }, [])

    useEffect(() => {
        if (!token)
            navigate('/')
        else if (getTotalCartAmount === 0)
            navigate('/')
    }, [token])

    const onChangeHandler = event => {
        const name = event.target.name
        const value = event.target.value
        setData(data => ({...data, [name]: value}))
    }

    // useEffect(() => {
    //     console.log(data)
    // }, [data])

    function loadScript(src) {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = src;
            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };
            document.body.appendChild(script);
        });
    }

    const placeOrder = async event => {
        event.preventDefault()
        let orderItems = []
        food_list.map(item => {
            if (cartItems[item._id] > 0) {
                let itemInfo = item
                itemInfo['quantity'] = cartItems[item._id]
                orderItems.push(itemInfo)
            }
        })
        let orderData = {
            address: data,
            items: orderItems,
            amount: getTotalCartAmount() + deliveryFee - discount
        }
        const loadRazorpay = await loadScript("https://checkout.razorpay.com/v1/checkout.js")
        if (!loadRazorpay)
            toast.error('Failed to start payment gateway')
        try {
            let response = await axios.post(`${url}/api/order/place`, orderData, {headers: {token}})
            if (response.data.success) {
                const options = {
                    key: response.data.key_id,
                    amount: response.data.amount.toString(),
                    currency: 'INR',
                    order_id: response.data.order_id,
                    name: 'Tomato',
                    image: assets.logo,
                    callback_url: `${url}/verify?orderId=${response.data.db_order_id}`,
                    redirect: true,
                    prefill: {
                        name: response.data.data.firstName + " " + response.data.data.lastName,
                        email: response.data.data.email,
                        contact: response.data.data.phone
                    },
                    theme : {
                        color: '#ff6347'
                    }
                }
                const razorPayObject = new Razorpay(options)
                razorPayObject.open()
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            console.error(error)
            toast.error('Failed to start payment')
        }
    }

  return (
    <form onSubmit={placeOrder} className='place-order'>
        <div className="place-order-left">
            <p className='title'>Delivery Information</p>
            <div className="multi-fields">
                <input onChange={onChangeHandler} name='firstName' value={data.firstName} type="text" placeholder='First Name' required />
                <input onChange={onChangeHandler} name='lastName' value={data.lastName} type="text" placeholder='Last Name' required />
            </div>
            <input onChange={onChangeHandler} name='email' value={data.email} type="email" placeholder='Email Address' required />
            <input onChange={onChangeHandler} name='street' value={data.street} type="text" placeholder='Street' required />
            <div className="multi-fields">
                <input onChange={onChangeHandler} name='city' value={data.city} type="text" placeholder='City' required />
                <input onChange={onChangeHandler} name='state' value={data.state} type="text" placeholder='State' required />
            </div>
            <div className="multi-fields">
                <input onChange={onChangeHandler} name='zipCode' value={data.zipCode} type="number" placeholder='Zip Code' required />
                <input onChange={onChangeHandler} name='country' value={data.country} type="text" placeholder='Country' required />
            </div>
            <input onChange={onChangeHandler} name='phone' value={data.phone} type="tel" placeholder='Phone Number' required />
        </div>
        <div className="place-order-right">
            <div className="cart-total">
                <h2>Cart Totals</h2>
                <div>
                    <div className="cart-total-details">
                        <p>Subtotal</p>
                        <p>₹{getTotalCartAmount()}</p>
                    </div>
                    <hr />
                    {discount > 0
                    ? <><div className="cart-total-details">
                        <p>Discount</p>
                        <p>-₹{discount}</p>
                    </div>
                    <hr /></>
                    : <></>}
                    <div className="cart-total-details">
                        <p>Delivery Fee</p>
                        <p>₹{deliveryFee}</p>
                    </div>
                    <hr />
                    <div className="cart-total-details">
                        <p>Total</p>
                        <p>₹{getTotalCartAmount() + deliveryFee - discount}</p>
                    </div>
                </div>
                <button type='submit'>PROCEED TO PAYMENT</button>
            </div>
        </div>
    </form>
  )
}

export default PlaceOrder