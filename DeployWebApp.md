# Deploy an Azure Web App

## Introduction

This guide will walk you through deploying a web application on **Microsoft Azure** using the **Azure App Service**. We'll focus on hosting a photo library frontend, but the steps apply to any web application. You'll also learn how to scale and manage your application in the cloud. This guide is suitable for engineers new to Azure, as well as those with varying levels of experience.

## Prerequisites

Before you begin, ensure you have the following:

- **Azure Account**: If you don't have one, sign up for a free account [here](https://azure.microsoft.com/free/).
- **Basic Knowledge of Web Development**: HTML, CSS, and JavaScript.
- **Web Application Code**: Your photo library frontend application.
- **Azure CLI**: Install the Azure Command-Line Interface from [here](https://learn.microsoft.com/cli/azure/install-azure-cli) for managing Azure resources from your terminal.
  - Alternatively, you can use the **Azure Portal** for a graphical interface.

## Understanding Azure Concepts

### Azure Resource Manager (ARM)

Azure uses ARM for deploying and managing resources. Resources like web apps, databases, and virtual machines are grouped in **Resource Groups** for easier management.

### Azure App Service

**Azure App Service** is a fully managed platform for building, deploying, and scaling web apps. Key benefits include:

- **Supports multiple languages and frameworks**: .NET, Java, Node.js, Python, etc.
- **Built-in scalability**: Easily scale your apps up or out.
- **Continuous deployment**: Integrate with GitHub, Azure DevOps, etc.

### App Service Plan

An **App Service Plan** defines the compute resources (e.g., memory, CPU) for your app. You can have multiple apps share the same plan.

## Step-by-Step Deployment Guide

### 1. Log in to Azure

Open your terminal and log in to your Azure account:

```bash
az login
```

Follow the prompts to authenticate.

### 2. Create a Resource Group
A resource group is a container for your Azure resources.
```bash
az group create --name PhotoLibraryResourceGroup --location eastus
```

- Resource Group Name: PhotoLibraryResourceGroup
- Location: Choose a region close to your users (e.g., eastus, westus).

### 3. Create an App Service Plan
Create an App Service Plan to define the hosting environment.
```bash
az appservice plan create --name PhotoLibraryAppServicePlan --resource-group PhotoLibraryResourceGroup --sku B1 --is-linux
```

Plan Name: PhotoLibraryAppServicePlan
SKU: B1 (Basic tier). Options include F1 (Free), S1 (Standard), etc.
--is-linux: Specifies a Linux-based hosting environment.

### 4. Create a Web App
Create the web app within the App Service Plan.
```bash
az webapp create --resource-group PhotoLibraryResourceGroup --plan PhotoLibraryAppServicePlan --name PhotoLibraryWebApp --runtime "NODE|14-lts"
```

- Web App Name: Must be unique across Azure (e.g., PhotoLibraryWebApp)
- Runtime: Specify your application's runtime (e.g., PHP|7.4, PYTHON|3.8, NODE|14-lts)

### 5. Prepare Your Application for Deployment
Ensure your application is ready to be deployed:

Build your application: If using a frontend framework (React, Angular), build the production version.
Environment variables: Use variables for configuration settings.

### 6. Deploy Your Application
**Option A: Deploy using Zip Deploy**
Package your application into a ZIP file.

```bash
zip -r app.zip .
```

Deploy the ZIP file to Azure:
```bash
az webapp deployment source config-zip --resource-group PhotoLibraryResourceGroup --name PhotoLibraryWebApp --src app.zip
```

**Option B: Deploy using Git**
Set up local Git deployment:

```bash
az webapp deployment source config-local-git --name PhotoLibraryWebApp --resource-group PhotoLibraryResourceGroup
```

This command returns a Git remote URL. Add it as a remote in your local Git repository:

```bash
git remote add azure <GIT_REMOTE_URL>
```

Push your code to Azure:

```bash
git push azure master
```

### 7. Configure Application Settings (If Needed)
Set environment variables or other app settings:

```bash
az webapp config appsettings set --resource-group PhotoLibraryResourceGroup --name PhotoLibraryWebApp --settings KEY=VALUE
```

### 8. Test Your Web App
Get the URL of your web app:

```bash
az webapp show --name PhotoLibraryWebApp --resource-group PhotoLibraryResourceGroup --query defaultHostName -o tsv
```

Navigate to http://<defaultHostName> in your browser to see your deployed app.

## Scaling Your Web Application
Azure App Service allows you to scale your app to meet demand.

**Scale Up (Vertical Scaling)**
Increase the resources of your App Service Plan.
```bash
az appservice plan update --name PhotoLibraryAppServicePlan --resource-group PhotoLibraryResourceGroup --sku S1
```

- SKU Options: B1, B2, S1, S2, etc. Higher tiers offer more resources.

**Scale Out (Horizontal Scaling)**
Increase the number of instances running your app.
```bash
az monitor autoscale create --resource-group PhotoLibraryResourceGroup --resource PhotoLibraryAppServicePlan --resource-type Microsoft.Web/serverFarms --name AutoscaleSetting --min-count 1 --max-count 5 --count 1
```

Set scaling rules (e.g., CPU usage):
```bash
az monitor autoscale rule create --resource-group PhotoLibraryResourceGroup --autoscale-name AutoscaleSetting --condition "Percentage CPU > 70" --scale out 1
```

**Understanding Scaling Options**
- Manual Scaling: Manually adjust the instance count.
- Autoscaling: Automatically adjust based on metrics (CPU, memory).

## Managing Your Web Application
### Monitoring
Use Azure's monitoring tools to keep your app running smoothly.

### Azure Monitor
Provides insights into application performance.

- Metrics: CPU usage, memory, requests.
- Logs: Application logs, web server logs.

### Application Insights
Advanced monitoring for your application.
```bash
az monitor app-insights component create --app PhotoLibraryInsights --location eastus --resource-group PhotoLibraryResourceGroup
```

Link it to your web app:

```bash
az webapp config appsettings set --resource-group PhotoLibraryResourceGroup --name PhotoLibraryWebApp --settings APPINSIGHTS_INSTRUMENTATIONKEY=<Your_Instrumentation_Key>
```

### Logging
LoggingEnable diagnostic logs:

```bash
az webapp log config --name PhotoLibraryWebApp --resource-group PhotoLibraryResourceGroup --application-logging true --web-server-logging filesystem
```

## Custom Domains and SSL
Bind a custom domain to your web app and enable SSL:

- [Add a custom domain](https://learn.microsoft.com/azure/app-service/app-service-web-tutorial-custom-domain)
- [Add an SSL certificate](https://learn.microsoft.com/azure/app-service/configure-ssl-certificate)

# Additional Resources and Best Practices
## Continuous Deployment
Automate your deployments:

- **GitHub Actions**: [Set up CI/CD with GitHub Actions]https://learn.microsoft.com/azure/app-service/deploy-github-actions
- **Azure DevOps**: [Use Azure Pipelines](https://learn.microsoft.com/azure/devops/pipelines/get-started/azure-devops-pipeline)
-- [Learn more] (https://learn.microsoft.com/azure/active-directory/managed-identities-azure-resources/overview)

## Security
- Application Settings: Store sensitive data in environment variables.
- Managed Identity: Use Azure Managed Identity to access other Azure resources securely.

# Cost Management
Monitor and control your spending:

- Azure Pricing Calculator: Estimate costs here.
- Azure Cost Management: Set budgets and alerts.

# Clean Up Resources
To avoid unnecessary charges, delete resources when not in use:

# References
- [Azure App Service Documentation](https://learn.microsoft.com/azure/app-service/)
- [Azure CLI Documentation](https://learn.microsoft.com/cli/azure/)
- [Deploy a Web App](https://learn.microsoft.com/azure/app-service/quickstart-html)
- [Scale an App Service App](https://learn.microsoft.com/azure/app-service/manage-scale-up)
- [Monitor App Service Apps](Monitor App Service Apps)

# Conclusion
By following this guide, you've successfully deployed a web application to Azure, learned how to scale it, and explored ways to manage and monitor your app in the cloud. Azure App Service provides a robust and flexible platform for hosting web applications of all sizes. Continue exploring Azure's features to maximize the potential of your applications.

Happy coding!