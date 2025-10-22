import React, { useEffect, useState, useRef } from 'react';
import { axiosInstance } from '../../utils/axios';
import { useParams } from 'react-router-dom';
import './UserOrders.css';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const UserOrders = () => {
  const { userid } = useParams();
  const [orders, setOrders] = useState([]);
  const pageRef = useRef();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axiosInstance.get(`/api/booking/user/${userid}/orders`);
        console.log("User Orders:", data);
        setOrders(data.bookings);
      } catch (err) {
        console.error("Error fetching user orders:", err);
      }
    };
    fetchOrders();
  }, [userid]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatTime = (timeString) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  // 🧾 Generate PDF
  const downloadPDF = async () => {
    const element = pageRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');

    const imgWidth = 190;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 10;

    pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add extra pages if content is long
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`UserOrders_${userid}.pdf`);
  };

  return (
    <div className="order-container" ref={pageRef}>
      <div className="order-header">
        <h2>Your Orders</h2>
        <button className="download-btn" onClick={downloadPDF}>⬇️ Download PDF</button>
      </div>

      <div className="order-body">
        <div className="order-box">
          {orders.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            orders.map((order, index) => (
              <div className="order-main" key={index}>
                <div>
                  <h3>{order?.Movie_Name}</h3>
                  <p>{order?.Cinema_Name}</p>
                  <span>
                    <p>{formatDate(order?.Show_Date)}</p>
                    <p>{formatTime(order?.StartTime)}</p>
                  </span>
                </div>

                <div>
                  <h4>Seats:</h4>
                  <p>{order?.Selected_Seats}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UserOrders;
const handleDownload = async () => {
  const button = document.querySelector(".download-btn");
  const element = document.querySelector(".download-area");
  if (!element) return;

  // hide button temporarily
  if (button) button.style.display = "none";

  const canvas = await html2canvas(element, { scale: 2 });
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");
  const width = pdf.internal.pageSize.getWidth();
  const height = (canvas.height * width) / canvas.width;
  pdf.addImage(imgData, "PNG", 0, 0, width, height);
  pdf.save("User_Orders.pdf");

  // restore button visibility
  if (button) button.style.display = "";
};
