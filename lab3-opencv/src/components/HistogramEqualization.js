/* global cv */

import React, { useRef } from 'react';

const HistogramEqualization = ({ srcImage, method = 'rgb' }) => {
  const canvasRef = useRef(null);

  const applyRGBEqualization = () => {
    if (!srcImage || !cv) return;
    const imgElement = new Image();
    imgElement.src = srcImage;
    imgElement.onload = () => {
      const src = cv.imread(imgElement);
      const dst = new cv.Mat();
      const rgbPlanes = new cv.MatVector();
      
      cv.split(src, rgbPlanes);
      
      for (let i = 0; i < 3; i++) {
        cv.equalizeHist(rgbPlanes.get(i), rgbPlanes.get(i));
      }
      
      cv.merge(rgbPlanes, dst);
      
      cv.imshow(canvasRef.current, dst);
      
      src.delete();
      dst.delete();
      for (let i = 0; i < 3; i++) {
        rgbPlanes.get(i).delete();
      }
      rgbPlanes.delete();
    };
  };

  const applyHSVEqualization = () => {
    if (!srcImage || !cv) return;
    const imgElement = new Image();
    imgElement.src = srcImage;
    imgElement.onload = () => {
      const src = cv.imread(imgElement);
      const dst = new cv.Mat();
      
      const hsv = new cv.Mat();
      cv.cvtColor(src, hsv, cv.COLOR_BGR2HSV);
      
      const hsvPlanes = new cv.MatVector();
      cv.split(hsv, hsvPlanes);
      
      cv.equalizeHist(hsvPlanes.get(2), hsvPlanes.get(2));
      
      cv.merge(hsvPlanes, hsv);
      
      cv.cvtColor(hsv, dst, cv.COLOR_HSV2BGR);
      
      cv.imshow(canvasRef.current, dst);
      
      src.delete();
      dst.delete();
      hsv.delete();
      for (let i = 0; i < 3; i++) {
        hsvPlanes.get(i).delete();
      }
      hsvPlanes.delete();
    };
  };

  return (
    <div style={{ margin: '10px 0' }}>
      <button 
        onClick={method === 'rgb' ? applyRGBEqualization : applyHSVEqualization} 
        style={{ marginBottom: '5px' }}
      >
        {method === 'rgb' ? 'Apply RGB Equalization' : 'Apply HSV Equalization'}
      </button>
      <canvas ref={canvasRef} style={{ maxWidth: '100%' }} />
    </div>
  );
};

export default HistogramEqualization;
