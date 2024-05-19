import React, { useEffect, useRef } from "react";
import "./AudioVisualizer.css"; // Include your styles here

const AudioVisualizer = () => {
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const bufferLengthRef = useRef(256);
  const dataArrayRef = useRef(new Uint8Array(bufferLengthRef.current));

  const numLines = 20;
  const threshold = 0;
  const minLineHeight = 10;
  const spacing = 2;

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    context.roundRect = function (x, y, w, h, r) {
      if (w < 2 * r) r = w / 2;
      if (h < 2 * r) r = h / 2;
      this.beginPath();
      this.moveTo(x + r, y);
      this.arcTo(x + w, y, x + w, y + h, r);
      this.arcTo(x + w, y + h, x, y + h, r);
      this.arcTo(x, y + h, x, y, r);
      this.arcTo(x, y, x + w, y, r);
      this.closePath();
      return this;
    };

    const initializeAudioVisualizer = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        audioContextRef.current = new (window.AudioContext ||
          window.webkitAudioContext)();
        const source = audioContextRef.current.createMediaStreamSource(stream);

        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;

        source.connect(analyserRef.current);

        bufferLengthRef.current = analyserRef.current.frequencyBinCount;
        dataArrayRef.current = new Uint8Array(bufferLengthRef.current);

        drawAudioVisualizer();
      } catch (error) {
        console.error("Error accessing microphone:", error);
      }
    };

    const drawAudioVisualizer = () => {
      analyserRef.current.getByteFrequencyData(dataArrayRef.current);

      context.fillStyle = "white";
      context.clearRect(0, 0, canvas.width, canvas.height);

      const sliceWidth = (canvas.width - (numLines - 1) * spacing) / numLines;
      const totalWidth = numLines * sliceWidth + (numLines - 1) * spacing;
      const startX = (canvas.width - totalWidth) / 2;
      const maxFrequency = analyserRef.current.frequencyBinCount / 2;

      for (let line = 0; line < numLines; line++) {
        const frequencyIndex = Math.round((line / numLines) * maxFrequency);
        const value = dataArrayRef.current[frequencyIndex] / 128.0;

        let lineHeight = minLineHeight;

        if (value > threshold) {
          lineHeight += (value * (canvas.height - minLineHeight)) / 2;
        }

        context.fillStyle = "black";
        context
          .roundRect(
            startX + line * (sliceWidth + spacing),
            (canvas.height - lineHeight) / 2,
            sliceWidth,
            lineHeight,
            10
          )
          .fill();
      }

      requestAnimationFrame(drawAudioVisualizer);
    };

    initializeAudioVisualizer();

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [minLineHeight, threshold, spacing]);

  return <canvas ref={canvasRef} className="audio-visualizer-canvas" />;
};

export default AudioVisualizer;
