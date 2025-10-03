'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, SkipBack, SkipForward } from 'lucide-react';

interface AudioPlayerProps {
  src: string; // Path to audio file
  title?: string;
  chapter?: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src, title = "Unknown Title", chapter = "Chapter 1" }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const audio = new Audio(src);
    audioRef.current = audio;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime / audio.duration) * 100);
    };
    const handleEnded = () => setIsPlaying(false);
    const handleError = () => {
      setError("Error loading audio.");
      setIsLoading(false);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.pause();
      audio.src = '';
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [src]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play().catch(() => setError("Error playing audio."));
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    if (audioRef.current) audioRef.current.volume = vol;
    setVolume(vol);
    setIsMuted(vol === 0);
  };

  const skipTime = (seconds: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.max(0, Math.min(audioRef.current.currentTime + seconds, duration));
  };

  const formatTime = (time: number) => `${Math.floor(time / 60)}:${Math.floor(time % 60).toString().padStart(2, '0')}`;

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return;
    const bounds = e.currentTarget.getBoundingClientRect();
    const percentage = (e.clientX - bounds.left) / bounds.width;
    audioRef.current.currentTime = percentage * duration;
    setProgress(percentage * 100);
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 backdrop-blur-sm w-full max-w-xl mx-auto">
      {error ? (
        <p className="text-red-400 text-center">{error}</p>
      ) : (
        <>
          <div className="flex justify-between mb-2 text-white">
            <span>{title}</span>
            <span className="text-emerald-400">{chapter}</span>
          </div>

          {/* Progress Bar */}
          <div className="relative h-2 bg-slate-700 rounded cursor-pointer mb-2" onClick={handleProgressClick}>
            <div className="absolute h-full bg-emerald-400 rounded" style={{ width: `${progress}%` }} />
            <div
              className="absolute h-4 w-4 bg-white rounded-full -top-1 opacity-0 group-hover:opacity-100 transition-all"
              style={{ left: `${progress}%`, transform: 'translateX(-50%)' }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400 mb-4">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button onClick={toggleMute}>
                {isMuted ? <VolumeX className="w-6 h-6 text-gray-400" /> : <Volume2 className="w-6 h-6 text-gray-400" />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={volume}
                onChange={handleVolumeChange}
                className="w-24 accent-emerald-400"
              />
            </div>

            <div className="flex items-center space-x-3">
              <button onClick={() => skipTime(-10)}>
                <SkipBack className="w-6 h-6 text-gray-400" />
              </button>
              <button
                onClick={togglePlay}
                className="p-4 bg-emerald-500 hover:bg-emerald-600 rounded-full transition-all transform hover:scale-105 active:scale-95"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : isPlaying ? (
                  <Pause className="w-6 h-6 text-white" />
                ) : (
                  <Play className="w-6 h-6 text-white ml-1" />
                )}
              </button>
              <button onClick={() => skipTime(10)}>
                <SkipForward className="w-6 h-6 text-gray-400" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AudioPlayer;
