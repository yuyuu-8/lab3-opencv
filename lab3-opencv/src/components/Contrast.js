/* global cv */

import React, { useRef, useState } from 'react';
import Histogram from './Histogram';

const Contrast = ({ srcImage }) => {
  const canvasRef = useRef(null);
  const [processedImageData, setProcessedImageData] = useState(null);

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
        const f_min = minMax.minVal;
        const f_max = minMax.maxVal;

        if (f_max === f_min) {
          continue;
        }

        const alpha = 255.0 / (f_max - f_min);
        const beta = -f_min * alpha;

        channel.convertTo(channel, cv.CV_8U, alpha, beta);
      }

      cv.merge(channels, dst);
      
      cv.imshow(canvasRef.current, dst);

      // Получаем данные изображения для гистограммы
      const imageData = new ImageData(
        new Uint8ClampedArray(dst.data),
        dst.cols,
        dst.rows
      );
      setProcessedImageData(imageData);

      src.delete();
      dst.delete();
      channels.delete();
    };
  };

  return (
    <div style={{ margin: '10px 0' }}>
      <button onClick={applyContrast} style={{ marginBottom: '5px' }}>Apply Linear Contrast</button>
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
        {processedImageData && (
          <Histogram imageData={processedImageData} />
        )}
      </div>
    </div>
  );
};

export default Contrast;