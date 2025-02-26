import axios from 'axios';
import { CLEAR_QUEUE_URL, GET_QUEUE_URL, Image } from './constants';


let timerId: NodeJS.Timeout | null = null;

const QueueWatcher2 = (initialImages: Image[], onUpdate: (images: Image[]) => void) => {
  let images = [...initialImages];
  let isDirty = false;

  const computeUpdates = async (newImageData: Image[]) => {
    isDirty = false;

    const updatedImages = newImageData.map(image => {
      const oldImage = images.find(i => i.Filename === image.Filename);

      //console.log("Comparing old image: ", oldImage, " with new image: ", image);
      if (oldImage && JSON.stringify(oldImage) !== JSON.stringify(image)) {
        // compute IsDirty
        if (oldImage.Text_Caption !== image.Text_Caption || oldImage.URL !== image.URL) {
          //console.log("New Image is: ", JSON.stringify(image))
          
          isDirty = true;
          oldImage.Text_Caption = image.Text_Caption;
          oldImage.URL = image.URL;
          //console.log('Updating :  ', oldImage);
        }
        return oldImage;
      }
      return image;
    });

    if (isDirty) {
      images = updatedImages;
      onUpdate(updatedImages);

      // Clear the Queue
      await axios.get(CLEAR_QUEUE_URL);
    }
  };

  const checkQueue = async () => {
    // Fetch new messages from the queue
    const response = await axios.get(GET_QUEUE_URL);

    // The response data is an array of strings, where each string is a JSON representation of an Image object
    const temp = response.data as string[];

    // Create a new array to hold the parsed Image objects
    const newImageData: Image[] = []; // Use array literal notation

    // Parse each string into an Image object and add it to the newImageData array
    temp.forEach(element => {
      newImageData.push(JSON.parse(element) as Image); 
    });

    // Update the image state with the new images
    computeUpdates(newImageData);
  };

  // Clear the previous timer if it exists
  if (timerId) {
    console.log("Clearing previous timer");
    clearInterval(timerId);
  }

  console.log("Starting timer")
  // Start a new timer
  timerId = setInterval(checkQueue, 5 * 1000);
};

export default QueueWatcher2;