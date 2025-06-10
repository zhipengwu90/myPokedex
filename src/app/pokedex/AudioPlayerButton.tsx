import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";

import IconButton from "@mui/material/IconButton";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";

interface props {
  text: string;
  language?: string;
  soundUrl: string;
}
const AudioPlayerButton = forwardRef(({ text, soundUrl }: props, ref) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const soundRef = useRef<HTMLAudioElement | null>(null);

  const handleAudio = async () => {
    if (!audioLoaded) {
      setIsDisabled(true);
      setIsPlaying(true); // <-- Show PauseCircleIcon immediately
      const response = await fetch("/api/speedAPI", {
        method: "POST",
        body: JSON.stringify({ text }),
        headers: { "Content-Type": "application/json" },
      });
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      setAudioLoaded(true);

      audio.onended = () => {
        setIsPlaying(false);
        // Play the soundUrl audio after TTS finishes
        if (soundUrl) {
          const sound = new Audio(soundUrl);
          soundRef.current = sound;
          sound.play();
        }
      };
      audio.onpause = () => setIsPlaying(false);

      audio.play();
      setTimeout(() => setIsDisabled(false), 1000);
    } else if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        setIsPlaying(true); // <-- Show PauseCircleIcon immediately
        audioRef.current.play();
      }
    }
  };

  useEffect(() => {
    console.log(soundUrl);
    setAudioLoaded(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setIsPlaying(false);
    }
    if (soundRef.current) {
      soundRef.current.pause();
      soundRef.current = null;
    }
  }, [text, soundUrl]);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (soundRef.current) {
      soundRef.current.pause();
    }
    setIsPlaying(false);
    setAudioLoaded(false);
    setIsDisabled(false);
  };

  useImperativeHandle(ref, () => ({
    stopAudio,
  }));

  return (
    <IconButton
      color="primary"
      onClick={handleAudio}
      aria-label={isPlaying ? "Pause" : "Play"}
      className="ml-2"
      disabled={isDisabled}
    >
      {isPlaying ? (
        <PauseCircleIcon fontSize="large" color="error" />
      ) : (
        <PlayCircleIcon fontSize="large" color="error" />
      )}
    </IconButton>
  );
});

export default AudioPlayerButton;
