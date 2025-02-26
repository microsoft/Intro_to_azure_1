# Deploy an Azure Function

## Introduction

Azure Functions is a **serverless computing** service provided by Microsoft Azure that allows you to run code without the need to manage servers explicitly. This means you can focus on building the functionality you need to process data, integrate systems, and build simple APIs and microservices.

In this guide, you'll learn how to:

- **Create serverless backend processes with Azure Functions**
- **Handle tasks like image processing or data manipulation without managing servers**

This tutorial is intended for engineers who are new to Azure, as well as those with varying levels of experience.

## Prerequisites

Before you begin, make sure you have the following:

- **Azure Account**: If you don't have one, you can sign up for a free account [here](https://azure.microsoft.com/free/).
- **Azure CLI**: Install the Azure Command-Line Interface from [here](https://learn.microsoft.com/cli/azure/install-azure-cli) to manage Azure resources from your terminal.
- **Node.js**: Install Node.js from [here](https://nodejs.org/) if you plan to write your functions in JavaScript/TypeScript.
- **Visual Studio Code (VS Code)**: Download and install VS Code from [here](https://code.visualstudio.com/).
  - **Azure Functions Extension**: Install the Azure Functions extension for VS Code from the Marketplace [here](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions).

## Understanding Azure Functions

### What Are Azure Functions?

Azure Functions is a **serverless compute** service that enables you to run code on-demand without provisioning or managing infrastructure. Functions are triggered by events, such as HTTP requests, messages on a queue, or timers.

**Key Concepts:**

- **Serverless Computing**: Infrastructure is abstracted away, so you can focus on code, and Azure handles running and scaling.
- **Event-Driven**: Functions are invoked by triggers, responding to events in real-time.
- **Pay-per-Use**: You're billed only for the time your code runs, making it cost-effective.

### Why Use Azure Functions?

- **Simplify Development**: Write less code and maintain less infrastructure.
- **Scalable**: Automatically scales to meet demand.
- **Cost-Effective**: Only pay for compute resources when your functions are running.
- **Versatile**: Support for multiple programming languages and integration with other Azure services.

## Step-by-Step Guide

### 1. Log in to Azure

Open your terminal and log in to your Azure account:

```
az login
```

A browser window will open for you to authenticate.

### 2. Create a Resource Group

A resource group is a container that holds related Azure resources.

```
az group create --name MyFunctionResourceGroup --location eastus
```

- Replace `MyFunctionResourceGroup` with your desired resource group name.
- Choose a location close to you or your users (e.g., `eastus`, `westeurope`).

### 3. Create a Storage Account

Azure Functions requires a storage account for operation.

```
az storage account create --name mystorageaccountxyz --location eastus --resource-group MyFunctionResourceGroup --sku Standard_LRS
```

- Storage account names must be unique across Azure and use only lowercase letters and numbers.
- Replace `mystorageaccountxyz` with a unique name.

### 4. Create a Function App

A Function App is a container for your Azure Functions.

```
az functionapp create --resource-group MyFunctionResourceGroup --consumption-plan-location eastus --runtime node --functions-version 4 --name MyFunctionApp --storage-account mystorageaccountxyz
```

- **--runtime**: Choose the language runtime (`node`, `python`, `dotnet`, `java`, etc.).
- **--functions-version**: The version of the Azure Functions runtime (`4` is the latest as of October 2023).
- **--name**: Must be unique across Azure.

### 5. Set Up Your Development Environment

#### Install Azure Functions Core Tools

Azure Functions Core Tools lets you develop and test functions locally.

```
npm install -g azure-functions-core-tools@4 --unsafe-perm true
```

Verify the installation:

```
func --version
```

#### Initialize a Local Function Project

Create a new folder for your project and navigate into it:

```
mkdir MyFunctionProject
cd MyFunctionProject
```

Initialize a new Functions project:

```
func init . --worker-runtime node
```

- **--worker-runtime**: The language runtime you chose earlier.

### 6. Create a Function

Create a new function within your project:

```
func new
```

You'll be prompted to select:

- **Function template**: Choose `HTTP trigger`.
- **Function name**: Enter `ImageProcessorFunction` or `DataManipulatorFunction`.
- **Authorization level**: Select `Anonymous` for this example (other options are `Function`, `Admin`).

### 7. Implement Your Function Logic

Open your project in VS Code:

```
code .
```

Navigate to the `index.js` file inside your function folder. Implement your code.

#### Example: Image Processing Function

```
module.exports = async function (context, req) {
    const imageUrl = req.query.imageUrl || (req.body && req.body.imageUrl);
    if (!imageUrl) {
        context.res = {
            status: 400,
            body: "Please pass an imageUrl in the query string or in the request body"
        };
        return;
    }

    try {
        const axios = require('axios');
        const Jimp = require('jimp');

        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const image = await Jimp.read(response.data);
        image.greyscale(); // Apply a greyscale filter
        const buffer = await image.getBufferAsync(Jimp.MIME_JPEG);

        context.res = {
            status: 200,
            body: buffer,
            headers: {
                'Content-Type': 'image/jpeg'
            }
        };
    } catch (error) {
        context.log.error("Error processing image:", error);
        context.res = {
            status: 500,
            body: "Error processing image"
        };
    }
};
```

**Note:** Install the required packages:

```
npm install axios jimp
```

#### Example: Data Manipulation Function

Similarly, you can implement data manipulation logic based on your requirements.

### 8. Test Your Function Locally

Start the function runtime:

```
func start
```

You'll see output indicating that your function is running:

```
Functions:

        ImageProcessorFunction: [GET,POST] http://localhost:7071/api/ImageProcessorFunction
```

Test your function using a web browser or a tool like `curl` or `Postman`:

```
curl "http://localhost:7071/api/ImageProcessorFunction?imageUrl=https://example.com/image.jpg" --output processed.jpg
```

### 9. Deploy Your Function to Azure

Deploy your function app to Azure:

```
func azure functionapp publish MyFunctionApp
```

- Replace `MyFunctionApp` with the name of your Function App.

### 10. Test Your Deployed Function

Get the URL of your Function App:

```
echo "https://$(az functionapp show --name MyFunctionApp --resource-group MyFunctionResourceGroup --query defaultHostName -o tsv)/api/ImageProcessorFunction"
```

Copy the URL and append your query parameters as needed. Test the function using `curl` or your browser.

## Additional Concepts

### Triggers and Bindings

**Triggers** are what cause a function to run. **Bindings** are a way to interact with other services.

Common triggers:

- **HTTP Trigger**: Invoked via HTTP requests.
- **Timer Trigger**: Runs on a schedule.
- **Blob Trigger**: Runs when a blob is added or modified.

Common bindings:

- **Input Bindings**: Read data from sources (e.g., storage, databases).
- **Output Bindings**: Write data to destinations.

### Scaling and Pricing

Azure Functions scales automatically based on demand.

- **Consumption Plan**: Scales dynamically, pay-per-use.
- **Premium Plan**: Always-ready instances, predictable performance.
- **Dedicated Plan**: Run functions within an App Service Plan.

### Monitoring and Logging

Use Azure Application Insights to monitor your functions.

Enable Application Insights:

```
az monitor app-insights component create --app MyFunctionAppInsights --location eastus --resource-group MyFunctionResourceGroup
```

Configure your Function App to use it:

```
az functionapp config appsettings set --name MyFunctionApp --resource-group MyFunctionResourceGroup --settings 