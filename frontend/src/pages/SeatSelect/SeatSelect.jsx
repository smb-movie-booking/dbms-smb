import React, { useEffect, useState } from 'react'
import './seat.css'
import { useParams } from 'react-router-dom'
import { axiosInstance } from '../../utils/axios';
import toast from 'react-hot-toast';

const SeatSelect = () => {
    const {showid}=useParams();
    const [loading,setLoading]=useState(false);
    const [seatInfo,setSeatiInfo]=useState(null);
    const [seatLetter,setSeatLetter]=useState("A"); // Your code, kept as is
    const [selectedSeats,setSelectedSeats]=useState({ totalPrice:0,seats:[] });
    let seatCounter=0; // Your code, kept as is

    useEffect(()=>{
        const fetchseats=async()=>{
            try {
                setLoading(true);
                const {data}=await axiosInstance.get(`/api/seat/show/${showid}`);
                console.log(data); // This log confirms your data structure
                setSeatiInfo(data);
            } catch (error) {
                console.log(error);
                return toast.error(error.response.data.message || error.message);
            }finally{
                setLoading(false);
            }
        }
        fetchseats();
        
    },[showid]) // Added showid to dependency array

    const dateTimeFormat=(value,type)=>{
        const date=new Date(value);
        if(type==="date"){
            return date.toLocaleDateString("en",{day:"2-digit",month:"short",year:"numeric"})
        }
        return date.toLocaleTimeString("en",{hour:"2-digit",minute:"2-digit"})
    }

    // Your original function, kept as is
    const setupSeats=(seatIn)=>{
        let seatsPerRow;
        let rowCount;
        const {type:seatType,count,value:seatData}=seatIn;
        if(count >=80 ){
            seatsPerRow=20
        }else {
            seatsPerRow=10
        }
        rowCount=Math.ceil(count/seatsPerRow);
        return [seatsPerRow,rowCount]
    }

    const selectSeat=(seat,money)=>{
        const price=Math.round(money);
        const isPresent=selectedSeats.seats.some((s)=>s.seatId===seat.seatId);
        console.log(isPresent);
        if(isPresent){
            const updatedSeats=selectedSeats.seats.filter((s)=>s.seatId!==seat.seatId);
            setSelectedSeats({...selectedSeats,totalPrice:selectedSeats.totalPrice-price,seats:updatedSeats});
            return
        }
        if(selectedSeats.seats.length >= 10){
            return toast.error("Can Book Only 10 seats at a time")
        }
        const temp=[...selectedSeats.seats,seat];
        setSelectedSeats({...selectedSeats,totalPrice:selectedSeats.totalPrice+price,seats:temp});
        return
    }

    console.log(selectedSeats);

  return (
    <div className='seat-wrapper'>
      <header>
        <div>
            <h2>{seatInfo?.title}</h2>
            <div>
                {/* Fixed a small bug: added seatInfo?.showDate check */}
                <p className='show-info-sub'>{seatInfo?.cinema} | {seatInfo?.showDate && dateTimeFormat(seatInfo?.showDate,"date")} | {seatInfo?.startTime && dateTimeFormat(seatInfo?.startTime,"time")}</p>
            </div>
        </div>
        <div>
            <span>Seats Selected:{selectedSeats.seats.length}</span>
        </div>
      </header>

      <main style={{overflowX:"auto"}}>
            <div className="main-banner" >
                <svg width="585" height="29" viewBox="0 0 585 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M585 29V17C585 17 406.824 0 292.5 0C178.176 0 0 17 0 17V29C0 29 175.5 12 292.5 12C404.724 12 585 29 585 29Z" 
                    fill="#eb5f28" fill-opacity="0.3"/>
                </svg>
                <p>Eyes this Way</p>
            </div>
            
            <div className=" main-body" >
                <div className="seat-container" style={{flex:"1",display:"flex",flexDirection:"column",justifyContent:"center",alignContent:"center",overflowX:"auto"}}>
                    
                    {/* Your original mapping logic, kept as is */}
                    {seatInfo && seatInfo?.seats.map((seatType,index)=>{
                        const [seatsPerRow,rowCount]=setupSeats(seatType)
                        const rows=[]
                        for(let i=0;i<rowCount;i++){
                            const start=i*seatsPerRow;
                            const end=start+seatsPerRow;
                            const selectedSeats=seatType.value.slice(start,end);
                            rows.push(selectedSeats);
                        }
                        return <div style={{ marginBottom:"1rem"}} key={seatType.type}> {/* Added key */}
                            <h3>{seatType.type}({seatType.price}Rs)</h3>
                            {rows.map((row,idx)=>{
                                const letter=String.fromCharCode(65+seatCounter);
                                let mid;
                                seatCounter++
                                if(row.length<11){
                                    mid=-1
                                }else{
                                    mid=Math.floor(row.length/2);
                                }
                                
                                return <div className='single-row' style={{
                                            display:"flex",
                                            justifyContent:'center',
                                            gap:"1rem",  
                                            marginBottom:"4px"
                                            }}
                                            key={idx} // Added key
                                        >
                                    {row.map((seat,index)=>{
                                        
                                        if(index===mid && mid!==-1){
                                            return <React.Fragment key={seat.seatId}> {/* key moved to fragment */}
                                            <span className="aisle"></span>
                                            <button className={`seat-button ${seat.seatStatus==='available'&&"available"} ${selectedSeats.seats.some((s)=>s.seatId===seat.seatId)&&"locked"}`} 
                                                disabled={seat.seatStatus==="booked"}
                                                onClick={()=>selectSeat(seat,seatType.price)}
                                            >
                                                    {/* --- THIS IS THE CHANGE --- */}
                                                    {seat.seatName}
                                            </button>
                                        </React.Fragment>
                                        }
                                        return <button className={`seat-button ${seat.seatStatus==='available'&&"available"}  ${selectedSeats.seats.some((s)=>s.seatId===seat.seatId)&&"locked"}`} 
                                                    disabled={seat.seatStatus==="booked"} 
                                                    onClick={()=>selectSeat(seat,seatType.price)}
                                                    key={seat.seatId}>
                                                        {/* --- THIS IS THE CHANGE --- */}
                                                        {seat.seatName}
                                                </button>
                                        
                                    })}
                                </div>
                            })}
                        </div>
                        })
                    }
                </div>
            </div>
      </main>

      <footer>
            {/* This div is just for the legend at the top of the footer */}
        <div className="seat-legend">
            <div style={{display:"flex", alignItems:"center"}}><span className='seat-button available '></span><span>Available</span></div>
            <div style={{display:"flex", alignItems:"center"}}><span className='seat-button locked '></span><span>Selected</span></div>
            <div style={{display:"flex", alignItems:"center"}}><span className='seat-button '></span><span>Booked</span></div>
        </div>

        {/* This is the new summary bar that only appears when seats are selected */}
        {selectedSeats.seats.length > 0 && (
            <div className="seat-summary-bar">
                
                {/* Here is the Total Price display */}
                <div className="total-price">
                    <strong>Total: {selectedSeats.totalPrice} Rs</strong>
                </div>
                
                {/* Here is the View Summary button */}
                <div className="summary-button">
                    <button 
                        className='register-btn' // Using your existing button style
                        onClick={() => {
                            // You can add navigation logic here, e.g.,
                            // navigate('/booking-summary', { state: { selectedSeats, seatInfo } });
                            toast.success(`Selected ${selectedSeats.seats.length} seats!`);
                        }}
                    >
                        View Summary
                    </button>
                </div>
            </div>
        )}
      </footer>
    </div>
  )
}

export default SeatSelect