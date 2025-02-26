// This function is triggered by an HTTP request and uploads a file to Azure Blob Storage
const multipart = require("parse-multipart");
import { AzureFunction, Context, HttpRequest } from "@azure/functions";


const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');

    //const boundary = multipart.getBoundary(req.headers['content-type']);

    const bodyBuffer = Buffer.from(req.bufferBody);
   
    if (req.headers['content-type'].indexOf('multipart/form-data') === -1) {
        context.res = {status: 400, body: "Error: expecting content-type to be multipart/form-data"};
        return;
    }
    const boundary = multipart.getBoundary(req.headers['content-type']);
    //context.log('boundary: ' + boundary);
    //context.log('bodyBuffer: ' + bodyBuffer.slice(0, 1000).toString());  
    let parts = multipart.Parse(bodyBuffer, boundary);
    if (parts.length === 0) {
        context.res = {status: 400, body: "Error: no parts found in the multipart form data"};
        return;
    }
    context.bindings.OutputBlob = parts[0].data;
    context.bindings.myQueueItem = parts[0].filename;

        
    context.log('finished');
    context.res = {status: 200, body: "Success: file uploaded successfully"};

};

export default httpTrigger;