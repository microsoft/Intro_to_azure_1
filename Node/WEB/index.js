const fs = require("fs");
const path = require("path");
const express = require('express');
const multer = require("multer");
const concat = require("concat-stream")
const axios = require('axios');
const FormData = require('form-data');
const cors = require('cors');
//const { QueueServiceClient } = require("@azure/storage-queue");
const { DefaultAzureCredential } = require("@azure/identity");
const { QueueServiceClient, StorageSharedKeyCredential } = require("@azure/storage-queue");

const app = express();
const upload = multer({ dest: "uploads/" });
const port = process.env.PORT || 3000

let queue = []; // Initialize your queue
// Enable CORS for all routes
app.use(cors());

app.use('/', express.static('frontend/build'));

app.get('/api', (req, res) => {
  res.send('Hello, world! ' + process.env.secret1);
});

app.get('/api/getImages', (req, res) => {

  axios.get('https://bu2024519-api1.azurewebsites.net/api/getImages').then((response) => {
    res.send(response.data);
  })
  .catch((error) => { 
    console.error(error);
    res.status(500).send('An error occurred while fetching the images');
    return;
  });
});

app.get('/api/getQueue', (req, res) => { 
  res.send(JSON.stringify(queue));
});

app.get('/api/clearQueue', (req, res) => { 
  queue = [];
  res.send(JSON.stringify(queue));
});

app.post('/api/upload', upload.single("filename"), (req, res) => { 
  //res.send('File uploaded successfully : ' + JSON.stringify(req.file));
  //{"fieldname":"filename","originalname":"sample.png","encoding":"7bit","mimetype":"image/png",
  //"destination":"uploads/","filename":"ffdab9f516b2116bec76ea8f2d9cb33d","path":"uploads/ffdab9f516b2116bec76ea8f2d9cb33d","size":613849}

  // Use axios to upload the file to the Azure Function as in this curl:   curl -F 'file=@sample.png' http://localhost:7071/api/uploadFile/foo

  // read the file into a memory buffer and then upload it to the Azure Function
  fs.readFile(req.file.path, (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('An error occurred while reading the file');
      return;
    }
  
    const form = new FormData();
    form.append('filename', data, {filename: req.file.originalname, contentType: req.file.mimetype });
  
    axios.post('https://bu2024519-api1.azurewebsites.net/api/uploadFile/'+req.file.originalname, form, {
      headers: form.getHeaders()
    })
    .then(response => { res.send('{"message":"File uploaded successfully to the URL"}'); }  )
    .catch((error) => {
        console.error(error);
        res.status(500).send('An error occurred while uploading the file to the URL');
    });
  });
  
});



// Connect to Queue Storage using the Azure Default Credential
{
  let account = "nvmstoragequeue";
  let accountKey = "cuJzId+zHCYFGrux4yyoNEFuX/wXRZ1QueX9e1sxhtlGoQfRtCkL0Q2bbxz6WTOZxZSn5qKMTj2z+AStmlsZrg==";

  const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey);
  const queueServiceClient = new QueueServiceClient(`https://${account}.queue.core.windows.net`, sharedKeyCredential);


  //const queueServiceClient = 
  //new QueueServiceClient(`https://${account}.queue.core.windows.net`, new DefaultAzureCredential())
  
  const queueName = "processed";
  const queueClient = queueServiceClient.getQueueClient(queueName);
  
  // Function to check the contents of the queue
  function checkQueue() {
    //console.log('Checking queue:', queue);
    const response = queueClient.receiveMessages().then((response) => {
      if (response.receivedMessageItems.length > 0) {
        const message = response.receivedMessageItems[0];
        const messageText = Buffer.from(message.messageText, 'base64').toString('utf8');
        //console.log('New message:', messageText);
        queue.push(messageText);
        // delete the message after processing it
        queueClient.deleteMessage(message.messageId, message.popReceipt).then(() => {
          //console.log('Message deleted');
        });
      }
    });
  }   

  // Set a timer to check the queue every 5 seconds
  setInterval(checkQueue, 5000);
}

app.listen(port, () => {
  console.log('Server listening on port '+ port);
});
