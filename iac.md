# Deploy an Azure Function with Infrastructure as Code (IaC)

## Introduction

Welcome! This guide will walk you through deploying an Azure Function using **Infrastructure as Code (IaC)** with **Bicep**. You'll learn how to automate the deployment of various Azure resources, embracing DevOps practices by treating infrastructure configurations as code.

By the end of this guide, you'll understand how to:

- Set up a Bicep file to automate the deployment of Azure resources.
- Deploy an Azure Function along with other essential services.
- Utilize Managed Identity for secure authentication.
- Understand and implement services like Azure Storage Account, Azure Cosmos DB, Azure Storage Queue, and Azure Cognitive Services.

This guide is tailored for engineers new to Azure but is beneficial for all experience levels.

---

## Table of Contents

- [Introduction](#introduction)
- [Understanding Infrastructure as Code (IaC)](#understanding-infrastructure-as-code-iac)
- [Prerequisites](#prerequisites)
- [Azure Services We'll Deploy](#azure-services-well-deploy)
- [Setting Up Your Environment](#setting-up-your-environment)
- [Writing the Bicep File](#writing-the-bicep-file)
  - [1. Define Parameters](#1-define-parameters)
  - [2. Azure Storage Account](#2-azure-storage-account)
  - [3. Azure Cosmos DB](#3-azure-cosmos-db)
  - [4. Azure Storage Queue](#4-azure-storage-queue)
  - [5. Azure Cognitive Services - Computer Vision API](#5-azure-cognitive-services---computer-vision-api)
  - [6. Azure Function App with Managed Identity](#6-azure-function-app-with-managed-identity)
- [Deploying the Bicep File](#deploying-the-bicep-file)
- [Testing Your Deployment](#testing-your-deployment)
- [References](#references)
- [Conclusion](#conclusion)

---

## Understanding Infrastructure as Code (IaC)

**Infrastructure as Code (IaC)** is the practice of provisioning and managing cloud resources by describing them in code templates, rather than configuring them manually through a GUI. IaC brings the principles of software development to infrastructure management, allowing for version control, code review, and continuous deployment.

**Benefits of IaC:**

- **Consistency:** Ensures that the same environment is deployed every time.
- **Automation:** Reduces manual errors and speeds up deployment times.
- **Version Control:** Infrastructure changes can be tracked and rolled back if necessary.
- **Collaboration:** Enables teams to work together on infrastructure configurations.

---

## Prerequisites

Before you begin, make sure you have the following:

- **Azure Account:** If you don't have one, sign up for a free account [here](https://azure.microsoft.com/free/).
- **Azure CLI:** Install from [here](https://learn.microsoft.com/cli/azure/install-azure-cli).
- **Bicep CLI:** Install from [here](https://learn.microsoft.com/azure/azure-resource-manager/bicep/install).
- **Visual Studio Code (VS Code):** Download from [here](https://code.visualstudio.com/).
  - **Bicep Extension for VS Code:** Install from the VS Code Marketplace [here](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-bicep).
- **.NET 8 SDK:** Install from [here](https://dotnet.microsoft.com/download/dotnet/8.0).
- **Azure Functions Core Tools:** Install from [here](https://learn.microsoft.com/azure/azure-functions/functions-run-local).

---

## Azure Services We'll Deploy

### 1. Azure Storage Account

- **Purpose:** Store images and static files securely.
- **Storage Types:**
  - **Blob Storage:** For storing unstructured data like images and videos.
  - **Queue Storage:** For message queuing between services.
  - **Table Storage:** For NoSQL key-value storage.
  - **File Storage:** For managed file shares.

### 2. Azure Cosmos DB

- **Purpose:** Utilize a globally distributed, multi-model database.
- **Features:**
  - High availability and low latency.
  - Supports multiple data models (SQL, MongoDB, Cassandra, Gremlin, Table API).

### 3. Azure Storage Queue

- **Purpose:** Implement asynchronous message queuing between application components.
- **Benefits:**
  - Decouples application components.
  - Enhances scalability and resilience.

### 4. Azure Cognitive Services - Computer Vision API

- **Purpose:** Integrate AI capabilities to analyze and process images.
- **Features:**
  - Image recognition.
  - Tag and description generation for images.

### 5. Managed Identity

- **Purpose:** Securely connect Azure services without hardcoding credentials.
- **Benefits:**
  - Simplifies authentication across resources using Azure Active Directory (AD).
  - Enhances security by eliminating the need for secrets in code.

---

## Setting Up Your Environment

### Step 1: Log in to Azure

Open your terminal and log in:

```
az login
```

### Step 2: Set Your Subscription (If Applicable)

If you have multiple subscriptions:

```
az account set --subscription "Your Subscription Name"
```

### Step 3: Create a Resource Group

A resource group is a container for your Azure resources.

```
az group create --name MyResourceGroup --location eastus
```

---

## Writing the Bicep File

We'll create a Bicep file named `main.bicep` that describes the infrastructure.

### 1. Define Parameters

At the top of your `main.bicep`, define parameters for customizable properties.

```
param location string = resourceGroup().location
param storageAccountName string = 'mystorageaccount${uniqueString(resourceGroup().id)}'
param functionAppName string = 'myfunctionapp${uniqueString(resourceGroup().id)}'
param cognitiveServiceName string = 'mycognitiveservice${uniqueString(resourceGroup().id)}'
param cosmosDbAccountName string = 'mycosmosdb${uniqueString(resourceGroup().id)}'
```

### 2. Azure Storage Account

Define the storage account resource.

```
resource storageAccount 'Microsoft.Storage/storageAccounts@2022-09-01' = {
  name: storageAccountName
  location: location
  kind: 'StorageV2'
  sku: {
    name: 'Standard_LRS'
  }
}
```

### 3. Azure Cosmos DB

Define the Cosmos DB account.

```
resource cosmosDbAccount 'Microsoft.DocumentDB/databaseAccounts@2021-04-15' = {
  name: cosmosDbAccountName
  location: location
  kind: 'GlobalDocumentDB'
  properties: {
    databaseAccountOfferType: 'Standard'
    locations: [
      {
        locationName: location
        failoverPriority: 0
      }
    ]
  }
}
```

### 4. Azure Storage Queue

Queues are part of the storage account. Define a queue.

```
resource storageQueue 'Microsoft.Storage/storageAccounts/queueServices/queues@2021-09-01' = {
  name: '${storageAccount.name}/default/myqueue'
}
```

### 5. Azure Cognitive Services - Computer Vision API

Define the cognitive service resource.

```
resource cognitiveService 'Microsoft.CognitiveServices/accounts@2021-10-01' = {
  name: cognitiveServiceName
  location: location
  kind: 'ComputerVision'
  sku: {
    name: 'S1'
  }
  properties: {
    apiProperties: {
      qnaRuntimeEndpoint: 'https://${cognitiveServiceName}.cognitiveservices.azure.com/'
    }
  }
}
```

### 6. Azure Function App with Managed Identity

Define the Function App and enable Managed Identity.

```
resource functionApp 'Microsoft.Web/sites@2022-03-01' = {
  name: functionAppName
  location: location
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    serverFarmId: functionPlan.id
    siteConfig: {
      appSettings: [
        {
          name: 'AzureWebJobsStorage'
          value: storageAccount.properties.primaryEndpoints.blob
        }
        {
          name: 'FUNCTIONS_WORKER_RUNTIME'
          value: 'dotnet-isolated'
        }
        {
          name: 'CognitiveServicesKey'
          value: cognitiveService.listKeys().key1
        }
        {
          name: 'CosmosDBConnectionString'
          value: cosmosDbAccount.properties.connectionStrings[0].connectionString
        }
      ]
    }
  }
  dependsOn: [
    cognitiveService
    storageAccount
    cosmosDbAccount
    functionPlan
  ]
}

resource functionPlan 'Microsoft.Web/serverfarms@2022-03-01' = {
  name: '${functionAppName}-plan'
  location: location
  sku: {
    name: 'Y1'
    tier: 'Dynamic'
  }
  kind: 'functionapp'
}
```

---

## Deploying the Bicep File

### Step 1: Compile the Bicep File (Optional)

To view the ARM JSON template generated by Bicep:

```
bicep build main.bicep
```

This generates `main.json`.

### Step 2: Deploy Using Azure CLI

Deploy the Bicep file to your resource group.

```
az deployment group create --resource-group MyResourceGroup --template-file main.bicep
```

**Note:** If you have parameters in your Bicep file that need values, you can pass them using `--parameters` or create a `parameters.json` file.

### Step 3: Verify the Deployment

Check the resources in the resource group.

```
az resource list --resource-group MyResourceGroup -o table
```

---

## Testing Your Deployment

### Access the Function App

Retrieve the Function App's default hostname.

```
az functionapp show --name $functionAppName --resource-group MyResourceGroup --query defaultHostName -o tsv
```

Visit `https://<YourFunctionAppName>.azurewebsites.net` in your browser.

### Check Managed Identity

Ensure that the Function App's Managed Identity has the necessary permissions to access other resources.

---

## References

- **Bicep Documentation:** [Microsoft Docs](https://learn.microsoft.com/azure/azure-resource-manager/bicep/)
- **Azure Functions Documentation:** [Azure Functions](https://learn.microsoft.com/azure/azure-functions/)
- **Azure Storage Account:** [Storage Account Overview](https://learn.microsoft.com/azure/storage/common/storage-account-overview)
- **Azure Cosmos DB:** [Cosmos DB Overview](https://learn.microsoft.com/azure/cosmos-db/introduction)
- **Azure Storage Queues:** [Queue Storage](https://learn.microsoft.com/azure/storage/queues/storage-queues-introduction)
- **Azure Cognitive Services:** [Computer Vision API](https://learn.microsoft.com/azure/cognitive-services/computer-vision/overview)
- **Managed Identities:** [Managed Identity Documentation](https://learn.microsoft.com/azure/active-directory/managed-identities-azure-resources/overview)

---

## Conclusion

Congratulations! You've successfully deployed an Azure Function along with several essential services using Infrastructure as Code with Bicep. By automating your deployments, you embrace DevOps practices that enhance consistency, scalability, and collaboration within your team.

Remember to:

- Explore further customization of your Bicep templates.
- Integrate your IaC pipelines with CI/CD tools like Azure DevOps or GitHub Actions.
- Keep your infrastructure code version-controlled for easy tracking and rollback.

Happy coding!

