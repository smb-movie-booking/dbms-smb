import React from 'react'
import { axiosInstance } from '../../utils/axios';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import './UserOrders.css'

const UserOrders = () => {
    const {userid}=useParams();
    const [orders,setOrders]=useState([])
    useEffect(()=>{
        const fetchOrders=async()=>{
            try{
                const {data}=await axiosInstance.get(`/api/booking/user/${userid}/orders`);
                console.log("User Orders:",data);
                setOrders(data.bookings);
            }catch(err){
                console.error("Error fetching user orders:",err);
            }

        }

         fetchOrders();
    },[])

    const formatDate=(dateString)=>{
        const date=new Date(dateString);
        return date.toLocaleDateString('en-Us',{year:'numeric',month:'short',day:'numeric'});
    }

    const formatTime=(timeString)=>{
        const date=new Date(timeString);
        return date.toLocaleDateString('en-Us',{hour:'2-digit',minute:'2-digit',second:'2-digit'});
    }
  return (
    <div className='order-container'>
      <div className='order-header'>
        <h2>Your Orders</h2>

        
      </div>


      <div className='order-body'>

        <div className='order-box'>
            {orders.length===0?<p>No orders found.</p>:orders.map((order,index)=>{
                return <div className='order-main'>
                    <div>
                        <h3>{order?.Movie_Name}</h3>
                        <p>{order?.Cinema_Name}</p>
                        <span>
                            <p>{formatDate(order?.Show_Date)}</p>
                            <p>{formatTime(order?.StartTime)}</p>
                        </span>
                    </div>

                    <div>
                        <div>
                            <h4>Seats:</h4>

                            <p>{order?.Selected_Seats}</p>
                        </div>
                    </div>
                    
                </div>
            })}
        </div>
      </div>
    </div>
  )
}

export default UserOrders
