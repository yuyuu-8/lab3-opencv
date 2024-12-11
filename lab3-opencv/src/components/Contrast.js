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

      cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);

      if (src.type() !== cv.CV_8U) {
        src.convertTo(src, cv.CV_8U);
      }

      const minMax = cv.minMaxLoc(src);
      const f_min = minMax.minVal;
      const f_max = minMax.maxVal;

      if (f_max === f_min) {
        cv.imshow(canvasRef.current, src);
        src.delete();
        return;
      }

      const alpha = 255.0 / (f_max - f_min);
      const beta = -f_min * alpha;
      src.convertTo(dst, cv.CV_8U, alpha, beta);

      cv.imshow(canvasRef.current, dst);

      src.delete();
      dst.delete();
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
