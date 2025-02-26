# Set Up Infrastructure as Code (IaC) Pipelines with Azure Bicep

## Introduction

Welcome! This guide will help you automate the deployment of Azure resources using **Infrastructure as Code (IaC)** with **Azure Bicep**. By treating your infrastructure configurations as code, you embrace DevOps practices that enhance collaboration, efficiency, and reproducibility.

This tutorial is designed for engineers who are new to Azure and aims to explain concepts in a clear and approachable manner for all experience levels.

---

## Table of Contents

- [Introduction](#introduction)
- [Understanding Infrastructure as Code (IaC)](#understanding-infrastructure-as-code-iac)
- [Prerequisites](#prerequisites)
- [Overview of Azure Services](#overview-of-azure-services)
- [Architecture Overview](#architecture-overview)
- [Setting Up the Environment](#setting-up-the-environment)
- [Building the Bicep File](#building-the-bicep-file)
  - [1. Define Parameters](#1-define-parameters)
  - [2. Deploy Azure Storage Account with Blob Container](#2-deploy-azure-storage-account-with-blob-container)
  - [3. Deploy Azure Cosmos DB](#3-deploy-azure-cosmos-db)
  - [4. Deploy Azure Storage Queue](#4-deploy-azure-storage-queue)
  - [5. Deploy Azure Cognitive Services - Computer Vision API](#5-deploy-azure-cognitive-services---computer-vision-api)
  - [6. Set Up Managed Identity](#6-set-up-managed-identity)
- [Deploying the Bicep File](#deploying-the-bicep-file)
- [Setting Up Managed Identity (Client and Server Side)](#setting-up-managed-identity-client-and-server-side)
  - [Client Side Configuration](#client-side-configuration)
  - [Server Side Configuration](#server-side-configuration)
- [How the Components Interact](#how-the-components-interact)
- [Customization](#customization)
- [References](#references)
- [Conclusion](#conclusion)

---

## Understanding Infrastructure as Code (IaC)

**Infrastructure as Code (IaC)** is the practice of managing and provisioning infrastructure through code instead of manual processes. This allows you to automate deployments, ensure consistency across environments, and version control your infrastructure similarly to application code.

**Benefits of IaC:**

- **Automation**: Streamline the provisioning of resources.
- **Consistency**: Ensure environments are identical, reducing configuration drift.
- **Collaboration**: Use version control systems to work with your team.
- **Scalability**: Easily scale resources up or down.

---

## Prerequisites

Before you begin, make sure you have the following:

- **Azure Account**: Sign up for a free account [here](https://azure.microsoft.com/free/).
- **Azure CLI**: Install from [here](https://learn.microsoft.com/cli/azure/install-azure-cli).
- **Bicep CLI**: Install from [here](https://learn.microsoft.com/azure/azure-resource-manager/bicep/install).
- **Visual Studio Code (VS Code)**: Download from [here](https://code.visualstudio.com/).
  - **Bicep Extension for VS Code**: Install from the VS Code Marketplace [here](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-bicep).
- **.NET SDK**: Install from [here](https://dotnet.microsoft.com/download).
- **Azure Functions Core Tools**: Install from [here](https://learn.microsoft.com/azure/azure-functions/functions-run-local).

---

## Overview of Azure Services

### Azure Storage Account

- **Purpose**: Store images and static files securely.
- **Components**:
  - **Blob Container**: Used for storing unstructured data like images.

### Azure Cosmos DB

- **Purpose**: Utilize a globally distributed, multi-model database.
- **Benefits**:
  - High availability and low latency.
  - Supports multiple data models.

### Azure Storage Queue

- **Purpose**: Implement asynchronous message queuing between application components.
- **Benefits**:
  - Decouples application components.
  - Enhances scalability and resilience.

### Azure Cognitive Services - Computer Vision API

- **Purpose**: Integrate AI capabilities to analyze and process images.
- **Features**:
  - Automatically generate tags and descriptions for uploaded photos.

### Managed Identity

- **Purpose**: Securely connect Azure services without hardcoding credentials.
- **Benefits**:
  - Simplifies authentication using Azure Active Directory (AD).
  - Eliminates the need to manage secrets.

---

## Architecture Overview

Here's how the components interact:

1. **Web Application** calls **API1**.
2. **API1**:
   - Inserts messages into the **Azure Storage Queue**.
   - Uploads images to the **Blob Storage**.
3. **API2**:
   - Listens to the **Azure Storage Queue**.
   - Processes images using **Azure Cognitive Services - Computer Vision API**.
   - Stores results in **Azure Cosmos DB** and **Blob Storage**.

---

## Setting Up the Environment

### Step 1: Log in to Azure

```
az login
```

### Step 2: Set Your Subscription (If Applicable)

If you have multiple subscriptions:

```
az account set --subscription "Your Subscription Name"
```

### Step 3: Create a Resource Group

```
az group create --name MyResourceGroup --location eastus
```

---

## Building the Bicep File

We'll create a Bicep file named `main.bicep`. This is a starter template, and you will need to customize it according to your requirements.

### 1. Define Parameters

```
param location string = resourceGroup().location
param storageAccountName string = 'storage${uniqueString(resourceGroup().id)}'
param functionApp1Name string = 'functionapp1${uniqueString(resourceGroup().id)}'
param functionApp2Name string = 'functionapp2${uniqueString(resourceGroup().id)}'
param cognitiveServiceName string = 'cognitivesvc${uniqueString(resourceGroup().id)}'
param cosmosDbAccountName string = 'cosmosdb${uniqueString(resourceGroup().id)}'
```

### 2. Deploy Azure Storage Account with Blob Container

#### Storage Account

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

#### Blob Container

```
resource blobContainer 'Microsoft.Storage/storageAccounts/blobServices/containers@2021-09-01' = {
  name: '${storageAccount.name}/default/images'
  properties: {
    publicAccess: 'Blob'
  }
}
```

### 3. Deploy Azure Cosmos DB

```
resource cosmosDbAccount 'Microsoft.DocumentDB/databaseAccounts@2021-07-01-preview' = {
  name: cosmosDbAccountName
  location: location
  kind: 'GlobalDocumentDB'
  properties: {
    databaseAccountOfferType: 'Standard'
    locations: [
      {
        locationName: location
        failoverPriority: 0
        isZoneRedundant: false
      }
    ]
  }
}
```

### 4. Deploy Azure Storage Queue

```
resource storageQueue 'Microsoft.Storage/storageAccounts/queueServices/queues@2021-09-01' = {
  name: '${storageAccount.name}/default/myqueue'
}
```

### 5. Deploy Azure Cognitive Services - Computer Vision API

```
resource cognitiveService 'Microsoft.CognitiveServices/accounts@2021-10-01' = {
  name: cognitiveServiceName
  location: location
  kind: 'ComputerVision'
  sku: {
    name: 'S1'
  }
  properties: {}
}
```

### 6. Set Up Managed Identity

#### Function App Plan

```
resource functionAppPlan 'Microsoft.Web/serverfarms@2022-03-01' = {
  name: 'functionAppPlan${uniqueString(resourceGroup().id)}'
  location: location
  sku: {
    name: 'Y1'
    tier: 'Dynamic'
  }
  kind: 'functionapp'
}
```

#### Function App 1 (API1) with Managed Identity

```
resource functionApp1 'Microsoft.Web/sites@2022-03-01' = {
  name: functionApp1Name
  location: location
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    serverFarmId: functionAppPlan.id
    siteConfig: {
      appSettings: [
        {
          name: 'AzureWebJobsStorage'
          value: storageAccount.properties.primaryEndpoints.blob
        },
        {
          name: 'FUNCTIONS_WORKER_RUNTIME'
          value: 'dotnet-isolated'
        }
      ]
    }
  }
}
```

#### Function App 2 (API2) with Managed Identity

```
resource functionApp2 'Microsoft.Web/sites@2022-03-01' = {
  name: functionApp2Name
  location: location
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    serverFarmId: functionAppPlan.id
    siteConfig: {
      appSettings: [
        {
          name: 'AzureWebJobsStorage'
          value: storageAccount.properties.primaryEndpoints.blob
        },
        {
          name: 'FUNCTIONS_WORKER_RUNTIME'
          value: 'dotnet-isolated'
        }
      ]
    }
  }
}
```

---

## Deploying the Bicep File

### Step 1: Save Your Bicep File

Ensure your `main.bicep` file includes all the resources and is saved.

### Step 2: Deploy Using Azure CLI

```
az deployment group create \
  --resource-group MyResourceGroup \
  --template-file main.bicep
```

---

## Setting Up Managed Identity (Client and Server Side)

### Client Side Configuration

#### Assign Role to Function Apps

Grant necessary permissions to the Managed Identity of **API1** and **API2**.

**For API1:**

```
# Get the Principal ID of API1
$api1PrincipalId = az functionapp identity show \
  --name $functionApp1Name \
  --resource-group MyResourceGroup \
  --query principalId -o tsv

# Assign Storage Blob Data Contributor role for Blob Storage
az role assignment create \
  --assignee-object-id $api1PrincipalId \
  --role "Storage Blob Data Contributor" \
  --scope $(az storage account show --name $storageAccountName --resource-group MyResourceGroup --query id -o tsv)

# Assign Storage Queue Data Contributor role for Storage Queue
az role assignment create \
  --assignee-object-id $api1PrincipalId \
  --role "Storage Queue Data Contributor" \
  --scope $(az storage account show --name $storageAccountName --resource-group MyResourceGroup --query id -o tsv)
```

**For API2:**

```
# Get the Principal ID of API2
$api2PrincipalId = az functionapp identity show \
  --name $functionApp2Name \
  --resource-group MyResourceGroup \
  --query principalId -o tsv

# Assign Storage Queue Data Reader role for Storage Queue
az role assignment create \
  --assignee-object-id $api2PrincipalId \
  --role "Storage Queue Data Reader" \
  --scope $(az storage account show --name $storageAccountName --resource-group MyResourceGroup --query id -o tsv)

# Assign Cosmos DB Account Reader Role
az role assignment create \
  --assignee-object-id $api2PrincipalId \
  --role "Cosmos DB Account Reader Role" \
  --scope $(az cosmosdb show --name $cosmosDbAccountName --resource-group MyResourceGroup --query id -o tsv)
```

### Server Side Configuration

In your Function App code, leverage the Managed Identity to authenticate with Azure services.

**Example in C#:**

```
using Azure.Identity;
using Azure.Storage.Blobs;
using Azure.Storage.Queues;

public void ExampleFunction()
{
    var credential = new DefaultAzureCredential();

    // Access Blob Storage
    var blobServiceClient = new BlobServiceClient(new Uri("https://{storageAccountName}.blob.core.windows.net"), credential);

    // Access Storage Queue
    var queueClient = new QueueClient(new Uri("https://{storageAccountName}.queue.core.windows.net/myqueue"), credential);

    // Access Cosmos DB
    var cosmosClient = new CosmosClient("{cosmosDbEndpoint}", credential);
}
```

---

## How the Components Interact

- **Web Application** sends requests to **API1**.
- **API1**:
  - Uploads images to **Blob Storage** using Managed Identity.
  - Sends messages to **Storage Queue**.
- **API2**:
  - Listens to **Storage Queue** for new messages.
  - Retrieves images from **Blob Storage**.
  - Processes images using **Cognitive Services - Computer Vision API**.
  - Stores metadata and results in **Cosmos DB**.
  - May store additional processed images back into **Blob Storage**.

---

## Customization

This Bicep template is a starter and will need to be customized:

- **Resource Names**: Update names to fit your naming conventions.
- **Locations**: Change the `location` parameter if deploying to a different region.
- **Access Policies**: Modify role assignments based on your security requirements.
- **App Settings**: Add any additional application settings required by your Function Apps.
- **Additional Resources**: Add resources like Azure Key Vault if needed.

---

## References

- **Azure Bicep Documentation**: [Learn Bicep](https://learn.microsoft.com/azure/azure-resource-manager/bicep/)
- **Azure Functions Documentation**: [Azure Functions](https://learn.microsoft.com/azure/azure-functions/)
- **Managed Identities**: [Managed Identities for Azure Resources](https://learn.microsoft.com/azure/active-directory/managed-identities-azure-resources/overview)
- **Azure Storage**: [Azure Storage Documentation](https://learn.microsoft.com/azure/storage/)
- **Azure Cosmos DB**: [Azure Cosmos DB Documentation](https://learn.microsoft.com/azure/cosmos-db/)
- **Azure Cognitive Services**: [Computer Vision API Documentation](https://learn.microsoft.com/azure/cognitive-services/computer-vision/)
- **Azure CLI Documentation**: [Azure CLI Reference](https://learn.microsoft.com/cli/azure/)

---

## Conclusion

Congratulations! You've automated the deployment of essential Azure services using **Infrastructure as Code** with **Bicep**. By treating your infrastructure configurations as code, you embrace DevOps practices that streamline deployments and enhance collaboration.

**Key Takeaways:**

- **Automation**: Deploy complex infrastructure with a single command.
- **Managed Identity**: Securely authenticate between services without hardcoding credentials.
- **Customization**: Adapt the provided Bicep template to suit your specific needs.

Remember, the provided Bicep file is a starting point. You should customize it according to your application's requirements and your organization's best practices.

Happy coding and automating!