// src/components/DateSelector/DateSelector.jsx
import React from 'react';
import './DateSelector.css';

const DateSelector = ({ selectedDate, onDateChange }) => {
  const dates = [];
  const today = new Date();
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(date);
  }

  const formatDate = (date) => {
    return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  };

  return (
    <div className="date-selector-container">
      {dates.map((date, index) => (
        <div
          key={index}
          className={`date-item ${formatDate(selectedDate) === formatDate(date) ? 'active' : ''}`}
          onClick={() => onDateChange(date)}
        >
          <div className="day">{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
          <div className="date">{date.getDate()}</div>
          <div className="month">{date.toLocaleDateString('en-US', { month: 'short' })}</div>
        </div>
      ))}
    </div>
  );
};

export default DateSelector;