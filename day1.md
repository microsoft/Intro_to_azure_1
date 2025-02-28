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

## FAQ

*Development Environment and Tools*

### What is GitHub Codespaces, and how does it benefit my development workflow?
GitHub Codespaces is a cloud-based development environment provided by GitHub, offering instant access to a fully customized and containerized environment directly from your browser or Visual Studio Code. It enables developers to code, build, test, and debug applications without the need to set up and maintain local development environments. By using Codespaces, you can ensure consistency across team members, reduce onboarding time, and eliminate "works on my machine" issues. It integrates seamlessly with GitHub repositories, providing immediate access to your code and simplifying collaboration. This enhances productivity by allowing you to focus on writing code rather than managing environments.

### Can I use this deployment method for other types of applications besides .NET 8, such as Node.js or Python?
Yes, the deployment method using GitHub Actions and Azure App Service is flexible and supports various application types, including Node.js, Python, Java, PHP, and more. Azure App Service supports multiple runtimes, and you can customize the GitHub Actions workflow to suit the build and deployment processes of different languages. Modify the workflow file to include the appropriate setup steps, such as using actions/setup-node for Node.jsor actions/setup-python for Python applications. This allows you to automate deployments for diverse technologies using similar CI/CD pipelines.

### What are the best practices for structuring my repository when using GitHub Actions and Azure deployments?
Organize your repository with a clear directory structure, separating code, configuration, and documentation. Place your application code in a dedicated directory if not at the root, and adjust the working-directory in your GitHub Actions workflow accordingly. Keep your workflow files in the .github/workflows/ directory. Use meaningful branch names and consider implementing a branching strategy like GitFlow. Exclude sensitive data and secrets from the repository, and store them securely using GitHub Secrets or Azure App Service settings.

### How do I customize the GitHub Actions workflow to include additional steps like testing or code analysis?
You can customize the GitHub Actions workflow by adding new steps to the YAML configuration file. For testing, include commands like dotnet test or npm test depending on your framework. For code analysis, integrate tools such as static analyzers or linters by adding steps that execute these tools and handle their outputs. Ensure these steps occur before the deployment step to prevent faulty code from being deployed. You can also conditionally fail the workflow if tests or analyses fail, enforcing code quality standards.

*Security and Permissions*

### How do I ensure that my application is secure when using GitHub Actions for deployment?
To secure your application during deployment with GitHub Actions, store sensitive data like secrets, tokens, and keys in GitHub Secrets, which encrypts and keeps them out of your codebase. Implement the principle of least privilege by granting only necessary permissions to your deployment credentials or service principal. Regularly review and rotate credentials to minimize exposure risk. Use trusted actions and maintain up-to-date dependencies to prevent supply chain attacks. Additionally, enable required reviews and branch protections to prevent unauthorized code from being merged and deployed.

### What permissions are required for GitHub Actions to deploy to Azure, and how do I manage them securely?
GitHub Actions requires deployment credentials with appropriate permissions to deploy to Azure, typically through a Service Principal or publish profile. It's recommended to use a Service Principal with the least privileges necessary, granting access only to the specific resources needed. Manage these credentials securely by storing them in GitHub Secrets, ensuring they are encrypted and not exposed in your codebase. Regularly audit and update permissions, and consider using Azure role-based access control (RBAC) to fine-tune access levels.

### How do I manage environment variables and app settings securely in Azure App Service?
In Azure App Service, manage environment variables and application settings by navigating to your App Service in the Azure Portal and selecting Configuration > Application settings. Here you can create key-value pairs that are injected into your application at runtime. These settings are encrypted and stored securely, and your application can access them as environment variables. Avoid hardcoding sensitive information in your code; instead, use these settings to configure connection strings, API keys, and other secrets securely.

### Are there alternatives to using publish profiles for authentication, such as using Azure Service Principals with OpenID Connect?
Yes, you can use Azure Service Principals with OpenID Connect (OIDC) for authentication in GitHub Actions, providing a secure and password-less method. By configuring the azure/login GitHub Action with OIDC, you eliminate the need to store and rotate secrets like passwords or keys. This approach leverages GitHub's identity federation with Azure AD, allowing GitHub to request short-lived tokens directly from Azure. It's considered a more secure practice as it reduces the risk associated with long-lived credentials.

*Cost and Resource Management*

### Are there any costs associated with using GitHub Codespaces and Azure App Service on the free tier?
GitHub Codespaces offers a free tier for individuals, which includes a limited number of core hours and storage per month; usage beyond these limits incurs charges. Azure App Service provides a free tier (F1) that allows you to host web applications at no cost, but it comes with resource limitations like reduced CPU time and memory. While both services have free offerings, it's important to monitor your usage to avoid exceeding the free allowances, which could result in fees. For organizations or higher usage levels, paid plans are available with increased resources and capabilities. 

### What are the limitations of the Azure App Service free tier, and when should I consider upgrading?
The Azure App Service free tier has limitations such as restricted CPU and memory resources, no custom domain support, limited SSL capabilities, and no service-level agreement (SLA). It's suitable for development, testing, or low-traffic applications. Consider upgrading to a Basic, Standard, or Premium tier when you need custom domains, SSL certificates, increased performance, auto-scaling capabilities, or additional features like staging slots. Upgrading ensures better reliability and supports growing application demands, providing enhanced features and support.

### How does scaling work in Azure App Service, and how can I configure it for higher traffic volumes?
Azure App Service supports manual and automatic scaling options. Manual scaling lets you increase the instance count or upgrade to a higher-tier plan with more resources. Automatic scaling (autoscaling) can be configured based on metrics like CPU usage, memory consumption, or request queues. In the Azure Portal, under your App Service's Scale out (App Service plan) settings, you can define scaling rules and thresholds. Properly configuring scaling ensures your application can handle increased traffic while optimizing costs.

*Deployment and CI/CD Processes*

### Can I automate the creation of Azure resources using Infrastructure as Code tools like Bicep or ARM templates?
Yes, you can automate Azure resource creation using Infrastructure as Code tools such as Azure Bicep, ARM templates, or Terraform. These tools allow you to define your infrastructure declaratively and deploy it consistently. You can integrate resource deployment into your GitHub Actions workflow using actions like azure/arm-deploy for ARM templates or custom scripts for Bicep. This approach ensures that your infrastructure is version-controlled and replicable across environments, improving deployment reliability and efficiency.

### Is it possible to set up continuous deployment for multiple branches or environments (development, staging, production)?
Yes, you can set up continuous deployment for multiple branches or environments by configuring your GitHub Actions workflows to trigger on specific branches, paths  or pull requests. Use environment variables and conditional logic within your workflow to deploy to different Azure App Service instances or slots representing development, staging, and production environments. Azure App Service supports deployment slots, allowing you to deploy updates to a staging slot before swapping it with production, enabling zero-downtime deployments and easy rollback if needed.

### What are the differences between deploying from GitHub Actions versus other CI/CD tools like Azure DevOps?
GitHub Actions is integrated directly into GitHub, providing a seamless experience for repositories hosted there, with workflows defined as YAML files within the repository. Azure DevOps is a separate service offering more extensive tools for planning, testing, and deploying applications, suitable for larger organizations with complex needs. While both support CI/CD pipelines and Azure deployments, GitHub Actions may be more convenient for GitHub-centric workflows, whereas Azure DevOps offers additional features like advanced test planning and artifact management. The choice depends on team preferences, existing toolchains, and specific requirements.

### Is it possible to deploy to other Azure services, such as Azure Functions or Kubernetes, using similar workflows?
Yes, you can deploy to various Azure services like Azure Functions, Azure Kubernetes Service (AKS), and others using GitHub Actions. There are specific actions and deployment strategies for each service, enabling you to automate the build and deployment processes. For example, use azure/functions-action to deploy Azure Functions or azure/k8s-deploy for AKS. Customize your workflows to include the necessary build steps, configurations, and authentication methods specific to the target service.

### How do I handle application updates and rollback strategies in case of deployment failures?
Implement deployment strategies such as using deployment slots in Azure App Service, which allow you to deploy updates to a staging slot before swapping with production. This enables testing the new version in a production-like environment and provides a quick rollback mechanism by swapping back if issues arise. Include health checks and automated tests in your deployment pipeline to catch problems early. Maintain version control of your application and infrastructure code to facilitate reverting to previous stable versions when necessary.

*Troubleshooting and Maintenance*

### What if I encounter errors during deployment; how can I troubleshoot issues in GitHub Actions and Azure?
When encountering deployment errors, start by examining the logs in GitHub Actions to identify at which step the failure occurred. Check for common issues such as syntax errors, missing dependencies, or authentication problems. In Azure, access the App Service diagnostics and logs through the Azure Portal to investigate runtime errors. Utilize Azure's Kudu service for advanced troubleshooting, including examining deployment logs and application files. If needed, enable more detailed logging or set up Application Insights to gain deeper insights into your application's behavior.

### How can I monitor my application's performance and logs once it's deployed to Azure App Service?
Azure App Service provides built-in monitoring and logging features accessible through the Azure Portal. Enable Application Insights for detailed performance metrics, request tracking, and diagnostics. Access logs under the Log Stream or Diagnostics sections to view real-time application logs or download logs for analysis. Set up alerts and dashboards in Azure Monitor to proactively track application health and be notified of critical issues. These tools help you gain insights into your application's behavior and identify potential problems.

### How do I set up a custom domain and HTTPS for my Azure App Service?
To set up a custom domain, navigate to your App Service in the Azure Portal, select Custom domains, and follow the prompts to add your domain, which involves verifying ownership by configuring DNS records. For HTTPS, you can secure your custom domain by obtaining an SSL/TLS certificate and binding it to your App Service. Azure provides options like Azure App Service Managed Certificates (free) or third-party certificates. Once the certificate is uploaded and bound to your domain, your application will support HTTPS connections.

### How can I integrate database services like Azure SQL Database or Cosmos DB with my deployed web application?
To integrate Azure database services, provision the desired database (e.g., Azure SQL Database, Cosmos DB) in the Azure Portal or via IaC tools. Obtain the connection string and store it securely in your App Service's application settings under Configuration. Configure necessary firewall rules or virtual network settings to allow connections from your App Service. In your application code, access the connection string from the environment variables and use appropriate client libraries to interact with the database securely and efficiently.



## Conclusion

Congratulations! You've successfully deployed a .NET 8 web application to Azure App Service using GitHub Codespaces and GitHub Actions. This process allows you to develop, test, and deploy applications efficiently, leveraging the power of cloud computing.

Feel free to explore additional Azure services and GitHub Actions to enhance your application's capabilities and deployment pipeline.

