import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useMemo, useState } from 'react';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DoughnutChart({ chartData, year, month }) {

  const [data, setData] = useState();

  useMemo(() => {
    if(!chartData) return
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
    return() => {
      //just cleanups
    }


  }, [year, month, chartData]);
 
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          padding: 20,
          boxWidth: 20,
          generateLabels: function(chart){
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              const sum = data.datasets[0].data.reduce((a, b) => a + b, 0);
              return data.labels.map((label, i) => {
                const value = data.datasets[0].data[i];
                const percentage = ((value / sum) * 100).toFixed(2) + "%";
                return {
                  text: `${label}: ${percentage}`,
                  fillStyle: data.datasets[0].backgroundColor[i],
                  hidden: isNaN(data.datasets[0].data[i]) || data.datasets[0].data[i] === null,
                  lineCap: chart.legend.options.labels.lineCap,
                  lineDash: chart.legend.options.labels.lineDash,
                  lineDashOffset: chart.legend.options.labels.lineDashOffset,
                  lineJoin: chart.legend.options.labels.lineJoin,
                  strokeStyle: chart.legend.options.labels.strokeStyle,
                  pointStyle: chart.legend.options.labels.pointStyle,
                  rotation: chart.legend.options.labels.rotation,
              };
              });
            }
          }
        },
      },
    },
  };

  return (data ? <Doughnut data={data} options={options} /> : "");
}

const filterDataByDate = (data, year, month) => {
  return data.filter(item => {
    const itemDate = new Date(item.date);
    return itemDate.getFullYear() == year && (itemDate.getMonth() + 1) == month;
  });
};