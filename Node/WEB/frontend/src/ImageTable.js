import React from 'react';
import './image.css'; // Import the CSS file

function ImageTable({ images }) {
  return (
      <div class="imageContainer">
        {images.map((image, index) => (
            <div class="imageBox" key={index}>
              <img class="image"  src={image.URL} alt={image.Filename} />
              <p class="imageName">{image.Filename}</p>
              <p class="imageInfo">{image.Text_Caption}</p>
            </div>
        ))}
      </div>
  );
}

export default ImageTable;