/* global cv */

import React, { useRef, useState } from 'react';
import Histogram from './Histogram';

const HistogramEqualization = ({ srcImage, method }) => {
  const canvasRef = useRef(null);
  const [processedImageData, setProcessedImageData] = useState(null);

  const applyHistogramEqualization = () => {
    if (!srcImage || !cv) return;
  
    const imgElement = new Image();
    imgElement.src = srcImage;
    imgElement.onload = () => {
      const src = cv.imread(imgElement);
      let dst = new cv.Mat();
  
      if (method === 'rgb') {
        const channels = new cv.MatVector();
        cv.split(src, channels);
  
        for (let i = 0; i < 3; i++) {
          cv.equalizeHist(channels.get(i), channels.get(i));
        }
  
        cv.merge(channels, dst);
        channels.delete();
      } else if (method === 'hsv') {
        cv.cvtColor(src, dst, cv.COLOR_RGBA2RGB);
        cv.cvtColor(dst, dst, cv.COLOR_RGB2HSV);
  
        const channels = new cv.MatVector();
        cv.split(dst, channels);
  
        cv.equalizeHist(channels.get(2), channels.get(2)); // Equalize V channel
        cv.merge(channels, dst);
  
        cv.cvtColor(dst, dst, cv.COLOR_HSV2RGB);
        cv.cvtColor(dst, dst, cv.COLOR_RGB2RGBA); // Fix for ImageData
        channels.delete();
      }
  
      cv.imshow(canvasRef.current, dst);
  
      const imageData = new ImageData(
        new Uint8ClampedArray(dst.data),
        dst.cols,
        dst.rows
      );
      setProcessedImageData(imageData);
  
      src.delete();
      dst.delete();
    };
  };  

  return (
    <div style={{ margin: '10px 0' }}>
      <button onClick={applyHistogramEqualization} style={{ marginBottom: '5px' }}>
        Apply {method.toUpperCase()} Equalization
      </button>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'start' }}>
      <canvas
          ref={canvasRef}
          style={{
            maxWidth: '800px',
            maxHeight: '400px',
            width: 'auto',
            height: 'auto'
          }}
        />
        {processedImageData && <Histogram imageData={processedImageData} />}
      </div>
    </div>
  );
};

export default HistogramEqualization;
