import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useMemo, useState } from 'react';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DoughnutChart({ chartData, year, month }) {
  if(!chartData) return;
  const [labels, setLabels] = useState("");
  const [counts, setCounts] = useState("");
  const [data, setData] = useState();

  useMemo(() => {
    const filteredData = filterDataByDate(chartData, year, month);
    const labels = filteredData.map(item => item.symbol);
    const counts = filteredData.map(item => item.count);
    const data = {
      labels,
      datasets: [
        {
          label: `Counts for ${month}/${year}`,
          data: counts,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };

    setData(data);

  }, [year, month, chartData]);
 
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'left',
        labels: {
          padding: 20,
          boxWidth: 20,
        },
      },
    },
  };
  return <Doughnut data={data} options={options} />;
}

const filterDataByDate = (data, year, month) => {
  return data.filter(item => {
    const itemDate = new Date(item.date);
    return itemDate.getFullYear() == year && (itemDate.getMonth() + 1) == month;
  });
};