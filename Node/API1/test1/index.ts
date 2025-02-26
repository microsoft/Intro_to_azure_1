import { AzureFunction, Context, HttpRequest } from "@azure/functions"

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');
    context.log('The value of the KV Secret is: ' + process.env.secret2);
    context.bindings.myQueueItem = "this is a test";
       
    const responseMessage = "Successfully added to the queue";

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: responseMessage
    };

};

export default httpTrigger;
