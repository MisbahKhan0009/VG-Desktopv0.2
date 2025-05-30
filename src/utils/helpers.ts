/**
 * Convert a timestamp string (mm:ss) to seconds
 */
export const timestampToSeconds = (timestamp: string): number => {
  if (!timestamp) return 0;
  
  const [minutes, seconds] = timestamp.split(':').map(Number);
  return (minutes * 60) + seconds;
};

/**
 * Convert seconds to timestamp string (mm:ss)
 */
export const secondsToTimestamp = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Generate a color based on score value
 */
export const getScoreColor = (score: number): string => {
  if (score >= 0.7) return '#10B981'; // success
  if (score >= 0.4) return '#FE7743'; // primary
  return '#273F4F'; // content
};

/**
 * Format file size
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' bytes';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
};