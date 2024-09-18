import React, { useState, useEffect } from 'react'
import './List.css'
import axios from 'axios'
import { toast } from 'react-toastify'

const List = ({url}) => {
    const [list, setList] = useState([])

    const fetchList = async () => {
        const response = await axios.get(`${url}/api/food/list`)
        if (response.data.success)
            setList(response.data.data)
        else
            toast.error(response.data.message)
    }

    const removeFood = async foodId => {
        // console.log(foodId)
        const response = await axios.post(`${url}/api/food/remove`, {id: foodId})
        if (response.data.success) {
            await fetchList()
            toast.success(response.data.message)
        }
        else
            toast.error(response.data.message)
    }

    useEffect(() => {
        fetchList()
    }, [])

  return (
    <div className='list add flex-col'>
        <p>All Foods List</p>
        <div className="list-table">
            <div className="list-table-format title">
                <b>Image</b>
                <b>Name</b>
                <b>Category</b>
                <b>Price</b>
                <b>Action</b>
            </div>

            {list.map((item, index) => {
                return (
                    <div key={index} className='list-table-format content'>
                        <img src={`${url}/images/${item.image}`} alt={item.name} />
                        <p>{item.name}</p>
                        <p>{item.category}</p>
                        <p>₹{item.price}</p>
                        <p onClick={() => removeFood(item._id)} className='cursor'>❌</p>
                    </div>
                )
            })}
        </div>
    </div>
  )
}

export default List