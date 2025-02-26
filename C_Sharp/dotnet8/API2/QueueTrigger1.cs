using System;
using Azure.Storage.Queues.Models;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

namespace API2
{
    public class QueueTrigger1
    {
        private readonly ILogger<QueueTrigger1> _logger;

        public QueueTrigger1(ILogger<QueueTrigger1> logger)
        {
            _logger = logger;
        }

        [Function(nameof(QueueTrigger1))]
        public void Run([QueueTrigger("myqueue-items", Connection = "")] QueueMessage message)
        {
            _logger.LogInformation($"C# Queue trigger function processed: {message.MessageText}");
        }
    }
}
