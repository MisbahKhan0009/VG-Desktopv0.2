import React, { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Upload, FileVideo, X } from 'lucide-react';
import { useResults } from '../context/ResultsContext';
import { toast } from 'sonner';

const UploadCard: React.FC = () => {
  const { videoFile, setVideoFile, query, setQuery, submitRequest, loading, error } = useResults();
  const [selectingSample, setSelectingSample] = useState<string | null>(null);

  // Sample gallery items (4 videos + descriptions)
  const samples = [
    {
      label: 'Abuse001_x264.mp4',
      src: '/SampleVideos/Abuse001_x264.mp4',
      description: 'A man slaping an woman and woman falls down',
    },
    {
      label: 'Burglary005_x264.mp4',
      src: '/SampleVideos/Burglary005_x264.mp4',
  description: 'A man wearing white t-shirt kicking on a door and break in the house',
    },
    {
      label: 'Stealing003_x264.mp4',
      src: '/SampleVideos/Stealing003_x264.mp4',
      description: 'A black car is started and moved backward',
    },
    {
      label: 'Stealing013_x264.mp4',
      src: '/SampleVideos/Stealing013_x264.mp4',
      description: 'A person taking a bike by hand, without starting the engine',
    },
  ] as const;

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setVideoFile(acceptedFiles[0]);
    }
  }, [setVideoFile]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
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

  const handleSelectSample = async (item: typeof samples[number]) => {
    try {
      setSelectingSample(item.label);
      // Fetch the asset and convert to File so the rest of the app works the same way
      const res = await fetch(item.src);
      if (!res.ok) throw new Error('Failed to fetch sample video');
      const blob = await res.blob();
      const fileName = item.label;
      const type = blob.type || 'video/mp4';
      const file = new File([blob], fileName, { type });
      setVideoFile(file);
      setQuery(item.description);
    } catch (e) {
      console.error(e);
      toast.error('Failed to load sample video');
    } finally {
      setSelectingSample(null);
    }
  };

  return (
    <motion.div 
      className="retro-card p-6 h-full flex flex-col"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <h2 className="text-2xl font-display mb-4 text-content">Upload Video</h2>
      
      <div className="flex-1 flex flex-col gap-4">
        {/* Test Gallery: 4 samples + 1 upload tile */}
        <div className="bg-content/5 border border-content/10 rounded-lg p-3">
          <p className="text-sm font-medium mb-2 text-content">Test Gallery</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {samples.map((item) => (
              <button
                key={item.label}
                onClick={() => handleSelectSample(item)}
                className={`group relative rounded-md overflow-hidden border border-content/10 hover:border-primary/50 transition-colors ${selectingSample === item.label ? 'opacity-70' : ''}`}
                title={item.description}
              >
                <video
                  src={item.src}
                  className="w-full aspect-video object-cover bg-black"
                  muted
                  playsInline
                  preload="metadata"
                />
                <div className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-[10px] sm:text-xs px-2 py-1 truncate">{item.label}</div>
              </button>
            ))}

            {/* 5th tile: open file dialog */}
            <button
              onClick={() => open()}
              className="flex items-center justify-center border border-dashed border-content/20 rounded-md min-h-[64px] aspect-video hover:border-primary/60 hover:bg-primary/5 transition-colors"
              title="Upload your own video"
            >
              <div className="flex items-center gap-2 text-content/70">
                <Upload size={16} />
                <span className="text-xs">Upload</span>
              </div>
            </button>
          </div>
          {selectingSample && (
            <p className="mt-2 text-xs text-content/60">Loading {selectingSample}…</p>
          )}
        </div>

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