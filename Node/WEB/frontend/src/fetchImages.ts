import axios from 'axios';
import { GET_IMAGE_URL,  Image } from './constants';


async function fetchImages(): Promise<Image[]> {
  try {

    // Get the list of images from the server
      const response = await axios.get(GET_IMAGE_URL);
      //alert(JSON.stringify(response.data));
      return response.data;
  } catch (error) {
    console.error(error);
    const sampleData = [
      { Id: '1', URL: 'https://img.freepik.com/free-photo/girl-cat-mask-candle_23-2147694944.jpg', Filename: 'Cat Girl', Text_Caption: 'This is a cat'},
      { Id: '2', URL: 'https://img.freepik.com/free-photo/adorable-looking-kitten-with-sunglasses_23-2150886404.jpg', Filename: 'Cool Cat', Text_Caption: 'This is a cat'},
      { Id: '3', URL: 'https://img.freepik.com/free-photo/cute-furry-cat-relaxing-indoors_23-2150679174.jpg', Filename: 'Cat Walk', Text_Caption: 'This is a cat'},
      // Add more sample images as needed
    ];
    return sampleData;
  }
  
}

export default fetchImages;