using System;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Host;
using Microsoft.Extensions.Logging;

namespace API2
{
    public class QueueProcessor
    {
        [FunctionName("QueueProcessor")]
        public void Run([QueueTrigger("myqueue-items", Connection = "")]string myQueueItem, ILogger log)
        {
            log.LogInformation($"C# Queue trigger function processed: {myQueueItem}");
        }
    }
}
