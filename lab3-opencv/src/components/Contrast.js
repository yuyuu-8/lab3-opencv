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

      src.delete();
      dst.delete();
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
