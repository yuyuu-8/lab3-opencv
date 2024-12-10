/* global cv */

import React, { useRef } from 'react';

const ImageProcessor = ({ srcImage }) => {
  const canvasRef = useRef(null);

  const applyLinearContrast = () => {
    if (!srcImage || !cv) return;
    const imgElement = new Image();
    imgElement.src = srcImage;
    imgElement.onload = () => {
      const src = cv.imread(imgElement);
      const dst = new cv.Mat();

      cv.cvtColor(src, src, cv.COLOR_RGBA2RGB);
      const minMax = cv.minMaxLoc(src);
      const fMin = minMax.minVal;
      const fMax = minMax.maxVal;
      const alpha = 255 / (fMax - fMin);
      const beta = -fMin * alpha;
      src.convertTo(dst, -1, alpha, beta);
      cv.cvtColor(dst, dst, cv.COLOR_RGB2RGBA);

      cv.imshow(canvasRef.current, dst);
      src.delete();
      dst.delete();
    };
  };

  const applySharpening = () => {
    if (!srcImage || !cv) return;
    const imgElement = new Image();
    imgElement.src = srcImage;
    imgElement.onload = () => {
      const src = cv.imread(imgElement);
      const dst = new cv.Mat();
      const kernel = cv.Mat.ones(3, 3, cv.CV_32F);
      kernel.data32F[4] = 9.0;
      kernel.data32F[0] = kernel.data32F[1] = kernel.data32F[2] = -1.0;
      kernel.data32F[3] = kernel.data32F[5] = kernel.data32F[6] = -1.0;
      kernel.data32F[7] = kernel.data32F[8] = -1.0;
      cv.filter2D(src, dst, cv.CV_8U, kernel);
      cv.imshow(canvasRef.current, dst);
      src.delete();
      dst.delete();
      kernel.delete();
    };
  };

  return (
    <div style={{ margin: '10px 0' }}>
      <button onClick={applyLinearContrast} style={{ marginBottom: '5px' }}>Apply Linear Contrast</button>
      <button onClick={applySharpening} style={{ marginBottom: '5px' }}>Sharpen Image</button>
      <canvas ref={canvasRef} style={{ maxWidth: '100%' }} />
    </div>
  );
};

export default ImageProcessor;
