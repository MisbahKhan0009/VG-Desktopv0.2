import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import ReactPlayer from 'react-player';
import { useResults } from '../context/ResultsContext';
import { AlertOctagon } from 'lucide-react';

const HighlightedMomentCard: React.FC = () => {
  const { results, videoUrl } = useResults();
  const [highestMoment, setHighestMoment] = useState<{
    startTime: string;
    endTime: string;
    score: number;
  } | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const playerRef = useRef<ReactPlayer>(null);

  // Helper function to convert timestamp string to seconds
  const timeToSeconds = (timeStr: string): number => {
    const [minutes, seconds] = timeStr.split(':').map(Number);
    return minutes * 60 + seconds;
  };

  useEffect(() => {
    if (results?.moment_retrieval && results.moment_retrieval.length > 0) {
      // Find moment with highest score
      const highest = [...results.moment_retrieval].sort((a, b) => b.score - a.score)[0];
      setHighestMoment(highest);
      
      // Set current time to start of highest moment
      if (highest) {
        setCurrentTime(timeToSeconds(highest.startTime));
      }
    } else {
      setHighestMoment(null);
    }
  }, [results]);

  const handleSeek = (time: number) => {
    if (playerRef.current) {
      playerRef.current.seekTo(time);
      setCurrentTime(time);
    }
  };

  const handlePlayHighlightedMoment = () => {
    if (highestMoment && playerRef.current) {
      const startSeconds = timeToSeconds(highestMoment.startTime);
      handleSeek(startSeconds);
      setIsPlaying(true);
    }
  };

  if (!results || !videoUrl || !highestMoment) {
    return (
      <motion.div 
        className="retro-card p-6 mt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        whileHover={{ y: -5 }}
      >
        <h2 className="text-2xl font-display mb-4 text-content">Highlighted Moment</h2>
        <div className="h-48 flex items-center justify-center bg-content/5 rounded-lg border border-content/10">
          <div className="text-center">
            <AlertOctagon size={48} className="mx-auto mb-4 text-content/30" />
            <p className="text-content/50">Analyze a video to see the most important moment</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="retro-card p-6 mt-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      whileHover={{ y: -5 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-display text-content">Highlighted Moment</h2>
        
        <motion.div
          className="px-4 py-2 bg-primary/10 text-primary font-medium rounded-lg flex items-center gap-2"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <AlertOctagon size={16} />
          <span>Score: {(highestMoment.score * 100).toFixed(0)}%</span>
        </motion.div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 relative rounded-lg overflow-hidden bg-black">
          <ReactPlayer
            ref={playerRef}
            url={videoUrl}
            width="100%"
            height="100%"
            playing={isPlaying}
            controls={true}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onProgress={(state) => setCurrentTime(state.playedSeconds)}
            progressInterval={100}
          />
          
          {highestMoment && (
            <motion.div
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <p className="text-white text-sm">
                Highlighted: <span className="font-medium">{highestMoment.startTime}</span> to <span className="font-medium">{highestMoment.endTime}</span>
              </p>
            </motion.div>
          )}
        </div>
        
        <div className="flex flex-col justify-between bg-content/5 rounded-lg p-5">
          <div>
            <h3 className="font-display text-xl mb-3">The moment you're likely looking for is at:</h3>
            <div className="text-4xl font-display text-primary mb-2">{highestMoment.startTime}</div>
            <p className="text-content/70">
              This segment from <span className="font-medium">{highestMoment.startTime}</span> to <span className="font-medium">{highestMoment.endTime}</span> was detected as most relevant to your query with a confidence score of <span className="font-medium text-primary">{(highestMoment.score * 100).toFixed(0)}%</span>.
            </p>
          </div>
          
          <motion.button
            onClick={handlePlayHighlightedMoment}
            className="mt-4 w-full py-3 px-4 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors shadow-retro"
            whileHover={{ y: -2, boxShadow: '4px 4px 0 rgba(0, 0, 0, 0.1)' }}
            whileTap={{ y: 0, boxShadow: '2px 2px 0 rgba(0, 0, 0, 0.1)' }}
          >
            Play Highlighted Moment
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default HighlightedMomentCard;