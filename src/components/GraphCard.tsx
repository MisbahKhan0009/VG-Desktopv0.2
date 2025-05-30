import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine 
} from 'recharts';
import { useResults } from '../context/ResultsContext';
import { BarChart2, AlertCircle } from 'lucide-react';

const formatTimeFromSeconds = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-content/10 shadow-retro rounded">
        <p className="font-medium">{`Time: ${formatTimeFromSeconds(label)}`}</p>
        <p className="text-primary">{`Score: ${payload[0].value.toFixed(2)}`}</p>
      </div>
    );
  }
  return null;
};

const GraphCard: React.FC = () => {
  const { results } = useResults();
  const [chartData, setChartData] = useState<{ x: number; y: number }[]>([]);
  const [threshold, setThreshold] = useState<number>(0.5);
  const [highestPoint, setHighestPoint] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (results?.highlight_detection) {
      setChartData(results.highlight_detection);
      
      // Find highest point
      let highest = { x: 0, y: 0 };
      results.highlight_detection.forEach(point => {
        if (point.y > highest.y) {
          highest = point;
        }
      });
      setHighestPoint(highest);
    } else {
      setChartData([]);
      setHighestPoint(null);
    }
  }, [results]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  if (!results) {
    return (
      <motion.div 
        className="retro-card p-6 h-full"
        whileHover={{ y: -5 }}
        transition={{ duration: 0.2 }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-2xl font-display mb-4 text-content">Highlight Detection</h2>
        <div className="h-64 flex items-center justify-center bg-content/5 rounded-lg border border-content/10">
          <div className="text-center">
            <BarChart2 size={48} className="mx-auto mb-4 text-content/30" />
            <p className="text-content/50">Analyze a video to see detection results</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="retro-card p-6 h-full"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-display text-content">Highlight Detection</h2>
        
        <div className="flex items-center gap-2">
          <label className="text-sm text-content/70">Threshold:</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={threshold}
            onChange={(e) => setThreshold(parseFloat(e.target.value))}
            className="accent-primary"
          />
          <span className="text-sm font-medium">{threshold.toFixed(2)}</span>
        </div>
      </div>
      
      <div className="h-64 relative">
        {chartData.length > 0 ? (
          <>
            <ResponsiveContainer width="100%\" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis 
                  dataKey="x" 
                  label={{ value: 'Time (seconds)', position: 'insideBottom', offset: -5 }}
                  tickFormatter={formatTimeFromSeconds}
                />
                <YAxis 
                  label={{ value: 'Scielency Score', angle: -90, position: 'insideLeft' }} 
                  domain={[0, 1]}
                />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine y={threshold} stroke="#FE7743" strokeDasharray="3 3" />
                <Line
                  type="monotone"
                  dataKey="y"
                  stroke="#FE7743"
                  strokeWidth={3}
                  dot={{ fill: '#FE7743', r: 4 }}
                  activeDot={{ fill: '#FE7743', r: 6, stroke: '#fff', strokeWidth: 2 }}
                  animationDuration={1500}
                  isAnimationActive={true}
                />
              </LineChart>
            </ResponsiveContainer>
            
            {highestPoint && (
              <motion.div
                className="absolute top-2 right-2 bg-white p-2 rounded-lg shadow-retro border border-content/10 flex items-center gap-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.3 }}
              >
                <AlertCircle size={16} className="text-primary" />
                <span className="text-sm">
                  Highest score: <strong>{highestPoint.y.toFixed(2)}</strong> at {formatTimeFromSeconds(highestPoint.x)}
                </span>
              </motion.div>
            )}
          </>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-content/50">No highlight detection data available</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default GraphCard;