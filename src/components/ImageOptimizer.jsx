import React, { useState, useRef } from 'react';
import imageCompression from 'browser-image-compression';

const ImageOptimizer = () => {
  const [image, setImage] = useState(null);
  const [compressedImage, setCompressedImage] = useState(null);
  const [settings, setSettings] = useState({
    width: 1240,
    height: 1240,
    quality: 80,
    type: 'image/jpeg',
    mode: 'scale',
  });
  const fileInputRef = useRef(null);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const options = {
          maxSizeMB: settings.quality / 100, 
          maxWidthOrHeight: settings.width,
          useWebWorker: true,
        };
        const compressedFile = await imageCompression(file, options);
        setImage(URL.createObjectURL(file)); // original img
        setCompressedImage(URL.createObjectURL(compressedFile)); // store compressed img
      } catch (error) {
        console.error('Error compressing image:', error);
      }
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setSettings((prevSettings) => ({
      ...prevSettings,
      [name]: value,
    }));
  };

  const handleReset = () => {
    setSettings({
      width: 1240,
      height: 1240,
      quality: 80,
      type: 'image/jpeg',
      mode: 'scale',
    });
    setImage(null);
    setCompressedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = null; // reset
    }
  };

  const handleSubmit = () => {
    console.log('Image submitted');
  };

  const handleDownload = () => {
    if (compressedImage) {
      const link = document.createElement('a');
      link.href = compressedImage;
      link.download = `optimized-image.${settings.type.split('/')[1]}`;
      link.click();
    }
  };

  return (
    <div>
      <h3>Settings</h3>
      <label>
        Width
        <input
          type="number"
          name="width"
          value={settings.width}
          onChange={handleChange}
        />
      </label>
      <label>
        Height
        <input
          type="number"
          name="height"
          value={settings.height}
          onChange={handleChange}
        />
      </label>
      <label>
        Quality
        <input
          type="number"
          name="quality"
          value={settings.quality}
          onChange={handleChange}
          step="1"
          min="0"
          max="100"
        />
      </label>
      <label>
        Type
        <select
          name="type"
          value={settings.type}
          onChange={handleChange}
        >
          <option value="image/jpeg">jpg</option>
          <option value="image/gif">gif</option>
          <option value="image/png">png</option>
        </select>
      </label>
      <label>
        Mode
        <select
          name="mode"
          value={settings.mode}
          onChange={handleChange}
        >
          <option value="scale">scale</option>
          <option value="crop">crop</option>
        </select>
      </label>
      <label>
        <h3>Component</h3>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          ref={fileInputRef}
        />
      </label>
      <button onClick={handleReset}>Reset</button>
      <button onClick={handleSubmit}>Submit</button>
      {compressedImage && (
        <>
          <button onClick={handleDownload}>Download</button>
          <div>
            <h3>Optimized Image:</h3>
            <img src={compressedImage} alt="Optimized" />
          </div>
        </>
      )}
    </div>
  );
};

export default ImageOptimizer;
