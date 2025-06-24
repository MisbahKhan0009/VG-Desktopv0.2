import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import ReactPlayer from 'react-player';
import { useFolderResults } from '../context/FolderResultsContext';
import { Trophy, Play, FileVideo, Clock, Star } from 'lucide-react';

const BatchResultsCard: React.FC = () => {
  const { batchResults } = useFolderResults();
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const playerRef = useRef<ReactPlayer>(null);

  // Helper function to convert timestamp string to seconds
  const timeToSeconds = (timeStr: string): number => {
    const [minutes, seconds] = timeStr.split(':').map(Number);
    return minutes * 60 + seconds;
  };

  // Auto-play the best moment when results are available
  useEffect(() => {
    if (batchResults?.bestVideo?.bestMoment && !selectedVideo) {
      setSelectedVideo(batchResults.bestVideo.videoUrl);
      
      // Auto-play from the best moment after a short delay
      setTimeout(() => {
        if (playerRef.current && batchResults.bestVideo?.bestMoment) {
          const startTime = timeToSeconds(batchResults.bestVideo.bestMoment.startTime);
          playerRef.current.seekTo(startTime);
          setIsPlaying(true);
        }
      }, 1000);
    }
  }, [batchResults, selectedVideo]);

  const handleVideoSelect = (videoUrl: string, bestMoment: any) => {
    setSelectedVideo(videoUrl);
    setIsPlaying(false);
    
    // Seek to best moment after video loads
    setTimeout(() => {
      if (playerRef.current && bestMoment) {
        const startTime = timeToSeconds(bestMoment.startTime);
        playerRef.current.seekTo(startTime);
      }
    }, 500);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

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

  if (!batchResults) {
    return (
      <motion.div 
        className="retro-card p-6 h-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-2xl font-display mb-4 text-content">Batch Results</h2>
        <div className="h-64 flex items-center justify-center bg-content/5 rounded-lg border border-content/10">
          <div className="text-center">
            <FileVideo size={48} className="mx-auto mb-4 text-content/30" />
            <p className="text-content/50">Process videos to see batch results</p>
          </div>
        </div>
      </motion.div>
    );
  }

  const currentVideo = selectedVideo 
    ? batchResults.videos.find(v => v.videoUrl === selectedVideo) 
    : batchResults.bestVideo;

  return (
    <motion.div 
      className="retro-card p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-display text-content">Batch Analysis Results</h2>
        <div className="flex items-center gap-2 px-3 py-1 bg-success/10 text-success rounded-lg">
          <Trophy size={16} />
          <span className="font-medium">{batchResults.totalProcessed} videos processed</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video Player */}
        <div className="lg:col-span-2">
          <div className="relative rounded-lg overflow-hidden bg-black mb-4">
            {currentVideo && (
              <>
                <ReactPlayer
                  ref={playerRef}
                  url={currentVideo.videoUrl}
                  width="100%"
                  height="400px"
                  playing={isPlaying}
                  controls={true}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  progressInterval={100}
                />
                
                {currentVideo.bestMoment && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="flex justify-between items-center text-white">
                      <div>
                        <p className="text-sm">Best Moment: {currentVideo.bestMoment.startTime} - {currentVideo.bestMoment.endTime}</p>
                        <p className="text-xs opacity-75">{currentVideo.fileName}</p>
                      </div>
                      <div className="flex items-center gap-2 bg-primary/20 px-2 py-1 rounded">
                        <Star size={14} />
                        <span className="text-sm font-medium">{(currentVideo.bestMoment.score * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </>
            )}
          </div>

          {/* Best Video Info */}
          {batchResults.bestVideo && (
            <motion.div
              className="bg-primary/5 border border-primary/20 rounded-lg p-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <Trophy className="text-primary" size={20} />
                <h3 className="font-display text-lg">Best Match Found</h3>
              </div>
              <p className="text-content/70 mb-2">
                <span className="font-medium">{batchResults.bestVideo.fileName}</span> has the highest relevance score
              </p>
              {batchResults.bestVideo.bestMoment && (
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Clock size={14} className="text-primary" />
                    <span>{batchResults.bestVideo.bestMoment.startTime} - {batchResults.bestVideo.bestMoment.endTime}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star size={14} className="text-primary" />
                    <span className="font-medium">{(batchResults.bestVideo.bestMoment.score * 100).toFixed(0)}% match</span>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Video List */}
        <div className="space-y-4">
          <h3 className="font-display text-lg mb-3">All Videos</h3>
          <div className="max-h-96 overflow-y-auto space-y-2">
            {batchResults.videos
              .sort((a, b) => b.highestScore - a.highestScore)
              .map((video, index) => (
                <motion.div
                  key={video.fileName}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedVideo === video.videoUrl
                      ? 'border-primary bg-primary/5'
                      : 'border-content/10 hover:border-primary/30 hover:bg-content/5'
                  }`}
                  onClick={() => handleVideoSelect(video.videoUrl, video.bestMoment)}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{video.fileName}</p>
                      <p className="text-xs text-content/50">{formatFileSize(video.fileSize)}</p>
                    </div>
                    {index === 0 && (
                      <Trophy size={16} className="text-primary flex-shrink-0 ml-2" />
                    )}
                  </div>
                  
                  {video.bestMoment && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-content/70">Best moment:</span>
                        <span className="font-medium">{video.bestMoment.startTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-content/10 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${getScoreBackground(video.bestMoment.score)}`}
                            style={{ width: `${video.bestMoment.score * 100}%` }}
                          ></div>
                        </div>
                        <span className={`text-xs font-medium ${getScoreColor(video.bestMoment.score)}`}>
                          {(video.bestMoment.score * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BatchResultsCard;