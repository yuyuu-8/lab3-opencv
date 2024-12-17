/* global cv */

import React, { useState, useEffect } from 'react';
import Contrast from './components/Contrast';
import HistogramEqualization from './components/HistogramEqualization';
import Sharpening from './components/Sharpening';
import Histogram from './components/Histogram';
import './App.css';

function App() {
  const [srcImage, setSrcImage] = useState(null);
  const [imageKey, setImageKey] = useState(0);
  const [originalImageData, setOriginalImageData] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSrcImage(e.target.result);
        setImageKey(prev => prev + 1);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (srcImage && cv) {
      const imgElement = new Image();
      imgElement.src = srcImage;
      imgElement.onload = () => {
        const src = cv.imread(imgElement);
        const matData = new cv.MatVector();
        cv.split(src, matData);
        const processedMat = new cv.Mat();
        cv.merge(matData, processedMat);
        
        const imageData = new ImageData(
          new Uint8ClampedArray(processedMat.data),
          processedMat.cols,
          processedMat.rows
        );
        setOriginalImageData(imageData);
        
        src.delete();
        processedMat.delete();
        matData.delete();
      };
    }
  }, [srcImage]);

  return (
    <div className="App">
      <div style={{ padding: '10px', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ margin: '10px 0' }}>Image Processing</h2>
        <input type="file" accept="image/*" onChange={handleImageUpload} style={{ marginBottom: '10px' }} />
        {srcImage && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Оригинальное изображение */}
            <div>
              <h4 style={{ margin: '5px 0' }}>Original Image</h4>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'start' }}>
                <img 
                  key={imageKey}
                  src={srcImage} 
                  alt="Uploaded" 
                  style={{ 
                    maxWidth: '800px',
                    maxHeight: '400px',
                    width: 'auto',
                    height: 'auto'
                  }} 
                />
                {originalImageData && (
                  <Histogram imageData={originalImageData} />
                )}
              </div>
            </div>

            {/* RGB Эквализация */}
            <div>
              <h4 style={{ margin: '5px 0' }}>RGB Equalization</h4>
              <HistogramEqualization key={`rgb-${imageKey}`} srcImage={srcImage} method="rgb" />
            </div>

            {/* HSV Эквализация */}
            <div>
              <h4 style={{ margin: '5px 0' }}>HSV Equalization</h4>
              <HistogramEqualization key={`hsv-${imageKey}`} srcImage={srcImage} method="hsv" />
            </div>

            {/* Линейное контрастирование */}
            <div>
              <h4 style={{ margin: '5px 0' }}>Linear Contrast</h4>
              <Contrast key={`contrast-${imageKey}`} srcImage={srcImage} />
            </div>

            {/* Повышение резкости */}
            <div>
              <h4 style={{ margin: '5px 0' }}>Sharpening</h4>
              <Sharpening key={`sharp-${imageKey}`} srcImage={srcImage} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;