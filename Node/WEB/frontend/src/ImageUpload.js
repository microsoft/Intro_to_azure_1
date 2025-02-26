import React, { useState } from 'react';

function ImageUpload({ onUpload }) {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  const handleUpload = (event) => {
    event.preventDefault();
    onUpload(selectedImage);
    //setSelectedImage(null);
  };

  return (
    <div class="upload">
      <input type="file" onChange={handleImageChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}

export default ImageUpload;