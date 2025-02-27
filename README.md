# Project

## Intro to Azure - Build Your Own Photo Library

Welcome to the Intro to Azure repository!

This project is your hands-on guide to building a full-fledged photo library using Microsoft Azure. Whether you're new to Azure or looking to deepen your understanding, this project walks you through deploying and connecting various Azure services to create a seamless application.

## Architecture

![image](https://github.com/user-attachments/assets/29f6a1eb-f61b-41da-97c6-73c1d214f8f1)

## What's Inside?
By working through this project, you'll learn how to:

- **Secure Your GitHub Repository and Automate Deployments to Azure**  [link](./SecureTheRepo.md)
  - Set up continuous integration and deployment (CI/CD) so updates are automatically deployed whenever you push changes.
  - Implement security best practices to protect your code and deployment pipeline.

- **Deploy an Azure Web App** [link](./DeployWebApp.md)
  - Host your photo library frontend using Azure App Service.
  - Learn how to scale and manage your web application in the cloud.
  - [intro to App Service](./intro-to-appservice.md)

- **Deploy an Azure Function** [link](./functions.md)
  - Create serverless backend processes with Azure Functions.
  - Handle tasks like image processing or data manipulation without managing servers.
  - [Intro to Azure Functions](./intro-to-functions.md)

- **Set Up Infrastructure as Code (IaC) Pipelines** [link](./iac.md)
  - Automate the deployment of Azure resources using tools like Azure Resource Manager (ARM) templates or Terraform.
  - Embrace DevOps practices by treating infrastructure configurations as code.


### Services You'll Deploy via IaC:

- **Azure Storage Account**
  - Store images and static files securely.
  - Understand different storage types: Blob, Queue, Table, and File.

- **Azure Cosmos DB**
  - Utilize a globally distributed, multi-model database.
  - Store metadata and application data with high availability.

- **Azure Storage Queue**
  - Implement asynchronous message queuing between application components.
  - Enhance scalability and resilience of your application.

- **Azure Cognitive Services - Computer Vision API**
  - Integrate AI capabilities to analyze and process images.
  - Automatically generate tags and descriptions for uploaded photos.

- **Managed Identity**
  - Securely connect Azure services without hardcoding credentials.
  - Simplify authentication across your resources using Azure Active Directory (AD).
 
##

## Getting Started

### Prerequisites

- **Azure Subscription**
  - Sign up for a free Azure account if you don't have one.

- **GitHub Account**
  - You'll need this for source control and setting up CI/CD pipelines.

- **Basic Programming Knowledge**
  - Familiarity with languages like Python, C#, or JavaScript will be helpful.

### Steps to Follow

1. **Clone the Repository**

    ```bash
    git clone https://github.com/yourusername/intro-to-azure-1.git
    cd intro-to-azure-1
    ```

2. **Set Up Continuous Deployment**
    - Link your GitHub repository to Azure.
    - Configure Azure Pipelines or GitHub Actions for automated deployments.

3. **Deploy the Web Application**
    - Use Azure App Service to host your frontend.
    - Follow the documentation to deploy your web app.

4. **Create and Deploy an Azure Function**
    - Develop a function for backend processing.
    - Deploy it using the Azure Functions extension or CLI.

5. **Configure Infrastructure as Code**
    - Use provided ARM templates or Terraform scripts.
    - Deploy all required services consistently and repeatedly.

6. **Implement Managed Identity**
    - Assign managed identities to your services.
    - Eliminate the need for storing secrets in your configuration.

## Understanding Key Concepts

For those new to Azure or certain cloud concepts, here's a breakdown:

### Continuous Integration and Deployment (CI/CD)

**What It Is:**
- Automating the integration of code changes from multiple contributors and deploying them to production.

**Why It Matters:**
- Increases development speed and reliability.
- Reduces manual errors.

### Azure App Service

**What It Is:**
- A fully managed platform for building, deploying, and scaling web apps.

**Why It Matters:**
- Simplifies hosting by handling infrastructure maintenance.

### Azure Functions

**What It Is:**
- A serverless compute service that lets you run code on-demand without provisioning servers.

**Why It Matters:**
- Reduces overhead and lets you focus on code, not infrastructure.

### Infrastructure as Code (IaC)

**What It Is:**
- Managing and provisioning infrastructure through code rather than manual processes.

**Why It Matters:**
- Ensures consistent configurations across environments.
- Enables version control and collaboration on infrastructure setups.

### Managed Identity

**What It Is:**
- An identity in Azure Active Directory automatically managed by Azure.

**Why It Matters:**
- Enhances security by removing hardcoded credentials.
- Simplifies authentication between Azure services.

## Additional Resources

- [Azure Documentation](https://docs.microsoft.com/en-us/azure/)
- [Getting Started with Azure](https://azure.microsoft.com/en-us/get-started/)
- [Azure Functions Guide](https://docs.microsoft.com/en-us/azure/azure-functions/)
- [Learning Paths](https://docs.microsoft.com/en-us/learn/paths/)
- [Azure Fundamentals](https://docs.microsoft.com/en-us/learn/paths/azure-fundamentals/)
- [Community Support](https://learn.microsoft.com/en-us/azure/azure-portal/supportability/how-to-create-azure-support-request/)


Join the Azure Community for discussions and assistance.


## Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.opensource.microsoft.com.

When you submit a pull request, a CLA bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., status check, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

## Trademarks

This project may contain trademarks or logos for projects, products, or services. Authorized use of Microsoft 
trademarks or logos is subject to and must follow 
[Microsoft's Trademark & Brand Guidelines](https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks/usage/general).
Use of Microsoft trademarks or logos in modified versions of this project must not cause confusion or imply Microsoft sponsorship.
Any use of third-party trademarks or logos are subject to those third-party's policies.
