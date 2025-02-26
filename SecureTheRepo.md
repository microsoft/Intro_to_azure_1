# Secure Your GitHub Repository and Automate Deployments to Azure

## Introduction

Welcome! This guide will help you set up **Continuous Integration and Continuous Deployment (CI/CD)** for your Azure applications using **GitHub Actions**. You'll learn how to automatically deploy updates whenever you push changes to your repository, and implement security best practices to protect your code and deployment pipeline.

This tutorial is designed for engineers who are new to Azure and GitHub Actions. It aims to be understandable across a broad range of experience levels.

---

## Table of Contents

- [Introduction](#introduction)
- [Prerequisites](#prerequisites)
- [Understanding CI/CD and GitHub Actions](#understanding-cicd-and-github-actions)
- [Setting Up Your Azure Service Principal](#setting-up-your-azure-service-principal)
- [Storing Azure Credentials as GitHub Secrets](#storing-azure-credentials-as-github-secrets)
- [Creating a GitHub Actions Workflow](#creating-a-github-actions-workflow)
  - [Sample GitHub Actions Workflow](#sample-github-actions-workflow)
- [Explaining the Workflow](#explaining-the-workflow)
- [Security Best Practices](#security-best-practices)
- [Where to Find Standard GitHub Actions](#where-to-find-standard-github-actions)
- [Additional Resources](#additional-resources)
- [Conclusion](#conclusion)

---

## Prerequisites

Before you begin, ensure you have the following:

- **Azure Account**: If you don't have one, sign up for a free account [here](https://azure.microsoft.com/free/).
- **GitHub Account**: Sign up for free [here](https://github.com/).
- **Git Installed**: Download and install Git from [here](https://git-scm.com/downloads).
- **An Existing Azure Application**: A web app, Azure Function, or any code you wish to deploy.
- **Azure CLI**: Install from [here](https://learn.microsoft.com/cli/azure/install-azure-cli).

---

## Understanding CI/CD and GitHub Actions

### What is CI/CD?

- **Continuous Integration (CI)**: Practice of automating the integration of code changes from multiple contributors into a single software project.
- **Continuous Deployment (CD)**: Automates the delivery of applications to selected infrastructure environments.

### What are GitHub Actions?

- **GitHub Actions**: A CI/CD platform that allows you to automate your build, test, and deployment pipeline.
- **Workflows**: Automated processes configured in your repository that run one or more jobs.

---

## Setting Up Your Azure Service Principal

To allow GitHub Actions to deploy to your Azure resources securely, you'll create a **Service Principal** (an Azure Active Directory application) with the necessary permissions.

### Step 1: Log in to Azure CLI

```
az login
```

### Step 2: Set the Subscription (if you have multiple)

```
az account set --subscription "Your Subscription ID or Name"
```

### Step 3: Create a Service Principal

Replace `YourSubscriptionID`, `YourResourceGroup`, and `YourServicePrincipalName` with your values.

```
az ad sp create-for-rbac --name "YourServicePrincipalName" --role contributor \
--scopes /subscriptions/YourSubscriptionID/resourceGroups/YourResourceGroup \
--sdk-auth
```

- **Explanation**:
  - `--role contributor`: Grants the service principal Contributor role access.
  - `--scopes`: Specifies the scope at which the access applies (e.g., resource group).

This command outputs a JSON object containing your credentials:

```
{
  "clientId": "<GUID>",
  "clientSecret": "<VALUE>",
  "subscriptionId": "<GUID>",
  "tenantId": "<GUID>",
  (...)
}
```

**Note**: The `--sdk-auth` parameter outputs credentials in a format suitable for Azure SDKs and GitHub Actions.

---

## Storing Azure Credentials as GitHub Secrets

To use the credentials securely in your GitHub Actions workflow, store them as secrets in your GitHub repository.

### Step 1: Copy the JSON Output

Copy the entire JSON output from the previous step.

### Step 2: Add Secret to GitHub Repository

1. Navigate to your GitHub repository.
2. Click on **Settings**.
3. In the left sidebar, click on **Secrets and variables** > **Actions**.
4. Click on **New repository secret**.
5. **Name**: `AZURE_CREDENTIALS`.
6. **Value**: Paste the JSON output.
7. Click **Add secret**.

---

## Creating a GitHub Actions Workflow

GitHub Actions uses YAML files to define workflows.

### Step 1: Create the Workflow File

In your project's root directory, create a folder called `.github/workflows` and a file named `azure-deploy.yml`.

```
mkdir -p .github/workflows
touch .github/workflows/azure-deploy.yml
```

### Step 2: Add the Workflow Configuration

We'll use a sample workflow as a starter. You can customize it based on your application's needs.

---

### Sample GitHub Actions Workflow

Here is a sample workflow file to deploy an Azure Web App:

```
name: Build and Deploy to Azure

on:
  push:
    branches:
      - main  # Trigger the workflow on push to the main branch

permissions:
  contents: read
  id-token: write

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout Code
      uses: actions/checkout@v3

    - name: Set up .NET Core
      uses: actions/setup-dotnet@v3
      with:
        dotnet-version: '6.0.x'  # Change to your .NET version

    - name: Restore dependencies
      run: dotnet restore

    - name: Build
      run: dotnet build --configuration Release --no-restore

    - name: Publish
      run: dotnet publish -c Release -o publish_output

    - name: Deploy to Azure Web App
      uses: azure/webapps-deploy@v2
      with:
        app-name: 'YourWebAppName'  # Replace with your Azure Web App name
        publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
        package: publish_output
```

---

## Explaining the Workflow

- **Trigger**:
  - The workflow triggers on a push to the `main` branch.
- **Permissions**:
  - Sets necessary permissions for the workflow, including `id-token` for Azure authentication.
- **Jobs**:
  - **build-and-deploy**:
    - **Runs On**: Executes on `ubuntu-latest` runner.
    - **Steps**:
      - **Checkout Code**: Clones your repository using the `actions/checkout` action.
      - **Set up .NET Core**: Sets up the .NET environment.
      - **Restore dependencies**: Restores NuGet packages.
      - **Build**: Builds your application in Release configuration.
      - **Publish**: Publishes the app to a folder (`publish_output`).
      - **Deploy to Azure Web App**:
        - Uses the `azure/webapps-deploy` action.
        - **app-name**: Specifies your Azure Web App name.
        - **publish-profile**: Uses the publish profile stored in GitHub Secrets.

**Note**: For authentication, you can use the Azure publish profile or the service principal. In this example, we're using the publish profile method. Alternatively, you can authenticate with the service principal credentials stored in `AZURE_CREDENTIALS`.

---

## Security Best Practices

- **Use Secrets**: Always store sensitive information like credentials and keys in GitHub Secrets.
- **Least Privilege Principle**: Grant the minimal level of permissions required for the service principal.
- **Rotate Credentials**: Regularly rotate credentials to reduce the risk of compromise.
- **Branch Protection**: Enable branch protection rules to prevent unauthorized code changes.
- **Code Scanning**: Use GitHub's code scanning tools to detect vulnerabilities.
- **Dependabot Alerts**: Enable Dependabot alerts to keep dependencies up to date.

---

## Where to Find Standard GitHub Actions

- **GitHub Marketplace**: Browse and find standard actions in the [GitHub Marketplace](https://github.com/marketplace?type=actions).
- **Official Actions**: GitHub provides a set of official actions, such as:
  - `actions/checkout`: Checks out your repository.
  - `actions/setup-dotnet`: Sets up a .NET environment.
- **Azure Actions**: Microsoft provides official actions for Azure, such as:
  - `azure/login`: Logs in to Azure.
  - `azure/webapps-deploy`: Deploys to Azure Web Apps.
  - **Azure Actions Documentation**: [Azure Actions](https://github.com/actions/azure)

---

## Additional Resources

- **GitHub Actions Documentation**: [Understanding GitHub Actions](https://docs.github.com/actions/learn-github-actions/understanding-github-actions)
- **Azure Deployment Center**: [Deploy to Azure Web Apps using GitHub Actions](https://learn.microsoft.com/azure/app-service/deploy-github-actions)
- **Authenticate with Azure**: [Azure Login Action](https://github.com/Azure/login)
- **Azure Service Principal**: [Create an Azure service principal](https://learn.microsoft.com/azure/active-directory/develop/howto-create-service-principal-portal)
- **Security Best Practices**: [Security hardening for GitHub Actions](https://docs.github.com/actions/security-guides/security-hardening-for-github-actions)

---

## Conclusion

By following this guide, you've:

- **Set Up a Service Principal**: Created a secure method for GitHub Actions to authenticate with Azure.
- **Secured Credentials**: Stored sensitive information safely using GitHub Secrets.
- **Configured a GitHub Actions Workflow**: Automated the build and deployment process.
- **Implemented Security Best Practices**: Protected your code and deployment pipeline.

Automation and security are key components of modern software development. Embracing these practices ensures that your deployments are consistent, secure, and efficient.

Happy coding and automating!