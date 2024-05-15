import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function BarChart({ chartData }) {
  if(!chartData) return;
 
  const options = {
    responsive: true,
    scales: {
      x: {
        stacked: true, // Set to true to stack bars
      },
      y: {
        stacked: true, // Set to true to stack bars
        beginAtZero: true
      }
    },
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };
  return <Bar data={chartData} options={options} />;
}