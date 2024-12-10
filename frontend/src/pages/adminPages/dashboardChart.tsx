// components/admin/DashboardChart.tsx
import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface DashboardChartProps {
  data: {
    labels: string[];
    datasets: { label: string; data: number[]; backgroundColor: string[] }[];
  };
}

const DashboardChart: React.FC<DashboardChartProps> = ({ data }) => {
  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'Dashboard Insights' },
    },
  };

  return <Bar options={options} data={data} />;
};

export default DashboardChart;
