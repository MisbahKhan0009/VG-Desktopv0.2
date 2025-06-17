import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import ReactPlayer from "react-player";
import { Clock, Film, MonitorPlay, LayoutGrid } from "lucide-react";
import { useResults } from "../context/ResultsContext";
import { formatFileSize, secondsToTimestamp } from "../utils/helpers";

const VideoPreviewCard: React.FC = () => {
  const { videoUrl, videoFile } = useResults();
  const playerRef = useRef<ReactPlayer>(null);
  const [metadata, setMetadata] = useState({
    duration: "00:00",
    format: "-",
    resolution: "-",
  });
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!videoFile) {
      setMetadata({
        duration: "00:00",
        format: "-",
        resolution: "-",
      });
      return;
    }

    // Get file format
    const format = videoFile.type.split("/")[1].toUpperCase();

    // Create video element to get metadata
    const video = document.createElement("video");
    video.preload = "metadata";
    video.src = videoUrl || "";

    video.onloadedmetadata = () => {
      setMetadata({
        duration: secondsToTimestamp(video.duration),
        format: format,
        resolution: `${video.videoWidth}x${video.videoHeight}`,
      });
    };

    // Clean up
    return () => {
      video.remove();
    };
  }, [videoFile, videoUrl]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  if (!videoUrl) {
    return (
      <motion.div className="retro-card p-6 h-full flex flex-col" whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
        <h2 className="text-2xl font-display mb-4 text-content">Video Preview</h2>
        <div className="flex-1 flex items-center justify-center bg-content/5 rounded-lg border border-content/10">
          <div className="text-center p-8">
            <MonitorPlay size={48} className="mx-auto mb-4 text-content/30" />
            <p className="text-content/50">Upload a video to preview</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div className="retro-card p-6 h-full flex flex-col" whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
      <h2 className="text-2xl font-display mb-4 text-content">Video Preview</h2>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 relative rounded-lg overflow-hidden bg-black">
          <ReactPlayer ref={playerRef} url={videoUrl} width="100%" height="100%" playing={isPlaying} controls={true} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} />
        </div>

        <div className="flex flex-col justify-between bg-content/5 rounded-lg p-4">
          <div>
            <h3 className="font-display text-lg mb-3">Video Metadata</h3>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Clock size={20} className="text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Duration</p>
                  <p className="text-content text-lg">{metadata.duration}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Film size={20} className="text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Format</p>
                  <p className="text-content text-lg">{metadata.format}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <LayoutGrid size={20} className="text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Resolution</p>
                  <p className="text-content text-lg">{metadata.resolution}</p>
                </div>
              </div>

              {videoFile && (
                <div className="flex items-start gap-3">
                  <Film size={20} className="text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">File Size</p>
                    <p className="text-content text-lg">{formatFileSize(videoFile.size)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <motion.button onClick={handlePlayPause} className="mt-4 w-full py-2 px-4 bg-primary/10 hover:bg-primary/20 text-primary font-medium rounded-lg transition-colors" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            {isPlaying ? "Pause Video" : "Play Video"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default VideoPreviewCard;
