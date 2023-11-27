import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from 'axios';
import { getToken } from '../../utils/helpers';

const DashboardCalendar = () => {
  const [scheduledServices, setScheduledServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getToken()}`,
          },
        };
        const { data } = await axios.get('http://localhost:4001/api/v1/admin/orders', config);
        const confirmedOrders = data.orders.reduce((acc, order) => {
          if (order.orderStatus === 'Confirmed') {
            order.orderItems.forEach((item) => {
              acc.push({
                date: item.date,
                name: item.name,
              });
            });
          }
          return acc;
        }, []);
        const uniqueDates = [...new Set(confirmedOrders)];
        setScheduledServices(uniqueDates);
        setLoading(false);
        
      } catch (error) {
        console.error('Error fetching orders:', error);
        // Handle error state here
      }
    };

    fetchOrders();
  }, []);
  
  const formattedEvents = scheduledServices.map((item) => ({
    title: item.name,
    start: new Date(item.date),
    end: new Date(item.date),
    // Additional properties if needed
  }));
  console.log(formattedEvents)
  const localizer = momentLocalizer(moment);

  return (
    <div>
      <h2 style={{color:"yellow"}}>Calendar of Services</h2>
      <Calendar
        localizer={localizer}
        events={formattedEvents}
        startAccessor="start"
        endAccessor="end"
        // Other props and event handlers as needed
        style={{ height: 800, color:"yellow", backgroundColor:"black", fontWeight:"bold" }} // Adjust height as per your layout
      />
    </div>
  );
};

export default DashboardCalendar;
