import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Upload, FileVideo, X } from 'lucide-react';
import { useResults } from '../context/ResultsContext';

const UploadCard: React.FC = () => {
  const { videoFile, setVideoFile, query, setQuery, submitRequest, loading, error } = useResults();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setVideoFile(acceptedFiles[0]);
    }
  }, [setVideoFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.mov', '.avi', '.webm']
    },
    maxFiles: 1
  });

  const handleClearVideo = (e: React.MouseEvent) => {
    e.stopPropagation();
    setVideoFile(null);
  };

  return (
    <motion.div 
      className="retro-card p-6 h-full flex flex-col"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <h2 className="text-2xl font-display mb-4 text-content">Upload Video</h2>
      
      <div className="flex-1 flex flex-col gap-4">
        <div 
          {...getRootProps()} 
          className={`
            border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors
            flex flex-col items-center justify-center text-center gap-2 min-h-[160px]
            ${isDragActive ? 'border-primary bg-primary/5' : 'border-content/20 hover:border-primary/50 hover:bg-background'}
            ${videoFile ? 'bg-primary/5 border-primary/50' : ''}
          `}
        >
          <input {...getInputProps()} />
          
          {videoFile ? (
            <div className="flex flex-col items-center gap-2">
              <div className="relative">
                <FileVideo size={48} className="text-primary" />
                <button 
                  onClick={handleClearVideo}
                  className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                >
                  <X size={16} className="text-error" />
                </button>
              </div>
              <p className="font-medium text-content">{videoFile.name}</p>
              <p className="text-sm text-content/70">
                {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          ) : (
            <>
              <Upload 
                size={36} 
                className={`${isDragActive ? 'text-primary' : 'text-content/50'}`} 
              />
              <p className="font-medium">
                {isDragActive ? 'Drop your video here' : 'Drag & drop your video here'}
              </p>
              <p className="text-sm text-content/70">or click to browse files</p>
              <p className="text-xs text-content/50 mt-2">Supports MP4, MOV, AVI, WebM</p>
            </>
          )}
        </div>
        
        <div className="space-y-3">
          <label className="block">
            <span className="font-medium text-content">Query</span>
            <motion.input 
              type="text" 
              placeholder="Enter a descriptive query (e.g., 'A person walking in a park')"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full px-4 py-3 mt-1 border border-content/20 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none shimmering-bg"
              whileFocus={{ boxShadow: '0 0 0 2px rgba(254, 119, 67, 0.2)' }}
            />
          </label>
          
          {error && (
            <p className="text-error text-sm">{error}</p>
          )}
          
          <motion.button
            onClick={submitRequest}
            disabled={!videoFile || !query.trim() || loading}
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
                <span>Processing...</span>
              </>
            ) : (
              <span>Analyze Video</span>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default UploadCard;