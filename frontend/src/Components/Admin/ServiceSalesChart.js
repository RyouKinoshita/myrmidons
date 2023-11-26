// ServiceSalesChart.js

import React, { useState, useEffect } from "react";
import { getToken } from "../../utils/helpers";
import axios from "axios";
import Loader from "../Layout/Loader";
import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";

const ServiceSalesChart = () => {
  const [serviceSales, setServiceSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const pieColors = [
    "#FF6633",
    "#FFB399",
    "#FF33FF",
    "#FFFF99",
    "#00B3E6",
    "#E6B333",
    "#3366E6",
    "#999966",
    "#809980",
    "#E6FF80",
    "#1AFF33",
    "#999933",
    "#FF3380",
    "#CCCC00",
    "#66E64D",
    "#4D80CC",
    "#FF4D4D",
    "#99E6E6",
    "#6666FF",
  ];

  const serviceSalesData = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${getToken()}`,
        },
      };

      const { data } = await axios.get(
        `http://localhost:4001/api/v1/admin/service-sales`,
        config
      );
      setServiceSales(data.serviceSales);
      setLoading(false);
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  useEffect(() => {
    serviceSalesData();
  }, []);

  return (
    <ResponsiveContainer width="90%" height={1000}>
      <PieChart width={1000} height={1000}>
        <Pie
          dataKey="totalSales"
          nameKey="_id"
          isAnimationActive={true}
          data={serviceSales}
          cx="50%"
          cy="50%"
          outerRadius={300}
          fill="#8884d8"
          label={({ percent }) => `${(percent * 100).toFixed(2)}%`}
          labelLine={false}
        >
          {serviceSales.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={pieColors[index % pieColors.length]}
            />
          ))}
        </Pie>
        <Tooltip />
        <Legend align="right" verticalAlign="middle" layout="vertical" />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default ServiceSalesChart;
