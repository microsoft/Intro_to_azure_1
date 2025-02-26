import { AzureFunction, Context, HttpRequest } from "@azure/functions"

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest, imageItem): Promise<void> {
    context.log('HTTP trigger function processed a request.');

    
    // look through imageItem array  and create a new array with ID, Size, Dimensions, URL Link to thumbnail, URL to downsized image, URL to original image, Text Caption, List of entities found
    // sample:   {"Id": "1","name": "foo", "Filename": "sample.png","Size": "23456","Dimensions": "200x200","thumbnailURL": "http://www.ibm.com","downsizedURL": "http://www.ibm.com", "URL": "http://www.ibm.com","Text_Caption": "A dog walking","Entities": "dog"}
    
    // Create a new array to hold the new objects
    let newImageArray: {
        Id: any;
        Filename: any;
        Size: any;
        Dimensions: any;
        thumbnailURL: any;
        downsizedURL: any;
        URL: any;
        Text_Caption: any;
        Entities: any;
    }[] = [];
    
    // Loop through the imageItem array
    for (let i = 0; i < imageItem.length; i++) {
        // Create a new object
        let newImage = {
            "Id": imageItem[i].Id,
            "Filename": imageItem[i].Filename,
            "Size": imageItem[i].size,
            "Dimensions": imageItem[i].dimensions,
            "thumbnailURL": imageItem[i].thumbnailURL,
            "downsizedURL": imageItem[i].downsizedURL,
            "URL": imageItem[i].URL,
            "Text_Caption": imageItem[i].Text_Caption,
            "Entities": imageItem[i].Entities
        };
        // Add the new object to the newImageArray
        newImageArray.push(newImage);
    }
    context.log('toDoItem: ', JSON.stringify(newImageArray));
    
    context.res = {
        // status: 200, /* Defaults to 200 */
        body: JSON.stringify(newImageArray)
    };

};

export default httpTrigger;