import React, { useState, useRef, useEffect } from 'react';

export default function DiamondHandsOverlay() {
  const [userImage, setUserImage] = useState(null);
  const [originalImageUrl, setOriginalImageUrl] = useState(null);
  const [imageWithoutBackground, setImageWithoutBackground] = useState(null);
  const [blendedImages, setBlendedImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [credits, setCredits] = useState(null);
  const [backgroundColor, setBackgroundColor] = useState({ r: 255, g: 255, b: 255 }); // Default to white
  const canvasRef = useRef(null);
  const overlayTransparentImageUrl = 'https://res.cloudinary.com/dro7c1ps1/image/upload/v1731935182/pkl3j5unhavhpzrhazbh.png';

  useEffect(() => {
    checkCredits();
  }, [userImage, blendedImages]);

  useEffect(() => {
    if (selectedImage) {
      drawImageOnCanvas(selectedImage);
    }
  }, [selectedImage]);

  const checkCredits = async () => {
    try {
      const response = await fetch('/api/checkCredits');
      const data = await response.json();
      setCredits(data.credits);
    } catch (error) {
      console.error("Error fetching account info:", error);
    }
  };

  const handleImageUpload = (event) => {
    setBlendedImages([]);
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserImage(reader.result);
        drawImageOnCanvas(reader.result);
        uploadOriginalImageToCloudinary(file);
      };
      reader.readAsDataURL(file);
    } else {
      alert("No file selected.");
      setUserImage(null);
    }
  };

  const drawImageOnCanvas = (imageSrc) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageSrc;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
      ctx.drawImage(img, 0, 0);
    };
  };

  const handleCanvasClick = (event) => {
    if (!userImage) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const pixel = ctx.getImageData(x, y, 1, 1).data;
    setBackgroundColor({ r: pixel[0], g: pixel[1], b: pixel[2] });

    // Highlight the selected color on the canvas
    ctx.fillStyle = `rgba(${pixel[0]}, ${pixel[1]}, ${pixel[2]}, 0.5)`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(new Image(), 0, 0); // Redraw the image to keep it visible
  };

  const removeBackground = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    const { r, g, b } = backgroundColor;
    const threshold = 30; // Adjusted tolerance level for better accuracy

    for (let i = 0; i < data.length; i += 4) {
      const red = data[i];
      const green = data[i + 1];
      const blue = data[i + 2];

      if (Math.abs(red - r) < threshold && Math.abs(green - g) < threshold && Math.abs(blue - b) < threshold) {
        data[i + 3] = 0; // Set alpha to 0 (transparent)
      }
    }

    ctx.putImageData(imageData, 0, 0);
    setImageWithoutBackground(canvas.toDataURL());
  };

  const uploadOriginalImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/uploadImage', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setOriginalImageUrl(data.secure_url); // Store Cloudinary URL for the original image
    } catch (error) {
      console.error("Error uploading original image to Cloudinary:", error);
      alert("An error occurred while uploading the original image.");
    }
  };

  const uploadTransparentImageToCloudinary = async (blob) => {
    const formData = new FormData();
    formData.append('file', blob, 'transparent.png');

    try {
      const response = await fetch('/api/uploadImage', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Error uploading transparent image to Cloudinary:", error);
      alert("An error occurred while uploading the transparent image.");
      return null;
    }
  };

  const blendImages = async () => {
    if (!originalImageUrl) {
      alert("Please upload an image.");
      return;
    }

    if (credits === 0) {
      alert("No credits left. Please contact @jongan59.");
      return;
    }

    setIsLoading(true);

    // Remove background and upload transparent image
    removeBackground();
    const canvas = canvasRef.current;
    canvas.toBlob(async (blob) => {
      if (blob) {
        const transparentImageUrl = await uploadTransparentImageToCloudinary(blob);
        if (!transparentImageUrl) {
          setIsLoading(false);
          return;
        }

        try {
          const response = await fetch('/api/aiimageblend', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userImageUrl: originalImageUrl, // Use Cloudinary URL for the original image
              transparentImageUrl,
              overlayImageUrl: overlayTransparentImageUrl,
            }),
          });

          const data = await response.json();
          if (data.image_urls) {
            setBlendedImages(data.image_urls);
            setSelectedImage(data.image_urls[0]); // Default to the first image
          } else {
            alert("Failed to blend images.");
          }
        } catch (error) {
          console.error("Error blending images:", error);
          alert("An error occurred while blending images.");
        } finally {
          setIsLoading(false);
        }
      }
    }, 'image/png');
  };

  const selectImage = (url) => {
    setSelectedImage(url);
  };

  const downloadImage = () => {
    if (!selectedImage) {
      alert("No image selected for download.");
      return;
    }
    const link = document.createElement('a');
    link.href = selectedImage;
    link.download = 'diamond_hands_image.png';
    link.click();
  };

  return (
    <div className="diamond-hands-overlay" style={styles.container}>
      <p>AI Credits Left: {credits !== null ? credits : 'Loading...'}</p>
      <input type="file" accept="image/*" onChange={handleImageUpload} style={styles.input} />

      <canvas ref={canvasRef} style={styles.canvas} onClick={handleCanvasClick} />
      {userImage && <div style={styles.colorDisplay}>
        <p>Select a background color by clicking on the image:</p>
        <div style={{
          ...styles.colorBox,
          backgroundColor: `rgb(${backgroundColor.r}, ${backgroundColor.g}, ${backgroundColor.b})`
        }} />
      </div>}
      {userImage && <button onClick={blendImages} style={styles.button} disabled={isLoading}>
        {isLoading ? 'Blending...' : 'Blend with Overlay'}
      </button>}
      {blendedImages.length > 0 && (
        <div className="image-container" style={styles.imageContainer}>
          <button onClick={downloadImage} style={styles.button}>Download Selected Image</button>
          <div style={styles.blendedImagesContainer}>
            {blendedImages.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Blended ${index + 1}`}
                style={{
                  ...styles.blendedImage,
                  border: selectedImage === url ? '2px solid #4CAF50' : 'none',
                }}
                onClick={() => selectImage(url)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '1rem',
    maxWidth: '100%',
  },
  input: {
    marginBottom: '1rem',
    width: '100%',
    maxWidth: '300px',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    maxWidth: '500px',
  },
  canvas: {
    width: '100%',
    height: 'auto',
    cursor: 'crosshair',
  },
  button: {
    marginTop: '1rem',
    padding: '0.5rem 1rem',
    fontSize: '1rem',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  blendedImagesContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: '1rem',
    flexWrap: 'wrap',
    padding: '1rem',
  },
  blendedImage: {
    width: '100px',
    height: '100px',
    margin: '0 5px',
    objectFit: 'cover',
    cursor: 'pointer',
    padding: '10px',
  },
  colorDisplay: {
    marginTop: '1rem',
    textAlign: 'center',
  },
  colorBox: {
    width: '50px',
    height: '50px',
    border: '1px solid #000',
    display: 'inline-block',
    marginTop: '0.5rem',
  },
}; 