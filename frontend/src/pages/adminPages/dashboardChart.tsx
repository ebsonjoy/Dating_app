import React, { useState, useRef, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { 
  Users, 
  CreditCard, 
  TrendingUp, 
  Zap, 
  Layers, 
  PieChart as PieChartIcon,
  Sparkles,
  Moon,
  Sun
} from 'lucide-react';
import { motion } from 'framer-motion';

interface ChartProps {
  userChartData: { date: string | Date; count: number }[];
  paymentChartData: { date: string | Date; amount: number }[];
  totalUsers?: number;
  totalPayments?: number;
  onTimeRangeChange?: (range: 'day' | 'month' | 'year') => void;
  currentTimeRange?: 'day' | 'month' | 'year';
}

const DashboardCharts: React.FC<ChartProps> = ({
  userChartData = [],
  paymentChartData = [],
  totalUsers = 0,
  totalPayments = 0,
  onTimeRangeChange,
  currentTimeRange = 'month',
}) => {
  const [activeChart, setActiveChart] = useState<'users' | 'payments'>('users');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);

  // Dynamic background effect
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (chartRef.current) {
        const rect = chartRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    };

    const currentRef = chartRef.current;
    if (currentRef) {
      currentRef.addEventListener('mousemove', handleMouseMove);
      return () => {
        currentRef.removeEventListener('mousemove', handleMouseMove);
      };
    }
  }, []);

  const renderBackgroundEffect = () => {
    const colors = isDarkMode 
      ? ['rgba(55,65,81,0.2)', 'rgba(17,24,39,0.5)']
      : ['rgba(191,219,254,0.3)', 'rgba(165,213,252,0.2)'];

    return (
      <div 
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{
          background: `radial-gradient(
            circle 300px at ${mousePosition.x}px ${mousePosition.y}px, 
            ${colors[0]}, 
            ${colors[1]}
          )`
        }}
      />
    );
  };

  const renderChart = () => {
    const data =
      activeChart === 'users'
        ? userChartData.map(item => ({
            date: new Date(item.date).toLocaleDateString(),
            count: item.count,
          }))
        : paymentChartData.map(item => ({
            date: new Date(item.date).toLocaleDateString(),
            amount: item.amount,
          }));

    const chartConfig = activeChart === 'users' 
      ? {
          primaryColor: isDarkMode ? '#6366f1' : '#3b82f6',
          secondaryColor: isDarkMode ? '#a855f7' : '#6366f1',
          icon: <Users className="w-6 h-6" />,
        }
      : {
          primaryColor: isDarkMode ? '#10b981' : '#34d399',
          secondaryColor: isDarkMode ? '#34d399' : '#10b981',
          icon: <CreditCard className="w-6 h-6" />,
        };

    return (
      <motion.div 
        ref={chartRef}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className={`relative rounded-3xl overflow-hidden p-6 ${
          isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
        } shadow-2xl`}
      >
        {renderBackgroundEffect()}
        
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <motion.div 
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                {React.cloneElement(chartConfig.icon, {
                  className: `w-8 h-8 ${isDarkMode ? 'text-indigo-400' : 'text-blue-600'}`
                })}
              </motion.div>
              <h2 className="text-2xl font-bold">
                {activeChart === 'users' ? 'User Growth' : 'Payment Trends'}
              </h2>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-full ${
                isDarkMode 
                  ? 'bg-gray-700 text-yellow-400' 
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
            </motion.button>
          </div>

          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={data}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke={isDarkMode ? '#374151' : '#e0e0e0'}
                strokeOpacity={0.5} 
              />
              <XAxis 
                dataKey="date" 
                tick={{ 
                  fill: isDarkMode ? '#9CA3AF' : '#6b7280', 
                  fontSize: 12 
                }}
              />
              <YAxis 
                tick={{ 
                  fill: isDarkMode ? '#9CA3AF' : '#6b7280', 
                  fontSize: 12 
                }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: isDarkMode ? '#1F2937' : 'white',
                  borderColor: isDarkMode ? '#374151' : '#e0e0e0',
                  color: isDarkMode ? 'white' : 'black'
                }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-xl shadow-xl ${
                          isDarkMode 
                            ? 'bg-gray-800 text-white' 
                            : 'bg-white text-gray-800'
                        }`}
                      >
                        <p className="font-bold">{payload[0].payload.date}</p>
                        <p className="text-blue-500">
                          {activeChart === 'users' ? 'Users' : 'Payments'}:{' '}
                          {payload[0].value}
                        </p>
                      </motion.div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                type="monotone"
                dataKey={activeChart === 'users' ? 'count' : 'amount'}
                stroke={chartConfig.primaryColor}
                strokeWidth={3}
                activeDot={{ 
                  r: 8, 
                  fill: chartConfig.secondaryColor,
                  stroke: 'white',
                  strokeWidth: 2 
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    );
  };

  const renderSummaryCard = () => {
    const total = activeChart === 'users' ? totalUsers : totalPayments;
    const label = activeChart === 'users' ? 'Total Users' : 'Total Payments';
    const percentageChange = 12.5;

    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`rounded-3xl p-6 relative overflow-hidden ${
          isDarkMode 
            ? 'bg-gradient-to-br from-gray-800 to-gray-900 text-white' 
            : 'bg-gradient-to-br from-purple-600 to-indigo-700 text-white'
        } shadow-2xl`}
      >
        <div className="absolute top-0 right-0 opacity-20">
          <Layers className="w-32 h-32" />
        </div>
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              {activeChart === 'users' ? <Users className="w-8 h-8" /> : <CreditCard className="w-8 h-8" />}
              <h3 className="text-lg font-semibold">{label}</h3>
            </div>
            <motion.div 
              whileHover={{ scale: 1.1 }}
              className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full"
            >
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm font-medium">+{percentageChange}%</span>
            </motion.div>
          </div>
          <p className="text-4xl font-bold mb-2 flex items-center gap-2">
            {total.toLocaleString()}
            <Sparkles className="w-6 h-6 text-yellow-400" />
          </p>
          <p className="text-sm text-purple-100 flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Performance Metric
          </p>
        </div>
      </motion.div>
    );
  };

  return (
    <div className={`p-6 ${isDarkMode ? 'bg-gray-950 text-white' : 'bg-gray-100 text-gray-900'} space-y-6`}>
      <div className="flex flex-col md:flex-row justify-between mb-4 space-y-3 md:space-y-0">
        <div className="flex gap-2">
          {['users', 'payments'].map((type) => (
            <motion.button
              key={type}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveChart(type as 'users' | 'payments')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 ${
                activeChart === type
                  ? `${
                      type === 'users' 
                        ? (isDarkMode ? 'bg-indigo-800' : 'bg-indigo-600')
                        : (isDarkMode ? 'bg-green-900' : 'bg-green-600')
                    } text-white shadow-md`
                  : `${
                      isDarkMode 
                        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`
              }`}
            >
              {type === 'users' ? <Users className="w-5 h-5" /> : <CreditCard className="w-5 h-5" />}
              {type === 'users' ? 'Users' : 'Payments'}
            </motion.button>
          ))}
        </div>
        <div className="flex gap-2">
          {(['day', 'month', 'year'] as const).map(range => (
            <motion.button
              key={range}
              whileTap={{ scale: 0.95 }}
              onClick={() => onTimeRangeChange?.(range)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 ${
                currentTimeRange === range
                  ? `${
                      isDarkMode 
                        ? 'bg-pink-900 text-white' 
                        : 'bg-pink-600 text-white'
                    } shadow-md`
                  : `${
                      isDarkMode 
                        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`
              }`}
            >
              {range === 'day' && <PieChartIcon className="w-5 h-5" />}
              {range === 'month' && <Layers className="w-5 h-5" />}
              {range === 'year' && <Zap className="w-5 h-5" />}
              {range}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3">{renderChart()}</div>
        <div>{renderSummaryCard()}</div>
      </div>
    </div>
  );
};

export default DashboardCharts;