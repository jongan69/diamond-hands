import React, { useState, useRef, useEffect } from 'react';

export default function DiamondHandsOverlay() {
  const [image, setImage] = useState(null);
  const canvasRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (image) {
      drawImageWithOverlay(image);
    }
  }, [image]);

  const drawImageWithOverlay = (imageSrc) => {
    const canvas = canvasRef.current;
    if (!canvas) return; // Ensure canvas is available
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const overlay = new Image();
      overlay.src = '/overlay.png'; // Path to your overlay image
      overlay.onload = () => {
        ctx.drawImage(overlay, 0, 0, img.width, img.height);
      };
    };
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return; // Ensure canvas is available
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'diamond_hands_image.png';
    link.click();
  };

  return (
    <div className="diamond-hands-overlay">
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {image && (
        <div className="image-container">
          <canvas ref={canvasRef} style={{ width: '100%' }} />
          <button onClick={downloadImage}>Download Image</button>
        </div>
      )}
    </div>
  );
} 