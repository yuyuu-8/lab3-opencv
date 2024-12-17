/* global cv */

import React, { useRef } from 'react';

const Sharpening = ({ srcImage }) => {
  const canvasRef = useRef(null);

  const applySharpening = () => {
    if (!srcImage || !cv) return;
    const imgElement = new Image();
    imgElement.src = srcImage;
    imgElement.onload = () => {
      const src = cv.imread(imgElement);
      const dst = new cv.Mat();

      // Создаем ядро для повышения резкости
      const kernel = cv.Mat.ones(3, 3, cv.CV_32F);
      kernel.data32F[4] = 9.0; // Центр ядра усиливает центральный пиксель
      kernel.data32F[0] = kernel.data32F[1] = kernel.data32F[2] = -1.0;
      kernel.data32F[3] = kernel.data32F[5] = kernel.data32F[6] = -1.0;
      kernel.data32F[7] = kernel.data32F[8] = -1.0;

      // Применяем фильтр
      cv.filter2D(src, dst, cv.CV_8U, kernel);

      cv.imshow(canvasRef.current, dst);

      src.delete();
      dst.delete();
      kernel.delete();
    };
  };

  return (
    <div style={{ margin: '10px 0' }}>
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
        <button onClick={applySharpening} style={{ alignSelf: 'center' }}>
          Sharpen Image
        </button>
      </div>
    </div>
  );
};

export default Sharpening;
