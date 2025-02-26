// constants.ts
const DEVMODE = process.env.NODE_ENV !== 'production';

export const CLEAR_QUEUE_URL = DEVMODE ? 'http://localhost:3000/api/clearQueue' : '/api/clearQueue';
export const GET_QUEUE_URL = DEVMODE ? 'http://localhost:3000/api/getQueue' : '/api/getQueue';
export const GET_IMAGE_URL = DEVMODE ? 'http://localhost:3000/api/getImages' : '/api/getImages';
export const UPLOAD_IMAGE_URL = DEVMODE ? 'http://localhost:3000/api/upload' : '/api/upload';

// export const CLEAR_QUEUE_URL = 'http://localhost:3000/api/clearQueue';
// export const GET_QUEUE_URL = 'http://localhost:3000/api/getQueue';
// export const GET_IMAGE_URL = 'http://localhost:3000/api/getImages';
// export const UPLOAD_IMAGE_URL = 'http://localhost:3000/api/upload';

export interface Image {
  Id: string;
  URL: string;
  Filename: string;
  Text_Caption: string;
}