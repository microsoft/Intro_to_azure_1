# Deploy an Azure Function

## Introduction

Welcome! This guide will help you deploy Azure Functions to create serverless backend processes using Microsoft Azure. Azure Functions allow you to handle tasks like image processing or data manipulation without managing servers. This is ideal for building scalable and efficient applications.

In this tutorial, we will:

- **Deploy Azure Functions using existing source code written in .NET 8**
- **Understand how to work with Azure Functions**

This guide is intended for engineers who are new to Azure, but it caters to a broad range of experience levels.

## Prerequisites

Before you begin, ensure you have the following:

- **Azure Account**: If you don't have one, you can create a free account [here](https://azure.microsoft.com/free/).
- **Azure CLI**: Install the Azure Command-Line Interface from [here](https://learn.microsoft.com/cli/azure/install-azure-cli) to manage Azure resources from your terminal.
- **.NET 8 SDK**: Install .NET 8 from [here](https://dotnet.microsoft.com/download/dotnet/8.0).
- **Visual Studio Code (VS Code)**: Download from [here](https://code.visualstudio.com/).
  - **Azure Functions Extension**: Install from the VS Code Marketplace [here](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions).
  - **C# Extension**: Install from [here](https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.csharp) for C# support.

## Understanding Azure Functions

### What Are Azure Functions?

Azure Functions is a **serverless compute** service that enables you to run event-triggered code without explicitly provisioning or managing infrastructure. This allows you to focus on writing code to solve business problems without worrying about server maintenance.

**Key Benefits:**

- **Event-Driven**: Functions are triggered by events such as HTTP requests, timer schedules, or messages from other Azure services.
- **Scalability**: Automatically scales to meet demand.
- **Cost-Effective**: Pay only for the time your code runs.

### Why Use Azure Functions?

- **Simplify Backend Logic**: Ideal for tasks like image processing, data manipulation, and responding to database changes.
- **Integration**: Easily integrate with other Azure services and external platforms.
- **Efficient Development**: Focus on writing code rather than managing infrastructure.

## Setting Up Your Development Environment

### Install .NET 8 SDK

Download and install the .NET 8 SDK:

- [Download .NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)

Verify the installation by running:

```
dotnet --version
```

You should see output similar to:

```
8.0.100
```

### Install Azure Functions Core Tools

Azure Functions Core Tools allow you to develop and test your functions locally.

Install via npm:

```
npm install -g azure-functions-core-tools@4 --unsafe-perm true
```

Alternatively, download the installer from [here](https://github.com/Azure/azure-functions-core-tools).

### Install Visual Studio Code Extensions

In VS Code, install the following extensions:

- **Azure Functions Extension**: Simplifies the development and deployment of Azure Functions.
- **C# Extension**: Provides C# editing support.

## Accessing the Source Code

The source code for the Azure Functions is located in the repository under:

- **Function 1**: `C_Sharp/dotnet8/API1`
- **Function 2**: `C_Sharp/dotnet8/API2`

Clone the repository to your local machine.

#### Cloning the Repository

```
git clone https://github.com/your-username/your-repo.git
```

Replace `your-username` and `your-repo` with your GitHub username and repository name.

Navigate to the project directory:

```
cd your-repo/C_Sharp/dotnet8
```

## Creating an Azure Function App

An Azure Function App is a container for your functions, settings, and resources.

### Step 1: Log in to Azure

Log in via the Azure CLI:

```
az login
```

A browser window will open for authentication.

### Step 2: Create a Resource Group

A resource group is a container that holds related resources.

```
az group create --name MyFunctionAppResourceGroup --location eastus
```

- Replace `MyFunctionAppResourceGroup` with your desired name.
- Choose a location close to your users (e.g., `eastus`, `westeurope`).

### Step 3: Create a Storage Account

Azure Functions require a Storage Account to store runtime and trigger information.

```
az storage account create --name mystorageaccountxyz --location eastus --resource-group MyFunctionAppResourceGroup --sku Standard_LRS
```

- Storage account names must be unique across Azure and use only lowercase letters and numbers.
- Replace `mystorageaccountxyz` with a unique name.

### Step 4: Create the Function App

This code already exists in the repo, however here are the steps for creating them from scratch.  Create the Function App using the `dotnet-isolated` runtime (supports .NET 8):

```
az functionapp create --resource-group MyFunctionAppResourceGroup --consumption-plan-location eastus --runtime dotnet-isolated --functions-version 4 --name MyFunctionApp --storage-account mystorageaccountxyz
```

- **--runtime**: Use `dotnet-isolated` for .NET 8 support.
- **--functions-version**: Use Functions version `4` for .NET 8.
- **--name**: Must be unique across Azure.

## Deploying the Azure Functions

### Option 1: Deploy Using Visual Studio Code

#### Step 1: Open the Project in VS Code

Open the folder containing `API1` and `API2` in VS Code.

#### Step 2: Install Azure Functions Extension

Ensure the **Azure Functions** extension is installed in VS Code.

#### Step 3: Sign in to Azure

In VS Code, click on the **Azure** icon on the sidebar and sign in to your Azure account.

#### Step 4: Deploy Function App

For each function (`API1` and `API2`):

- Right-click on the function project folder in the Explorer.
- Select **Deploy to Function App...**.
- Follow the prompts to select your subscription, Function App, and confirm deployment.

### Option 2: Deploy Using the Azure CLI

#### Step 1: Publish the Function

For each function (`API1` and `API2`), navigate to the project directory:

For `API1`:

```
cd API1
```

Publish the function:

```
func azure functionapp publish MyFunctionApp --csharp
```

Repeat the same steps for `API2`.

#### Note on Project Files

Ensure that the `.csproj` files in `API1` and `API2` target .NET 8:

```
<TargetFramework>net8.0</TargetFramework>
```

## Testing the Deployed Functions

Retrieve the Function App's default hostname:

```
FUNCTION_APP_NAME=MyFunctionApp

FUNCTION_HOST=$(az functionapp show --name $FUNCTION_APP_NAME --resource-group MyFunctionAppResourceGroup --query defaultHostName -o tsv)
```

### Test Function 1 (`API1`)

Assuming your function name is `Function1`, construct the URL:

```
https://$FUNCTION_HOST/api/Function1
```

Test the function using `curl` or a web browser:

```
curl https://$FUNCTION_HOST/api/Function1
```

### Test Function 2 (`API2`)

Similarly, for `Function2`:

```
https://$FUNCTION_HOST/api/Function2
```

Test using:

```
curl https://$FUNCTION_HOST/api/Function2
```

## Managing and Monitoring the Functions

### Application Settings

Adjust settings specific to your functions using the Azure CLI:

```
az functionapp config appsettings set --name MyFunctionApp --resource-group MyFunctionAppResourceGroup --settings "Key=Value"
```

### Monitoring with Application Insights

Enable Application Insights to monitor your functions:

#### Step 1: Create an Application Insights Resource

```
az monitor app-insights component create --app MyFunctionAppInsights --location eastus --resource-group MyFunctionAppResourceGroup
```

#### Step 2: Configure the Function App to Use Application Insights

```
INSTRUMENTATION_KEY=$(az monitor app-insights component show --app MyFunctionAppInsights --resource-group MyFunctionAppResourceGroup --query instrumentationKey -o tsv)

az functionapp config appsettings set --name MyFunctionApp --resource-group MyFunctionAppResourceGroup --settings "APPINSIGHTS_INSTRUMENTATIONKEY=$INSTRUMENTATION_KEY" "APPLICATIONINSIGHTS_CONNECTION_STRING=InstrumentationKey=$INSTRUMENTATION_KEY"
```

You can now monitor your functions in the Azure Portal under Application Insights.

### Scaling

Azure Functions on the **Consumption Plan** automatically scale based on demand, with no additional configuration required.

## Additional Notes

- **Function Names**: The endpoint URLs correspond to the function names defined in your code.
```- **Code Modifications**: If you make changes to your code, redeploy the functions using the steps above.
- **Local Testing**: You can test your functions locally using Azure Functions Core Tools before deploying.
- **Version Compatibility**: Ensure that your local environment and Azure Function App are both using .NET 8.

## Additional Resources and References

- **Azure Functions Documentation**: [Official Docs](https://learn.microsoft.com/azure/azure-functions/)
- **Azure CLI Documentation**: [Azure CLI Docs](https://learn.microsoft.com/cli/azure/)
- **Azure Functions Core Tools**: [Functions Core Tools](https://learn.microsoft.com/azure/azure-functions/functions-run-local)
- **Deploy Azure Functions**: [Deployment Strategies](https://learn.microsoft.com/azure/azure-functions/functions-deployment-technologies)
- **Monitoring with Application Insights**: [Application Insights for Azure Functions](https://learn.microsoft.com/azure/azure-functions/functions-monitoring)

## Conclusion

By following this guide, you've successfully deployed Azure Functions using existing .NET 8 code. You now have serverless backend processes capable of handling tasks like image processing or data manipulation without the overhead of managing servers.

Azure Functions provide a powerful and flexible way to build scalable applications. The serverless architecture allows you to focus on writing code, improving productivity and efficiency.

Happy coding!

