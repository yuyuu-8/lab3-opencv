/* global cv */

import React from 'react';

const Histogram = ({ srcImage }) => {
  const showHistogram = () => {
    if (srcImage) {
      const imgElement = document.createElement('img');
      imgElement.src = srcImage;
      imgElement.onload = () => {
        const mat = cv.imread(imgElement);
        const hist = new cv.Mat();
        const channels = new cv.MatVector();
        channels.push_back(mat);
        cv.calcHist(channels, [0], new cv.Mat(), hist, [256], [0, 255]);
        
        const canvas = document.getElementById('canvasOutput');
        const ctx = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 150;
        
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        let max = 0;
        for (let i = 0; i < hist.rows; i++) {
          const value = hist.data32F[i];
          if (value > max) max = value;
        }
        
        ctx.fillStyle = 'black';
        const scale = canvas.height / max;
        for (let i = 0; i < hist.rows; i++) {
          const value = hist.data32F[i] * scale;
          ctx.fillRect(i, canvas.height - value, 1, value);
        }
        
        hist.delete();
        mat.delete();
        channels.delete();
      };
    }
  };

  return (
    <div style={{ margin: '10px 0' }}>
      <button onClick={showHistogram} style={{ marginBottom: '5px' }}>Show Histogram</button>
      <canvas id="canvasOutput" style={{ width: '256px', height: '150px', backgroundColor: 'white' }} />
    </div>
  );
};

export default Histogram;
