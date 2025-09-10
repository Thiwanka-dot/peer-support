import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

import axios from "axios";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const MoodChart = ({ refresh }) => { 
  const [dailyData, setDailyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDailyData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/mood/daily", {
          withCredentials: true,
        });
        setDailyData(res.data.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch mood data");
      } finally {
        setLoading(false);
      }
    };
    fetchDailyData();
  }, [refresh]);  

  if (error) return <p>Error loading chart: {error}</p>;
  if (loading) return <p>Loading chart...</p>;

  const labels = dailyData.map((d) => d.day);

  const data = {
    labels,
    datasets: [
      {
        label: "Good",
        data: dailyData.map((d) => d.good),
        borderColor: "green",
        backgroundColor: "rgba(0,128,0,0.3)",
        tension: 0.3,
      },
      {
        label: "Normal",
        data: dailyData.map((d) => d.normal),
        borderColor: "blue",
        backgroundColor: "rgba(0,0,255,0.3)",
        tension: 0.3,
      },
      {
        label: "Bad",
        data: dailyData.map((d) => d.bad),
        borderColor: "red",
        backgroundColor: "rgba(255,0,0,0.3)",
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: "right" }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: "Count" },
      },
    },    
  };

  return (
    <div style={{ width: "100%", height: "500px" }}>
      <Line data={data} options={options} />
    </div>
  );
};

export default MoodChart;
