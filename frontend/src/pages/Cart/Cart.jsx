import React, { useContext, useEffect, useState } from 'react'
import './Cart.css'
import { StoreContext } from '../../context/StoreContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'

const Cart = () => {
    const {cartItems, food_list, removeFromCart, getTotalCartAmount, deliveryFee, url, setRoute, discount, setDiscount} = useContext(StoreContext)
    const navigate = useNavigate()
    const [promoCode, setPromoCode] = useState({
        codeId: '',
        discount: 0
    })

    useEffect(() => {
      setRoute('Cart')
    }, [])

    const onChangeHandler = async event => {
        const name = event.target.name
        const value = event.target.value.toUpperCase()
        setPromoCode(data => ({...data, [name]: value}))
    }

    const fetchPromoCode = async event => {
        event.preventDefault()
        const response = await axios.post(`${url}/api/promocode/fetch`, {codeId: promoCode.codeId})
        if (response.data.success) {
            setPromoCode(data => ({...data, discount: response.data.data.discount}))
            setDiscount(Math.round(response.data.data.discount / 100 * getTotalCartAmount()))
        }
        else {
            setPromoCode(data => ({...data, discount: 0}))
            setDiscount(0)
            toast.error(response.data.message)
        }
    }

  return (
    <div className='cart'>
        <div className="cart-items">
            <div className="cart-items-title">
                <p>Items</p>
                <p>Title</p>
                <p>Price</p>
                <p>Quantity</p>
                <p>Total</p>
                <p>Remove</p>
            </div>
            <br />
            <hr />
            {food_list.map((item, index) => {
                if (cartItems[item._id])
                    return (
                        <div key={index}>
                            <div className="cart-items-title cart-items-item">
                                <img src={`${url}/images/${item.image}`} alt={item.name} />
                                <p>{item.name}</p>
                                <p>₹{item.price}</p>
                                <p>{cartItems[item._id]}</p>
                                <p>₹{item.price * cartItems[item._id]}</p>
                                <p onClick={() => removeFromCart(item._id)} className='cross'>❌</p>
                            </div>
                            <hr />
                        </div>
                    )
            })}
        </div>
        {getTotalCartAmount() > 0
        ? 
            <div className="cart-bottom">
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
                    <button onClick={() => navigate('/order')}>PROCEED TO CHECKOUT</button>
                </div>
                <div className="cart-promocode">
                    <div>
                        <p>If you have a promocode, enter it here.</p>
                        <form onSubmit={fetchPromoCode} className="cart-promocode-input">
                            <input onChange={onChangeHandler} name='codeId' value={promoCode.codeId} type="text" placeholder='Promo Code' />
                            <button type='submit'>Submit</button>
                        </form>
                        {promoCode.discount > 0 ? <p className='discount'>🎉 A discount of <strong>{promoCode.discount}%</strong> has been added to your order!</p> : <></>}
                    </div>
                </div>
            </div>
        : <><p className='no-entries'>- No entries -</p></>}
    </div>
  )
}

export default Cart