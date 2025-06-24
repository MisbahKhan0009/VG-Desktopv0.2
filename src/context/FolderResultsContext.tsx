import React, { createContext, useContext, useState, ReactNode } from 'react';
import axios from 'axios';

// Types
export interface VideoResult {
  fileName: string;
  fileSize: number;
  results: {
    moment_retrieval: Array<{
      startTime: string;
      endTime: string;
      score: number;
    }>;
    highlight_detection: Array<{
      x: number;
      y: number;
    }>;
  };
  videoUrl: string;
  highestScore: number;
  bestMoment: {
    startTime: string;
    endTime: string;
    score: number;
  } | null;
}

export interface BatchResults {
  videos: VideoResult[];
  bestVideo: VideoResult | null;
  totalProcessed: number;
}

export interface ProcessingProgress {
  current: number;
  total: number;
  currentFileName: string;
}

interface FolderResultsContextType {
  batchResults: BatchResults | null;
  loading: boolean;
  error: string | null;
  videoFiles: File[];
  query: string;
  progress: ProcessingProgress | null;
  setQuery: (query: string) => void;
  setVideoFiles: (files: File[]) => void;
  submitBatchRequest: () => Promise<void>;
  clearResults: () => void;
}

const initialFolderResults: FolderResultsContextType = {
  batchResults: null,
  loading: false,
  error: null,
  videoFiles: [],
  query: '',
  progress: null,
  setQuery: () => {},
  setVideoFiles: () => {},
  submitBatchRequest: async () => {},
  clearResults: () => {},
};

const FolderResultsContext = createContext<FolderResultsContextType>(initialFolderResults);

export const useFolderResults = () => useContext(FolderResultsContext);

export const FolderResultsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [batchResults, setBatchResults] = useState<BatchResults | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [videoFiles, setVideoFiles] = useState<File[]>([]);
  const [query, setQuery] = useState<string>('');
  const [progress, setProgress] = useState<ProcessingProgress | null>(null);

  const submitBatchRequest = async () => {
    if (videoFiles.length === 0 || !query.trim()) {
      setError('Please upload videos and enter a query');
      return;
    }

    setLoading(true);
    setError(null);
    setProgress({ current: 0, total: videoFiles.length, currentFileName: '' });

    const processedVideos: VideoResult[] = [];
    let bestVideo: VideoResult | null = null;
    let highestOverallScore = 0;

    try {
      for (let i = 0; i < videoFiles.length; i++) {
        const file = videoFiles[i];
        
        setProgress({
          current: i + 1,
          total: videoFiles.length,
          currentFileName: file.name
        });

        const formData = new FormData();
        formData.append('video', file);
        formData.append('query', query);

        try {
          const response = await axios.post(
            'https://misbahkhan-r2-tuning.hf.space/predict',
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            }
          );

          const responseData = response.data;
          
          // Format the results
          const formattedResults = {
            moment_retrieval: responseData.moment_retrieval.map((item: [string, string, number]) => ({
              startTime: item[0],
              endTime: item[1],
              score: item[2],
            })),
            highlight_detection: responseData.highlight_detection,
          };

          // Find the highest score for this video
          const highestScore = Math.max(...formattedResults.moment_retrieval.map(m => m.score));
          const bestMoment = formattedResults.moment_retrieval.find(m => m.score === highestScore) || null;

          const videoResult: VideoResult = {
            fileName: file.name,
            fileSize: file.size,
            results: formattedResults,
            videoUrl: URL.createObjectURL(file),
            highestScore,
            bestMoment,
          };

          processedVideos.push(videoResult);

          // Check if this is the best video overall
          if (highestScore > highestOverallScore) {
            highestOverallScore = highestScore;
            bestVideo = videoResult;
          }

          // Save progress to localStorage (optional - for persistence)
          const progressData = {
            videos: processedVideos,
            query,
            timestamp: Date.now(),
          };
          localStorage.setItem('batchProcessingProgress', JSON.stringify(progressData));

        } catch (videoError) {
          console.error(`Error processing ${file.name}:`, videoError);
          // Continue with next video instead of stopping the entire batch
        }
      }

      const finalResults: BatchResults = {
        videos: processedVideos,
        bestVideo,
        totalProcessed: processedVideos.length,
      };

      setBatchResults(finalResults);

      // Clear progress data from localStorage
      localStorage.removeItem('batchProcessingProgress');

    } catch (err) {
      console.error('Error in batch processing:', err);
      setError('Failed to process videos. Please try again.');
    } finally {
      setLoading(false);
      setProgress(null);
    }
  };

  const clearResults = () => {
    // Clean up video URLs
    if (batchResults) {
      batchResults.videos.forEach(video => {
        URL.revokeObjectURL(video.videoUrl);
      });
    }
    
    setBatchResults(null);
    setVideoFiles([]);
    setQuery('');
    setError(null);
    setProgress(null);
    localStorage.removeItem('batchProcessingProgress');
  };

  const handleSetVideoFiles = (files: File[]) => {
    // Clean up previous video URLs
    if (batchResults) {
      batchResults.videos.forEach(video => {
        URL.revokeObjectURL(video.videoUrl);
      });
    }
    
    setVideoFiles(files);
  };

  return (
    <FolderResultsContext.Provider
      value={{
        batchResults,
        loading,
        error,
        videoFiles,
        query,
        progress,
        setQuery,
        setVideoFiles: handleSetVideoFiles,
        submitBatchRequest,
        clearResults,
      }}
    >
      {children}
    </FolderResultsContext.Provider>
  );
};