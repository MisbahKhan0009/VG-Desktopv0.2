import React, { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { FolderOpen, FileVideo, X, Play, Pause } from 'lucide-react';
import { useFolderResults } from '../context/FolderResultsContext';

const FolderUploadCard: React.FC = () => {
  const { 
    videoFiles, 
    setVideoFiles, 
    query, 
    setQuery, 
    submitBatchRequest, 
    loading, 
    error,
    progress 
  } = useFolderResults();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const videoFiles = acceptedFiles.filter(file => 
      file.type.startsWith('video/')
    );
    
    if (videoFiles.length > 0) {
      setVideoFiles(videoFiles);
    }
  }, [setVideoFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.mov', '.avi', '.webm']
    },
    multiple: true
  });

  const handleClearVideos = (e: React.MouseEvent) => {
    e.stopPropagation();
    setVideoFiles([]);
  };

  const handleRemoveVideo = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newFiles = videoFiles.filter((_, i) => i !== index);
    setVideoFiles(newFiles);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <motion.div 
      className="retro-card p-6 h-full flex flex-col"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <h2 className="text-2xl font-display mb-4 text-content">Batch Upload</h2>
      
      <div className="flex-1 flex flex-col gap-4">
        <div 
          {...getRootProps()} 
          className={`
            border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors
            flex flex-col items-center justify-center text-center gap-2 min-h-[160px]
            ${isDragActive ? 'border-primary bg-primary/5' : 'border-content/20 hover:border-primary/50 hover:bg-background'}
            ${videoFiles.length > 0 ? 'bg-primary/5 border-primary/50' : ''}
          `}
        >
          <input {...getInputProps()} />
          
          {videoFiles.length > 0 ? (
            <div className="flex flex-col items-center gap-2 w-full">
              <div className="relative">
                <FolderOpen size={48} className="text-primary" />
                <button 
                  onClick={handleClearVideos}
                  className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                >
                  <X size={16} className="text-error" />
                </button>
              </div>
              <p className="font-medium text-content">{videoFiles.length} videos selected</p>
              <p className="text-sm text-content/70">
                Total: {formatFileSize(videoFiles.reduce((sum, file) => sum + file.size, 0))}
              </p>
            </div>
          ) : (
            <>
              <FolderOpen 
                size={36} 
                className={`${isDragActive ? 'text-primary' : 'text-content/50'}`} 
              />
              <p className="font-medium">
                {isDragActive ? 'Drop your videos here' : 'Drag & drop multiple videos here'}
              </p>
              <p className="text-sm text-content/70">or click to browse files</p>
              <p className="text-xs text-content/50 mt-2">Supports MP4, MOV, AVI, WebM</p>
            </>
          )}
        </div>

        {videoFiles.length > 0 && (
          <div className="max-h-32 overflow-y-auto border border-content/10 rounded-lg p-2">
            <div className="space-y-1">
              {videoFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-content/5 rounded text-sm">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <FileVideo size={16} className="text-primary flex-shrink-0" />
                    <span className="truncate">{file.name}</span>
                    <span className="text-content/50 flex-shrink-0">
                      ({formatFileSize(file.size)})
                    </span>
                  </div>
                  <button
                    onClick={(e) => handleRemoveVideo(index, e)}
                    className="text-error hover:bg-error/10 p-1 rounded"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="space-y-3">
          <label className="block">
            <span className="font-medium text-content">Query</span>
            <motion.input 
              type="text" 
              placeholder="Enter a descriptive query (e.g., 'A person walking in a park')"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full px-4 py-3 mt-1 border border-content/20 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none"
              whileFocus={{ boxShadow: '0 0 0 2px rgba(254, 119, 67, 0.2)' }}
            />
          </label>
          
          {error && (
            <p className="text-error text-sm">{error}</p>
          )}

          {loading && progress && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Processing video {progress.current} of {progress.total}</span>
                <span>{Math.round((progress.current / progress.total) * 100)}%</span>
              </div>
              <div className="w-full bg-content/10 rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(progress.current / progress.total) * 100}%` }}
                ></div>
              </div>
              {progress.currentFileName && (
                <p className="text-xs text-content/70">
                  Currently processing: {progress.currentFileName}
                </p>
              )}
            </div>
          )}
          
          <motion.button
            onClick={submitBatchRequest}
            disabled={videoFiles.length === 0 || !query.trim() || loading}
            className={`
              w-full py-3 px-6 rounded-lg font-medium transition-all
              ${loading 
                ? 'bg-primary/50 cursor-not-allowed' 
                : 'bg-primary hover:bg-primary/90 active:scale-[0.98]'}
              text-white shadow-retro-lg flex items-center justify-center gap-2
            `}
            whileHover={{ y: -2, boxShadow: '6px 6px 0 rgba(0, 0, 0, 0.1)' }}
            whileTap={{ y: 0, boxShadow: '2px 2px 0 rgba(0, 0, 0, 0.1)' }}
          >
            {loading ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full"></div>
                <span>Processing Batch...</span>
              </>
            ) : (
              <span>Analyze All Videos</span>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default FolderUploadCard;