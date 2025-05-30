import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Star } from 'lucide-react';
import { useResults } from '../context/ResultsContext';

const MomentsTableCard: React.FC = () => {
  const { results } = useResults();
  
  const getScoreColor = (score: number): string => {
    if (score >= 0.7) return 'text-success';
    if (score >= 0.4) return 'text-primary';
    return 'text-content/70';
  };
  
  const getScoreBackground = (score: number): string => {
    if (score >= 0.7) return 'bg-success/10';
    if (score >= 0.4) return 'bg-primary/10';
    return 'bg-content/5';
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };
  
  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (!results) {
    return (
      <motion.div 
        className="retro-card p-6 h-full"
        whileHover={{ y: -5 }}
        transition={{ duration: 0.2 }}
      >
        <h2 className="text-2xl font-display mb-4 text-content">Top Moments</h2>
        <div className="h-64 flex items-center justify-center bg-content/5 rounded-lg border border-content/10">
          <div className="text-center">
            <Clock size={48} className="mx-auto mb-4 text-content/30" />
            <p className="text-content/50">Analyze a video to see top moments</p>
          </div>
        </div>
      </motion.div>
    );
  }

  // Sort moments by score (highest first) and get top 5
  const topMoments = [...results.moment_retrieval]
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  return (
    <motion.div 
      className="retro-card p-6 h-full"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <h2 className="text-2xl font-display mb-4 text-content">Top Moments</h2>
      
      {topMoments.length > 0 ? (
        <motion.div 
          className="overflow-hidden" 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="grid grid-cols-4 gap-2 pb-2 border-b border-content/10 text-sm font-medium text-content/70">
            <div>Start</div>
            <div>End</div>
            <div className="col-span-2">Relevance</div>
          </div>
          
          {topMoments.map((moment, index) => (
            <motion.div 
              key={index}
              className="grid grid-cols-4 gap-2 py-3 border-b border-content/5 last:border-b-0 highlight-row"
              variants={rowVariants}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="font-medium">{moment.startTime}</div>
              <div className="font-medium">{moment.endTime}</div>
              <div className="col-span-2">
                <div className="flex items-center gap-2">
                  <div className={`font-medium ${getScoreColor(moment.score)}`}>
                    {(moment.score * 100).toFixed(0)}%
                  </div>
                  <div className="flex-1 h-2 bg-content/10 rounded-full overflow-hidden">
                    <motion.div 
                      className={`h-full ${getScoreBackground(moment.score)}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${moment.score * 100}%` }}
                      transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                    ></motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          
          {topMoments.length === 0 && (
            <div className="py-8 text-center text-content/50">
              No moment data available
            </div>
          )}
        </motion.div>
      ) : (
        <div className="h-64 flex items-center justify-center">
          <div className="text-center">
            <Star size={48} className="mx-auto mb-4 text-content/30" />
            <p className="text-content/50">No moment data available</p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default MomentsTableCard;