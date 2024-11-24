/* global cv */

import React, { useRef } from 'react';

const Contrast = ({ srcImage }) => {
  const canvasRef = useRef(null);

  const applyContrast = () => {
    if (!srcImage || !cv) return;
    const imgElement = new Image();
    imgElement.src = srcImage;
    imgElement.onload = () => {
      const src = cv.imread(imgElement);
      const dst = new cv.Mat();
      
      const channels = new cv.MatVector();
      cv.split(src, channels);
      
      for (let i = 0; i < 3; i++) {
        const channel = channels.get(i);
        const minMax = cv.minMaxLoc(channel);
        const alpha = 255.0 / (minMax.maxVal - minMax.minVal);
        const beta = -minMax.minVal * alpha;
        channel.convertTo(channel, -1, alpha, beta);
      }
      
      cv.merge(channels, dst);
      
      cv.imshow(canvasRef.current, dst);
      
      src.delete();
      dst.delete();
      for (let i = 0; i < 3; i++) {
        channels.get(i).delete();
      }
      channels.delete();
    };
  };

  return (
    <div style={{ margin: '10px 0' }}>
      <button onClick={applyContrast} style={{ marginBottom: '5px' }}>Apply Linear Contrast</button>
      <canvas ref={canvasRef} style={{ maxWidth: '100%' }} />
    </div>
  );
};

export default Contrast;
