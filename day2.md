# Day 2: Deploying Azure Functions and Container Apps with GitHub Actions

## Introduction

Welcome to **Day 2** of our Azure journey! In this guide, we'll build upon what we accomplished in [Day 1](day1.md). Today, we'll focus on deploying **Azure Functions** and **Azure Container Apps** using **GitHub Actions**. This tutorial is designed for engineers who are new to Azure, providing detailed explanations and references to help you understand each step.

By the end of this guide, you will:

- Run and test Azure Functions locally using GitHub Codespaces.
- Deploy an Azure Function (API1) to Azure using GitHub Actions.
- Set up a Service Principal for secure deployments.
- Deploy an Azure Function (API2) as an Azure Container App.
- Build and deploy Docker images to Azure Container Registry (ACR).
- Automate deployments using GitHub Actions.

---

## Prerequisites

Before you begin, ensure that you have completed the activities in **Day 1** ([day1.md](day1.md)):

- Set up your Azure account.
- Created necessary resource groups.
- Familiarized yourself with basic Azure concepts.

You should also have:

- A **GitHub** account with access to your repository.
- Basic knowledge of **C#**, **.NET 8**, and **Git**.

---

## Table of Contents

1. [Setting Up Your Development Environment](#1-setting-up-your-development-environment)
2. [Running and Testing the Azure Function Locally (API1)](#2-running-and-testing-the-azure-function-locally-api1)
3. [Deploying API1 to Azure Using GitHub Actions](#3-deploying-api1-to-azure-using-github-actions)
4. [Setting Up API2 as an Azure Container App](#4-setting-up-api2-as-an-azure-container-app)
5. [Deploying API2 to Azure Using GitHub Actions](#5-deploying-api2-to-azure-using-github-actions)
6. [Conclusion](#6-conclusion)
7. [References](#7-references)

---

## 1. Setting Up Your Development Environment

### 1.1 Start GitHub Codespaces

**GitHub Codespaces** provides a cloud-based development environment directly in your browser or Visual Studio Code. It allows you to develop, build, and debug your applications without setting up a local environment.

- **Launching Codespaces:**

  - Navigate to your GitHub repository.
  - Click on the **Code** button.
  - Select the **Codespaces** tab.
  - Click on **Create codespace on main** (or the branch you're working on).

If Codespaces is not already started, refer to [day1.md](day1.md) for detailed steps on how to launch it.

### 1.2 Navigate to API1 Directory

Once Codespaces is running, open the terminal within Codespaces.

- Change to the `API1` project directory:

  ```bash
  cd C_Sharp/dotnet8/API1
  ```

### 1.3 Install Azure Tools Extensions

Ensure that the **Azure Tools** extensions are installed in your Codespaces environment. These extensions enable you to interact with Azure services directly from Visual Studio Code.

- **Installing Azure Tools Extensions:**

  - Open the **Extensions** panel in VS Code (Ctrl+Shift+X).
  - Search for **Azure Tools**.
  - Install the **Azure Tools** extension pack. This will install the following six Azure extensions:

    - Azure Account
    - Azure App Service
    - Azure Functions
    - Azure Storage
    - Azure Resources
    - Azure Databases

### 1.4 Install Azure Functions Core Tools

The **Azure Functions Core Tools** allow you to run and debug Azure Functions locally.

- **Installing via Command Palette:**

  - Press **Ctrl+Shift+P** to open the command palette.
  - Type **Azure Functions: Install or Update Azure Functions Core Tools** and select it.
  - Follow the prompts to complete the installation.

- **Alternatively, install using npm:**

  ```bash
  npm install -g azure-functions-core-tools@4 --unsafe-perm true
  ```

**References:**

- [Azure Functions Core Tools](https://learn.microsoft.com/azure/azure-functions/functions-run-local)

---

## 2. Running and Testing the Azure Function Locally (API1)

### 2.1 Run the Function Locally

Now that your environment is set up, let's run the Azure Function locally.

- **Start the Function App:**

  - Ensure you're in the `C_Sharp/dotnet8/API1` directory.
  - Run the following command in the terminal:

    ```bash
    func start
    ```

  This command builds and runs your Azure Function locally.

### 2.2 Test the Function

- **Access the Function in the Browser:**

  - After running the function, you should see output indicating the URL where your function is hosted, typically something like:

    ```
    Functions:

            HttpExample: [GET,POST] http://localhost:7071/api/HttpExample
    ```

  - GitHub Codespaces automatically forwards ports, so you can access your function from your local browser.


- **If Port Forwarding Doesn't Work:**

  - Manually forward the port:

    - In Codespaces, click on **Ports**.
    - Click on **Forward a Port**.
    - Enter **7071** and click **OK**.
    - Access the function using the forwarded URL.

- **Test the Function:**

  - Navigate to the URL provided (e.g., `https://your-codespace-name-7071.githubpreview.dev/api/HttpExample`).
  - You should see the expected response from your Azure Function.

---

## 3. Deploying API1 to Azure Using GitHub Actions

### 3.1 Create an Azure Function App in Azure

Before deploying, you need to create an Azure Function App in your Azure subscription.
_NOTE: Use the same resource group as day1 to simplify cleanup_ 
_NOTE: The free tier for Azure Functions is Y1

- **Options to Create an Azure Function App:**

  - **Using VS Code Extension:**

    - Open the **Azure** panel in VS Code.
    - Click on **Create New Project** under **Azure Functions**.
    - Follow the prompts to select region, language, and other settings. 
    - When prompted, choose to **Create a new Function App in Azure**.

  - **Using Azure CLI:**

    - Open the terminal.
    - Create a Resource Group (if not already created):

      ```bash
      az group create --name <ResourceGroupName> --location <Location>
      ```

    - Create a Storage Account:

      ```bash
      az storage account create --name <StorageAccountName> --location <Location> --resource-group <ResourceGroupName> --sku Standard_LRS
      ```

    - Create an App Service Plan:

      ```bash
      az appservice plan create --name <AppServicePlanName> --resource-group <ResourceGroupName> --sku F1 --is-linux
      ```

    - Create the Function App:

      ```bash
      az functionapp create --resource-group <ResourceGroupName> --consumption-plan-location <Location> --runtime dotnet-isolated --functions-version 4 --name <FunctionAppName> --storage-account <StorageAccountName>
      ```

  - **Using Azure Portal:**

    - Log in to the [Azure Portal](https://portal.azure.com/).
    - Click **Create a resource** and search for **Function App**.
    - Click **Create** and follow the prompts to configure your Function App.

**References:**

- [Create your first function using the Azure CLI](https://learn.microsoft.com/azure/azure-functions/create-first-function-cli-csharp)
- [Create your first function using Visual Studio Code](https://learn.microsoft.com/azure/azure-functions/create-first-function-vs-code-csharp)

### 3.2 Deploy Manually Using the Extension

Before automating the deployment, let's manually deploy the function to ensure everything works.

- **Deploy Using VS Code Extension:**

  - In the **Azure** panel, right-click on your Function App and select **Deploy to Function App**.
  - Choose the Function App you created in Azure.
  - VS Code will package and deploy your function.

- **Note:** Since the source code has an anonymous function, no credentials are needed for testing.

### 3.3 Create a GitHub Action for Deployment

Now, let's automate the deployment process using GitHub Actions.

- **Create a New GitHub Action:**

  - In your GitHub repository, navigate to the **Actions** tab.
  - Click on **New workflow**.
  - Search for **Azure Functions** and **DOT NET**.
  - Select the **Deploy Azure Functions** workflow template.

- **Configure the Workflow:**

  - **Set the Working Directory:**

    Ensure the workflow operates in the correct directory.

    ```yaml
    defaults:
      run:
        working-directory: C_Sharp/dotnet8/API1
    ```

  - **Trigger the Workflow Only on Changes to `API1`:**

    ```yaml
    on:
      push:
        paths:
          - 'C_Sharp/dotnet8/API1/**'
    ```

- **Create a Service Principal for Deployment**

  Since Azure Functions doesn't use a publish profile, we'll create a **Service Principal** for authentication.

  - **Create Service Principal Using Azure CLI:**

    ```bash
    az ad sp create-for-rbac --name "<ServicePrincipalName>" --role contributor --scopes /subscriptions/<SubscriptionID>/resourceGroups/<ResourceGroupName> --sdk-auth
    ```

    - Replace `<ServicePrincipalName>`, `<SubscriptionID>`, and `<ResourceGroupName>` with your values.
    - This command outputs a JSON object containing:

      - `clientId`
      - `clientSecret`
      - `subscriptionId`
      - `tenantId`

  - **Add Credentials to GitHub Secrets:**

    - In your GitHub repository, go to **Settings** > **Secrets and variables** > **Actions**.
    - Click **New repository secret**.
    - **Name:** `AZURE_CREDENTIALS`
    - **Value:** Paste the JSON output from the previous step.
    - Click **Add secret**.

  **Where to get the values:**

  - **Tenant ID:** Found in the Azure Portal under **Azure Active Directory** > **Properties**.
  - **Subscription ID:** Found in the Azure Portal under **Subscriptions**.
  - **Resource Group Name:** The name of the resource group you created in Day 1.

- **Update the Workflow with Azure Login:**

  Add the Azure Login action using the service principal credentials.

  ```yaml
  - name: 'Login via Azure CLI'
    uses: azure/login@v1
    with:
      creds: ${{ secrets.AZURE_CREDENTIALS }}
  ```

- **Deploy the Function:**

  Complete the workflow with steps to build and deploy the function.

  ```yaml
  - name: 'Set up .NET Core SDK'
    uses: actions/setup-dotnet@v3
    with:
      dotnet-version: '8.0.x'

  - name: 'Restore dependencies'
    run: dotnet restore

  - name: 'Build'
    run: dotnet build --configuration Release --no-restore

  - name: 'Publish'
    run: dotnet publish --configuration Release --output ./publish_output --no-build --no-restore

  - name: 'Deploy to Azure Functions'
    uses: Azure/functions-action@v1
    with:
      app-name: <FunctionAppName>
      package: ./publish_output
  ```

  - Replace `<FunctionAppName>` with the name of your Azure Function App.

- **Commit and Push the Workflow:**

  - Save the workflow file in `.github/workflows/`.
  - Commit and push the changes to trigger the workflow.

**References:**

- [Deploy Azure Functions using GitHub Actions](https://learn.microsoft.com/azure/azure-functions/functions-how-to-github-actions)
- [Azure Functions Action](https://github.com/Azure/functions-action)

---

## 4. Setting Up API2 as an Azure Container App

Now, we'll set up **API2**, and the key difference is that we'll deploy it as an **Azure Container App**.

### 4.1 Navigate to API2 Directory

- In the terminal, change to the `API2` project directory:

  ```bash
  cd C_Sharp/dotnet8/API2
  ```

### 4.2 Test the Function Locally

- **Run the Function:**

  ```bash
  func start
  ```

- **Note:** The function is boilerplate code, so it may not have specific functionality yet.

### 4.3 Generate a Dockerfile

- **Create a Dockerfile for the Function:**

  ```bash
  func init . --docker-only
  ```

  This command generates a `Dockerfile` in your `API2` directory, which is necessary for containerization.

**Reference:**

- [Docker and Azure Functions](https://learn.microsoft.com/azure/azure-functions/functions-create-function-linux-custom-image)

### 4.4 Create an Azure Function App

Create an Azure Function App for `API2` using any of the methods described earlier (extension, Azure CLI, or Azure Portal).

### 4.5 Create an Azure Container Registry (ACR)

An Azure Container Registry stores and manages private Docker container images.

- **Create ACR Using Azure CLI:**

  - **Create Resource Group (if not already created):**

    ```bash
    az group create --name <ResourceGroupName> --location <Location>
    ```

  - **Create ACR:**

    ```bash
    az acr create --resource-group <ResourceGroupName> --name <RegistryName> --sku Basic
    ```

    - Replace `<RegistryName>` with a unique name (must be lowercase and between 5-50 characters).

- **Log in to ACR:**

  ```bash
  az acr login --name <RegistryName>
  ```

**Reference:**

- [Create a private container registry](https://learn.microsoft.com/azure/container-registry/container-registry-get-started-azure-cli)

### 4.6 Upload a "Hello World" Image to ACR

- **Build a Dummy "Hello World" Docker Image:**

  - Create a simple `Dockerfile` if not already available.

    ```dockerfile
    FROM mcr.microsoft.com/dotnet/runtime:6.0
    CMD ["echo", "Hello, World!"]
    ```

  - Build the image:

    ```bash
    docker build -t <RegistryName>.azurecr.io/hello-world:latest .
    ```

- **Push the Image to ACR:**

  ```bash
  docker push <RegistryName>.azurecr.io/hello-world:latest
  ```

### 4.7 Update ACR Settings to Allow Login

- **Enable Admin User:**

  ```bash
  az acr update -n <RegistryName> --admin-enabled true
  ```

- **Retrieve Credentials:**

  ```bash
  az acr credential show --name <RegistryName>
  ```

- **Add Credentials to GitHub Secrets:**

  - **Name:** `REGISTRY_USERNAME` and `REGISTRY_PASSWORD`
  - **Values:** Use the `username` and `password` from the previous command.

### 4.8 Create an Azure Container App

- **Create a Container App Environment:**

  ```bash
  az containerapp env create --name <EnvironmentName> --resource-group <ResourceGroupName> --location <Location>
  ```

- **Deploy the Dummy Image to the Container App:**

  ```bash
  az containerapp create --name <ContainerAppName> \
    --resource-group <ResourceGroupName> \
    --environment <EnvironmentName> \
    --image <RegistryName>.azurecr.io/hello-world:latest \
    --target-port 80 \
    --ingress 'external'
  ```

**References:**

- [Deploy a container app](https://learn.microsoft.com/azure/container-apps/get-started)

---

## 5. Deploying API2 to Azure Using GitHub Actions

### 5.1 Create a GitHub Action from a Blank Workflow

- **Create a New Workflow:**

  - Go to the **Actions** tab in your GitHub repository.
  - Click on **New workflow**.
  - Choose **Set up a workflow yourself** to create a blank workflow.

### 5.2 Configure the Workflow

- **Set the Working Directory and Trigger Path:**

  ```yaml
  defaults:
    run:
      working-directory: C_Sharp/dotnet8/API2

  on:
    push:
      paths:
        - 'C_Sharp/dotnet8/API2/**'
  ```

- **Add Steps to Login and Checkout Repo:**

  - **Login to Azure:**

    ```yaml
    - name: 'Login via Azure CLI'
      uses: azure/login@v1
      with:
        creds: ${{ secrets.AZURE_CREDENTIALS }}
    ```

  - **Checkout the Repository:**

    ```yaml
    - name: 'Checkout code'
      uses: actions/checkout@v3
    ```

- **Build and Push Docker Image:**

  - **Use Docker Build-Push Action:**

    ```yaml
    - name: 'Set up Docker Buildx'
      uses: docker/setup-buildx-action@v2

    - name: 'Login to Azure Container Registry'
      uses: azure/docker-login@v1
      with:
        login-server: ${{ secrets.REGISTRY_NAME }}.azurecr.io
        username: ${{ secrets.REGISTRY_USERNAME }}
        password: ${{ secrets.REGISTRY_PASSWORD }}

    - name: 'Build and Push Docker Image'
      uses: docker/build-push-action@v3
      with:
        context: .
        push: true
        tags: ${{ secrets.REGISTRY_NAME }}.azurecr.io/api2:latest
    ```

- **Deploy to Azure Container App:**

  - **Deploy Using Azure CLI:**

    ```yaml
    - name: 'Deploy to Azure Container App'
      uses: azure/CLI@v1
      with:
        inlineScript: |
          az containerapp update --name <ContainerAppName> \
            --resource-group <ResourceGroupName> \
            --image ${{ secrets.REGISTRY_NAME }}.azurecr.io/api2:latest
    ```
  
    - Replace `<ContainerAppName>` and `<ResourceGroupName>` with your specific values.

- **Complete Workflow Example:**

  ```yaml
  name: Build and Deploy API2

  defaults:
    run:
      working-directory: C_Sharp/dotnet8/API2

  on:
    push:
      paths:
        - 'C_Sharp/dotnet8/API2/**'

  jobs:
    build-and-deploy:
      runs-on: ubuntu-latest
      steps:
        - name: 'Login via Azure CLI'
          uses: azure/login@v1
          with:
            creds: ${{ secrets.AZURE_CREDENTIALS }}

        - name: 'Checkout code'
          uses: actions/checkout@v3

        - name: 'Set up Docker Buildx'
          uses: docker/setup-buildx-action@v2

        - name: 'Login to Azure Container Registry'
          uses: azure/docker-login@v1
          with:
            login-server: ${{ secrets.REGISTRY_NAME }}.azurecr.io
            username: ${{ secrets.REGISTRY_USERNAME }}
            password: ${{ secrets.REGISTRY_PASSWORD }}

        - name: 'Build and Push Docker Image'
          uses: docker/build-push-action@v3
          with:
            context: .
            push: true
            tags: ${{ secrets.REGISTRY_NAME }}.azurecr.io/api2:latest

        - name: 'Deploy to Azure Container App'
          uses: azure/CLI@v1
          with:
            inlineScript: |
              az containerapp update --name <ContainerAppName> \
                --resource-group <ResourceGroupName> \
                --image ${{ secrets.REGISTRY_NAME }}.azurecr.io/api2:latest
  ```

### 5.3 Commit and Push the Workflow

- Save the workflow file in `.github/workflows/`.
- Commit and push the changes to trigger the workflow.

### 5.4 Verify Deployment

- Monitor the workflow run in the **Actions** tab.
- Once the workflow completes, verify the Container App deployment in the Azure Portal.
- Navigate to the Container App and test the endpoint to ensure it's running correctly.

---

## 6. Conclusion

Congratulations! You have successfully:

- Set up and tested Azure Functions locally using GitHub Codespaces.
- Installed necessary Azure extensions and tools.
- Created Azure Functions using different methods.
- Created and configured a Service Principal for secure deployments.
- Deployed an Azure Function (API1) to Azure using GitHub Actions.
- Built and deployed an Azure Container App (API2) using Docker and GitHub Actions.
- Automated deployments using GitHub Actions.

This hands-on experience has helped you understand how to develop, deploy, and manage serverless applications on Azure using modern DevOps practices.

---

## 7. References

- **Azure Functions Documentation**: [Azure Functions Overview](https://learn.microsoft.com/azure/azure-functions/functions-overview)
- **Azure Container Apps**: [Azure Container Apps Overview](https://learn.microsoft.com/azure/container-apps/overview)
- **Azure Functions Core Tools**: [Run Azure Functions Locally](https://learn.microsoft.com/azure/azure-functions/functions-run-local)
- **Azure CLI Reference**: [Azure CLI Documentation](https://learn.microsoft.com/cli/azure/)
- **GitHub Actions Documentation**: [Understanding GitHub Actions](https://docs.github.com/actions/learn-github-actions/understanding-github-actions)
- **Docker Build-Push Action**: [docker/build-push-action](https://github.com/docker/build-push-action)
- **Azure Login Action**: [azure/login](https://github.com/azure/login)
- **Azure Container Registry**: [Create a private container registry](https://learn.microsoft.com/azure/container-registry/container-registry-get-started-azure-cli)
- **Azure Functions Action for GitHub**: [Azure Functions Action](https://github.com/Azure/functions-action)
- **Azure Container Apps CLI**: [