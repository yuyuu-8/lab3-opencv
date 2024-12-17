/* global cv */

import React, { useEffect, useRef } from 'react';

const Histogram = ({ imageData, width = 256, height = 150 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!imageData || !cv) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, width, height);
    
    // Получаем гистограммы для каждого канала
    const src = cv.matFromImageData(imageData);
    const channels = new cv.MatVector();
    cv.split(src, channels);
    
    const histSize = [256];
    const ranges = [0, 256];
    const mask = new cv.Mat();
    const hist = [];
    const color = ['red', 'green', 'blue'];
    
    // Вычисляем гистограммы для каждого канала
    for (let i = 0; i < 3; i++) {
      hist[i] = new cv.Mat();
      // Создаем вектор из одного канала
      const channelVector = new cv.MatVector();
      channelVector.push_back(channels.get(i));
      
      cv.calcHist(channelVector, [0], mask, hist[i], histSize, ranges);
      channelVector.delete();
    }
    
    // Находим максимальное значение для масштабирования
    let maxVal = 0;
    for (let i = 0; i < 3; i++) {
      const max = cv.minMaxLoc(hist[i]).maxVal;
      if (max > maxVal) maxVal = max;
    }
    
    const scale = height / maxVal;
    
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.strokeStyle = color[i];
      ctx.lineWidth = 1;
      
      for (let j = 0; j < 256; j++) {
        const val = hist[i].data32F[j] * scale;
        if (j === 0) {
          ctx.moveTo(j, height - val);
        } else {
          ctx.lineTo(j, height - val);
        }
      }
      ctx.stroke();
    }
    
    src.delete();
    channels.delete();
    mask.delete();
    hist.forEach(h => h.delete());
  }, [imageData, width, height]);

  return (
    <canvas 
      ref={canvasRef} 
      width={width} 
      height={height}
      style={{ 
        border: '1px solid #ddd',
        background: '#fff',
        width: width,
        height: height
      }}
    />
  );
};

export default Histogram;