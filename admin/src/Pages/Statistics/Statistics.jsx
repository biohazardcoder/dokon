import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

export function Statistics({ adminsCount, productCount, clientCount }) {
  const data = {
    labels: ['Adminlar', 'Mahsulotlar', 'Xaridorlar'],
    datasets: [
      {
        label: `Ko'rsatish`,
        data: [adminsCount, clientCount, productCount],
        backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(255, 99, 132, 0.2)'],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 99, 132, 1)'],
        borderWidth: 5,
      }
    ]
  };
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#4ade80',
          custor: 'pointer',
          font: {
            size: 20
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${" "} ${tooltipItem.raw} ta `;
          }
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true
      },
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <div className="p-8 px-8  min-h-[50%] overflow-y-auto bg-white  rounded-2xl shadow-md ">
      <h1 className="text-3xl font-semibold mb-6 text-sidebarBg">Statistikalar</h1>
      <div className="bg-sidebarBg p-5 md:p-16 flex items-center justify-center rounded-lg h-[450px] text-mainText shadow-lg">
        <Bar data={data} className='text-white' options={options} />
      </div>
    </div>
  );
}
