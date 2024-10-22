import React from 'react';
import { Scatter } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  TimeScale, // for time axis
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  CategoryScale,
} from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(TimeScale, LinearScale, PointElement, Tooltip, Legend, CategoryScale);

const AuditChartByTimeCategory = () => {
  // Example data: replace with your actual data
  const data = {
    datasets: [
      {
        label: 'Category A',
        data: [
          { x: '2024-10-21T10:00:00', y: 'A' },
          { x: '2024-10-21T11:00:00', y: 'A' },
          { x: '2024-10-21T12:00:00', y: 'A' },
        ],
        backgroundColor: 'rgba(75, 192, 192, 1)',
        pointRadius: 5,
      },
      {
        label: 'Category B',
        data: [
          { x: '2024-10-21T10:30:00', y: 'B' },
          { x: '2024-10-21T11:30:00', y: 'B' },
          { x: '2024-10-21T12:30:00', y: 'B' },
        ],
        backgroundColor: 'rgba(255, 99, 132, 1)',
        pointRadius: 5,
      },
    ],
  };

  // Chart options
  const options = {
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'hour',
        },
        title: {
          display: true,
          text: 'Time',
        },
        grid: {
            display: false, // Disable grid lines on the x-axis
        },
      },
      y: {
        type: 'category',
        labels: ['A', 'B', 'C'],
        title: {
          display: true,
          text: 'Category',
        },
        grid: {
            display: false, // Disable grid lines on the x-axis
        },
      },
    },
    layout: {
        padding: {
          top: 30,    // Margin at the top of the chart
          bottom: 30, // Margin at the bottom of the chart
        },
      },
  };

  const chartStyle = {
    height: '70vh', // 70% of the viewport height
    width: '90vw',  // 90% of the viewport width
  };

  return (
    <div>
      <h2>Scatter Chart (Time vs Category)</h2>
      <div style={chartStyle}>
        <Scatter data={data} options={options} />
      </div>
    </div>
  );
};

export default AuditChartByTimeCategory;
