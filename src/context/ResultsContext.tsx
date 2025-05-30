import React, { createContext, useContext, useState, ReactNode } from 'react';
import axios from 'axios';

// Types
export interface MomentRetrieval {
  startTime: string;
  endTime: string;
  score: number;
}

export interface HighlightPoint {
  x: number;
  y: number;
}

export interface Results {
  moment_retrieval: MomentRetrieval[];
  highlight_detection: HighlightPoint[];
}

interface ResultsContextType {
  results: Results | null;
  loading: boolean;
  error: string | null;
  videoFile: File | null;
  videoUrl: string | null;
  query: string;
  setQuery: (query: string) => void;
  setVideoFile: (file: File | null) => void;
  submitRequest: () => Promise<void>;
  clearResults: () => void;
}

const initialResults: ResultsContextType = {
  results: null,
  loading: false,
  error: null,
  videoFile: null,
  videoUrl: null,
  query: '',
  setQuery: () => {},
  setVideoFile: () => {},
  submitRequest: async () => {},
  clearResults: () => {},
};

const ResultsContext = createContext<ResultsContextType>(initialResults);

export const useResults = () => useContext(ResultsContext);

export const ResultsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [results, setResults] = useState<Results | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [query, setQuery] = useState<string>('');

  const handleSetVideoFile = (file: File | null) => {
    setVideoFile(file);
    
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
    } else {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
      setVideoUrl(null);
    }
  };

  const submitRequest = async () => {
    if (!videoFile || !query.trim()) {
      setError('Please upload a video and enter a query');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('video', videoFile);
      formData.append('query', query);

      const response = await axios.post(
        'https://misbahkhan-r2-tuning.hf.space/predict',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      // Transform API response to our internal format if needed
      const responseData = response.data;
      
      // Format the moment_retrieval data as needed
      const formattedResults: Results = {
        moment_retrieval: responseData.moment_retrieval.map((item: [string, string, number]) => ({
          startTime: item[0],
          endTime: item[1],
          score: item[2],
        })),
        highlight_detection: responseData.highlight_detection,
      };

      setResults(formattedResults);
    } catch (err) {
      console.error('Error submitting request:', err);
      setError('Failed to process the video. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setResults(null);
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }
    setVideoUrl(null);
    setVideoFile(null);
    setQuery('');
    setError(null);
  };

  return (
    <ResultsContext.Provider
      value={{
        results,
        loading,
        error,
        videoFile,
        videoUrl,
        query,
        setQuery,
        setVideoFile: handleSetVideoFile,
        submitRequest,
        clearResults,
      }}
    >
      {children}
    </ResultsContext.Provider>
  );
};