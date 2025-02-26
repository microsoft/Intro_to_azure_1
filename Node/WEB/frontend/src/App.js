import React, { useEffect, useState } from 'react';
import './App.css';
import ImageTable from './ImageTable';
import ImageUpload from './ImageUpload';
import fetchImages from './fetchImages';
import Header from './Header';
import QueueWatcher2 from './QueueWatcher2'; // Import QueueWatcher
import { UPLOAD_IMAGE_URL } from './constants';


function generateGUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c === 'x' ? r : ((r & 0x3) | 0x8);
    return v.toString(16);
  });
}

function App() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetchImages().then(fetchedImages => {
      console.log("fetchedImages", fetchedImages );
      setImages([...fetchedImages]);
    });
  }, []);

  const uploadImage = (image) => {

    // create a new FormData instance
    const formData = new FormData();

    // append the image file to the form data
    formData.append('filename', image);

    // send a POST request with the form data
    fetch(UPLOAD_IMAGE_URL, {
      method: 'POST',
      body: formData,
    })
    .then(response => response.json())
    .then(data => {
      // handle the response data
      console.log(data);

      // append a new image to the images array
      setImages(prevImages => [
        ...prevImages,
        {
          id: generateGUID(),
          Filename: image.name,
          Text_Caption: 'Uploading...',
          info: `Size: ${image.size} bytes, Type: ${image.type}`,
          URL: "https://nvmstoragequeue.blob.core.windows.net/images/uploading.gif"
        },
      ]);
    })
    .catch(error => {
      // handle the error
      console.error(error);
    });        
  }
  
  const handleUpdate = (updatedImages) => {
    console.log('Images updated:', updatedImages);

    // merge changes in updatedImages into images: 
    // make a copy of the images object
    const imagesCopy = [...images];
    // for each updated image, override imagesCopy with the updated image
    updatedImages.forEach(updatedImage => {
      const index = imagesCopy.findIndex(image => image.id === updatedImage.id);
      imagesCopy[index] = updatedImage;
    });
    // set the images state to the updated imagesCopy
    setImages(imagesCopy);

  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect( ()=> {
    QueueWatcher2(images, handleUpdate);
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [images]);

  return (
    <div>
      <div className="App-header">
          <Header />
          <ImageUpload onUpload={uploadImage} />
      </div>
      <ImageTable images={images} />

    </div>
  );
}

export default App;
