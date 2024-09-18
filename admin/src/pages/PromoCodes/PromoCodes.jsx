import React from 'react'
import './PromoCodes.css'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../../assets/assets'

const PromoCodes = ({url}) => {
    const [list, setList] = useState([])
    const [addPromoCode, setAddPromoCode] = useState(false)
    const [data, setData] = useState({
        codeId: '',
        discount: 0
    })

    const fetchPromoCodesList = async () => {
        const response = await axios.get(`${url}/api/promocode/list`)
        if (response.data.success)
            setList(response.data.data)
        else
            toast.error(response.data.message)
    }

    const handleChange = event => {
        const name = event.target.name
        const value = event.target.value
        setData(data => ({...data, [name]: value}))
    }

    const handleAddPromoCode = async () => {
        const response = await axios.post(`${url}/api/promocode/add`, {codeId: data.codeId.toUpperCase(), discount: data.discount})
        if (response.data.success)
            toast.success(response.data.message)
        else
            toast.error(response.data.message)
        setData({
            codeId: '',
            discount: 0
        })
        setAddPromoCode(false)
    }

    const handleRemovePromoCode = async (codeId) => {
        const response = await axios.post(`${url}/api/promocode/remove`, {codeId})
        if (response.data.success) {
            await fetchPromoCodesList()
            toast.success(response.data.message)
        }
        else
            toast.error(response.data.message)
    }

    useEffect(() => {
        fetchPromoCodesList()
    }, [data])

  return (
    <div className='promo-codes add flex-col'>
        <p>Promo Codes</p>
        <div className="list-table">
            <div className="list-table-format promo-codes-table-format title">
                <b>Promo Code</b>
                <b>Discount</b>
                <b>Action</b>
            </div>

            {list.map((item, index) => (
                <div key={index} className="list-table-format promo-codes-table-format content">
                    <p>{item.codeId}</p>
                    <p>{item.discount}%</p>
                    <p onClick={() => handleRemovePromoCode(item.codeId)} className='cursor'>❌</p>
                </div>
            ))}

            {addPromoCode
            ? <div className="list-table-format promo-codes-table-format add-promo-code-input">
                <input onChange={handleChange} name='codeId' value={data.codeId} type="text" />
                <input onChange={handleChange} name='discount' value={data.discount} type="number" min={0} />
                <div>
                    <span onClick={handleAddPromoCode} className='cursor'>✅</span>
                    <span onClick={() => {setAddPromoCode(false); setData({codeId: '', discount: 0})}} className='cursor'>❌</span>
                </div>
            </div>
            : <></>}

            {!addPromoCode
            ? <div onClick={() => setAddPromoCode(true)} className="list-table-format promo-codes-table-format add-promo-code">
                <img src={assets.add_icon} alt="Add Promo Code" />
                <p>Add Promo Code</p>
            </div>
            : <></>}
        </div>
    </div>
  )
}

export default PromoCodes