# Deploying a .NET 8 Web Application to Azure App Service Using GitHub Actions

## Introduction

This guide will walk you through the process of deploying a **.NET 8** web application to **Azure App Service** using **GitHub Codespaces** and **GitHub Actions**. It's designed for engineers who are new to Azure and want to understand how to deploy applications to the cloud seamlessly.

By following this tutorial, you'll learn how to:

- Launch a GitHub Codespace and set up your development environment.
- Build and run a .NET 8 web application.
- Create an Azure App Service using the free tier.
- Set up continuous deployment with GitHub Actions.
- Trigger a deployment to Azure App Service.

Let's get started!

---

## Prerequisites

Before you begin, ensure you have the following:

- **GitHub Account**: Sign up for free [here](https://github.com/).
- **Azure Account**: If you don't have one, create a free account [here](https://azure.microsoft.com/free/).
- **Basic Knowledge of Git and GitHub**: Familiarity with repositories and version control.
- **Understanding of .NET and C#**: Basic knowledge to work with the web application.

---

## Table of Contents

1. [Launching GitHub Codespaces](#1-launching-github-codespaces)
2. [Setting Up Your .NET 8 Web Application](#2-setting-up-your-net-8-web-application)
3. [Building and Running the Application](#3-building-and-running-the-application)
4. [Creating an Azure App Service (Free Tier)](#4-creating-an-azure-app-service-free-tier)
5. [Downloading the Publish Profile](#5-downloading-the-publish-profile)
6. [Setting Up GitHub Actions Deployment](#6-setting-up-github-actions-deployment)
7. [Triggering a Deployment](#7-triggering-a-deployment)
8. [References](#8-references)

---

## 1. Launching GitHub Codespaces

**GitHub Codespaces** is a cloud-based development environment that allows you to write, build, and debug your code directly from your browser or local VS Code editor. It provides an instant development environment configured for your project.

### Steps:

1. **Open Your GitHub Repository**: Navigate to the repository containing your .NET 8 web application.

2. **Launch a Codespace**:

   - Click on the green **Code** button.
   - Select the **Codespaces** tab.
   - Click on **Create codespace on main** (or your desired branch).

   This will launch a new Codespace with all the necessary dependencies installed.

---

## 2. Setting Up Your .NET 8 Web Application

Once your Codespace is running, you'll need to navigate to your web application's directory and ensure that the correct .NET version is installed.

### Steps:

1. **Navigate to the Project Directory**:

   Open the terminal in Codespaces and run:

   ```
   cd C_Sharp/dotnet8/WEB
   ```

   This command changes the current directory to where your web application code is located.

2. **Verify .NET Version**:

   Ensure that the .NET version installed is **.NET 8**:

   ```
   dotnet --list-sdks
   ```

   You should see output similar to:

   ```
   8.0.100
   ```

   If the version is not .NET 8, install it by following the [official instructions](https://dotnet.microsoft.com/download/dotnet/8.0).

---

## 3. Building and Running the Application

Now that you're in the correct directory with the right .NET version, it's time to build and run your application.

### Steps:

1. **Restore Dependencies**:

   Restore any NuGet packages required by your application:

   ```
   dotnet restore
   ```

2. **Build the Application**:

   Build the project in **Release** configuration:

   ```
   dotnet build --configuration Release
   ```

3. **Run the Application**:

   Run the application:

   ```
   dotnet run
   ```

   You should see output indicating that the application is running and listening on a specific port.

4. **Test the Application**:

   - If using the browser-based Codespaces editor, you can forward the port to access the app in your browser.
   - Click on the **Ports** tab on the left sidebar.
   - Find the port your application is running on (usually **5000** or **5001**).
   - Click on the globe icon to open the application in a new browser tab.

---

## 4. Creating an Azure App Service (Free Tier)

**Azure App Service** is a fully managed platform for building, deploying, and scaling web apps. We'll create an App Service instance to host our web application.

### Steps:

1. **Log in to Azure Portal**:

   Go to the [Azure Portal](https://portal.azure.com/) and sign in with your Azure account.

2. **Create a New App Service**:

   - Click on **Create a resource** at the top left.
   - Search for **App Service** and select it.
   - Click on **Create**.

3. **Configure the App Service**:

   - **Subscription**: Select your Azure subscription.
   - **Resource Group**: Create a new resource group or select an existing one.
   - **Name**: Enter a unique name for your app (e.g., `my-dotnet8-webapp`).
   - **Publish**: Choose **Code**.
   - **Runtime Stack**: Select **.NET 8**.
   - **Region**: Choose a region close to you or your users.
   - **SKU and Size**: Click on **Change size** and select the **Free (F1)** tier.

4. **Review and Create**:

   - Click on **Review + create**.
   - After validation, click on **Create** to deploy the App Service.

---

## 5. Downloading the Publish Profile

The publish profile contains the credentials and settings needed to deploy your application to Azure App Service.

### Steps:

1. **Navigate to Your App Service**:

   In the Azure Portal, go to **Resource Groups**, select your resource group, and click on your App Service.

2. **Download Publish Profile**:

   - In the left sidebar, under **Deployment**, click on **Get publish profile**.
   - This will download an `.PublishSettings` file to your computer.

3. **Store the Publish Profile Securely**:

   - You'll need this file to configure deployment from GitHub.
   - Do not commit this file to source control or share it publicly.

---

## 6. Setting Up GitHub Actions Deployment

**GitHub Actions** is a CI/CD platform that allows you to automate your build, test, and deployment pipeline. We'll set up an action to deploy our application to Azure whenever changes are pushed to the repository.

### Steps:

1. **Add Publish Profile to GitHub Secrets**:

   - In your GitHub repository, go to **Settings**.
   - Click on **Secrets and variables** > **Actions**.
   - Click on **New repository secret**.
   - **Name**: `AZURE_WEBAPP_PUBLISH_PROFILE`.
   - **Value**: Open the `.PublishSettings` file you downloaded earlier and paste its contents.
   - Click **Add secret**.

2. **Create a New GitHub Action**:

   - In your repository, click on the **Actions** tab.
   - Click on **New workflow**.
   - Search for **Azure Web App** or select **Deploy .NET Core to Azure Web App** from the suggested workflows.

3. **Configure the Workflow**:

   - The workflow file (`.github/workflows/azure-webapp.yml`) will open in the editor.
   - Modify the workflow to suit your needs:

     - **Set the app name**:

       In the `with` section, replace `YOUR_WEB_APP_NAME` with the name of your App Service:

       ```
       app-name: 'my-dotnet8-webapp' # Replace with your app name
       ```

     - **Specify the .NET version**:

       Ensure that the .NET version matches your project's version:

       ```
       dotnet-version: '8.0.x' # Use .NET 8
       ```

     - **Limit to Correct Code Path**:

       If your application is not in the repository root, specify the working directory:

       ```
            on:
            push:
                branches: [ "main" ]
                paths: 
                - "C_Sharp/dotnet8/WEB/**"  
            workflow_dispatch:
       ```

4. **Commit the Workflow**:

   - Review the workflow.
   - Click **Start commit**.
   - Choose **Commit directly to the `main` branch** (or create a new branch if preferred).
   - Click **Commit new file**.

---

## 7. Triggering a Deployment

With the GitHub Action configured, any push to the specified branch will trigger the workflow and deploy your application to Azure App Service.

### Steps:

1. **Make a Code Change**:

   - Edit a file in your application to simulate a change.
   - Commit the change and push it to the `main` branch (or the branch specified in the workflow).

2. **Monitor the Workflow**:

   - Go to the **Actions** tab in your repository.
   - You should see the workflow running.
   - Click on the workflow to see detailed logs.

3. **Verify Deployment**:

   - Once the workflow completes successfully, your application is deployed to Azure.
   - In the Azure Portal, navigate to your App Service.
   - Click on the **URL** provided to access your web application.
   - Verify that the changes you made are reflected in the deployed application.

---

## 8. References

- **Azure App Service Documentation**: [Overview of Azure App Service](https://learn.microsoft.com/azure/app-service/overview)
- **GitHub Actions Documentation**: [Understanding GitHub Actions](https://docs.github.com/actions/learn-github-actions/understanding-github-actions)
- **Deploying to Azure with GitHub Actions**: [Deploy to Azure Web App using GitHub Actions](https://learn.microsoft.com/azure/app-service/deploy-github-actions)
- **GitHub Codespaces Documentation**: [GitHub Codespaces Overview](https://docs.github.com/codespaces/overview)
- **Azure Free Account**: [Create your Azure free account](https://azure.microsoft.com/free)

---

## Conclusion

Congratulations! You've successfully deployed a .NET 8 web application to Azure App Service using GitHub Codespaces and GitHub Actions. This process allows you to develop, test, and deploy applications efficiently, leveraging the power of cloud computing.

Feel free to explore additional Azure services and GitHub Actions to enhance your application's capabilities and deployment pipeline.

---

Happy coding!
