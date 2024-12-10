/* global cv */

import React, { useState } from 'react';
import Contrast from './components/Contrast';
import HistogramEqualization from './components/HistogramEqualization';
import Sharpening from './components/Sharpening';
import './App.css';

function App() {
  const [srcImage, setSrcImage] = useState(null);
  const [imageKey, setImageKey] = useState(0);

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

  return (
    <div className="App">
      <div style={{ padding: '10px', maxWidth: '1000px', margin: '0 auto' }}>
        <h2 style={{ margin: '10px 0' }}>Image Processing</h2>
        <input type="file" accept="image/*" onChange={handleImageUpload} style={{ marginBottom: '10px' }} />
        {srcImage && (
          <div style={{ display: 'grid', gap: '15px' }}>
            <div>
              <h4 style={{ margin: '5px 0' }}>Original Image</h4>
              <div style={{ margin: '10px 0' }}>
                <img 
                  key={imageKey}
                  src={srcImage} 
                  alt="Uploaded" 
                  style={{ 
                    maxWidth: '800px',
                    maxHeight: '600px',
                    width: 'auto',
                    height: 'auto',
                    display: 'block',
                    margin: '0 auto'
                  }} 
                />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              <div>
                <h4 style={{ margin: '5px 0' }}>RGB Equalization</h4>
                <HistogramEqualization key={`rgb-${imageKey}`} srcImage={srcImage} method="rgb" />
              </div>
              <div>
                <h4 style={{ margin: '5px 0' }}>HSV Equalization</h4>
                <HistogramEqualization key={`hsv-${imageKey}`} srcImage={srcImage} method="hsv" />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              <div>
                <h4 style={{ margin: '5px 0' }}>Linear Contrast</h4>
                <Contrast key={imageKey} srcImage={srcImage} />
              </div>
              <div>
                <h4 style={{ margin: '5px 0' }}>Sharpening</h4>
                <Sharpening key={imageKey} srcImage={srcImage} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
