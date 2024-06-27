import { Line } from 'react-chartjs-2';
import {Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Filler, Title, Tooltip, Legend} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Title, Tooltip, Legend);

export default function AreaChart({chartData, type}) {
  if(!chartData) return;
  const options = {
    responsive: true,
    maintainAspectRatio: true,
    spanGaps: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      x: {
        grid: {
          display: false, // Hide vertical grid lines
        },
      },
      y: {
        beginAtZero: true,
      }
    }
  };
  return <Line data={chartData} options={options} />;
}