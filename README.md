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

## Clone the Repository

```bash
git clone https://github.com/yourusername/intro-to-azure-1.git
cd intro-to-azure-1
```

## Building the solution
1. Day 1  [Link](./day1.md)
    - Build the web app in Codespaces
    - Create an Web App
    - Create a Github Action to deploy your app to Azure

2. Day 2 [Link](./day2.md)
    - Build API1 in codespaces
    - Create an Azure Function
    - Test Deploy manually
    - Create a Github Action to deploy your azure function
    - Build API2 in codespaces
    - Create an Azure Function, Azure Container Registry, Azure Container App
    - Create a Github Aciton to deploy the Azure Function as a container 

## Understanding Key Concepts

For those new to Azure or certain cloud concepts, embarking on this journey isn't just about learning cloud services; it's about transforming the way you think about engineering solutions. You're automating the mundane to focus on innovation, turning infrastructure into agile code, and deploying applications

### Continuous Integration and Deployment (CI/CD)

**What It Is:**

- **Continuous Integration (CI):** An automated process where code changes from multiple developers are regularly merged into a central repository, triggering automated builds and tests.

- **Continuous Deployment (CD):** The next step where code that has passed the CI phase is automatically deployed to production environments.

**Why It Matters:**

- **Accelerates Delivery:** Speeds up the release of new features and fixes, keeping you ahead in a competitive landscape.

- **Enhances Quality:** Automated testing catches issues early, reducing bugs in production.

- **Boosts Collaboration:** Encourages frequent code integration, minimizing merge conflicts and integration hell.

Imagine a scenario where a team of developers continuously merges their code, runs automated tests, and deploys features in rapid succession—all without bottlenecks or conflicts. This is the essence of Continuous Integration and Continuous Deployment (CI/CD). From a cost optimization perspective, CI/CD pipelines let you automate builds and tests, reducing the time and resources spent on manual processes. Performance improves as problems are caught and resolved early, thanks to immediate feedback from automated testing. Security is strengthened by integrating best-practice checks directly into the pipeline—ensuring vulnerabilities are flagged and fixed before reaching production. Finally, operations become more streamlined because infrastructure changes and rollbacks are handled automatically, minimizing downtime and human error. Essentially, CI/CD helps engineers new to Azure deliver software faster, more reliably, and with greater confidence—freeing you up to focus on innovation rather than firefighting.


### Azure App Service

**What It Is:**

- A fully managed Platform as a Service (PaaS) offering for building, deploying, and scaling web apps, mobile backends, and RESTful APIs.

**Why It Matters:**

- **No Infrastructure Hassles:** Focus on your application code while Azure handles the servers, load balancing, and OS patches.

- **Scalability on Demand:** Automatically scale up or out based on traffic without manual intervention.

- **Multiple Language Support:** Build in your preferred language—.NET, Java, Node.js, PHP, Python, or Ruby.

Azure App Service is a fully managed Platform as a Service (PaaS) solution designed to help you build, deploy, and scale web applications without worrying about the underlying servers. By offloading tasks like server maintenance, patching, and load balancing to Azure, you optimize costs by paying only for the resources you actually need—freeing you from the expense of managing fixed infrastructure. Performance is enhanced through features like automatic scaling, which manages sudden traffic spikes by adjusting compute resources on the fly. By leveraging built-in security capabilities such as tighter integration with Azure Active Directory and managed identities, you ensure your applications follow best practices without introducing complexity for developers. Additionally, operations become simpler because monitoring, metrics, and logging are automatically embedded into the service, allowing you to quickly diagnose and resolve issues. The overall goal is to let you focus on writing great code while Azure handles the infrastructure heavy lifting, ensuring a more efficient and secure development process.

### Azure Functions

**What It Is:**
- A serverless compute service that allows you to run small pieces of code (functions) without worrying about the underlying infrastructure.

**Why It Matters:**

- **Cost-Effective:** Pay only when your code is running, ideal for intermittent workloads.

- **Rapid Development:** Quickly deploy functions using triggers like HTTP requests, timers, or messages from other Azure services.

- **Simplified Architecture:** Break down applications into discrete, manageable functions that are easier to develop and maintain.

Picture having a personal assistant who shows up only when needed, does the work, and then disappears until called upon again—this is essentially what Azure Functions offers for software development. By running code only in response to specific triggers, you optimize costs because you’re charged only for the compute resources actually used, rather than paying for idle servers. Performance benefits come from the ability to scale automatically in response to demand, handling spikes in workloads without manual intervention. Security is strengthened by integrating seamlessly with other Azure services and using managed identities, removing the need for hardcoded credentials. From an operations standpoint, you reduce overhead since Azure takes care of infrastructure management, updates, and monitoring—allowing developers to focus on building and deploying code quickly and efficiently.

### Infrastructure as Code (IaC)

**What It Is:**
- The practice of managing and provisioning infrastructure through machine-readable definition files, rather than physical hardware configuration or interactive configuration tools.

**Why It Matters:**

- **Consistency and Repeatability:** Deploy identical environments across development, testing, and production.

- **Version Control and Collaboration:** Treat infrastructure definitions like application code—track changes, roll back when necessary, and collaborate seamlessly.

- **Automation and Efficiency:** Reduce manual errors and save time by automating infrastructure setups and updates.

Think of Infrastructure as Code (IaC) as having a blueprint for the resources your application uses. You can rebuild anywhere, anytime, exactly the same, simply by following the blueprint. IaC helps you define and manage your cloud resources in a machine-readable format, allowing you to provision environments consistently without extensive manual intervention. Velocity is improved by automating repeatable deployments that quickly scale to meet demand. Security benefits arise from using version-controlled templates and standard configurations, which reduce the risk of misconfigurations and vulnerabilities. Operations become more streamlined as IaC lets you track changes, roll back easily, and rapidly spin up or tear down environments. Ultimately, the goal of IaC is to treat your infrastructure just like application code—fully automated, consistently repeatable, and tightly integrated into your development lifecycle to help you build, deploy, and maintain software more efficiently.

### Managed Identity

**What It Is:**

- Managed Identity is an Azure Active Directory (AAD) feature that provides an automatically managed identity for applications and services to use when connecting to Azure resources.

- It eliminates the need for developers to manage credentials in their code or configuration files.

**Why It Matters:**
- Enhances Security:

    - No Hardcoded Credentials: Removes the necessity of embedding usernames, passwords, or secret keys within your application code or configuration files, which can be a significant security risk if the code is exposed.

    - Automatic Credential Management: Azure handles the rotation and protection of credentials, reducing the potential for human error.

- **Simplifies Authentication Between Azure Services:**

    - Seamless Integration: Allows your applications to authenticate to any service that supports Azure AD authentication, like Azure Key Vault, Azure Storage, and Azure SQL Database.

    - Reduces Complexity: By abstracting away the authentication flow, you can focus on developing features rather than handling authentication mechanics.

#### Deep Dive: How Managed Identity Works ####
**Types of Managed Identities:**

- **System-Assigned Managed Identity:**

    - Enabled directly on an Azure service instance like a Virtual Machine or App Service.

    - The identity is tied to the lifecycle of that service. When the service is deleted, the identity is also deleted.

- **User-Assigned Managed Identity:**

    - Created as a standalone Azure resource.

    - Can be assigned to multiple Azure services.

    - Lives independently of the services, allowing for more flexible identity management.

- **Authentication Flow:**

    - Your application requests a token from the Azure Instance Metadata Service (IMDS).

    - IMDS verifies the application's identity and provides a time-limited access token.

    - The application uses this token to authenticate to Azure services, gaining access based on assigned permissions.

### A Deeper Dive with Real-World Scenarios ###
- **Scenario 1: Rapid Scaling E-Commerce Platform**

    - Challenge: Unexpected traffic spikes during promotions.

    - Solution: Use Azure App Service with auto-scaling and deploy updates via CI/CD to handle increased loads efficiently.

    - Benefit: Zero downtime during peaks, maintaining customer satisfaction.

- **Scenario 2: Event-Driven Data Processing**

    - Challenge: Processing large datasets uploaded at random intervals.

    - Solution: Implement Azure Functions triggered by storage events to process data on arrival.

    - Benefit: Cost savings by only consuming resources when processing occurs.

- **Scenario 3: Consistent Multi-Environment Deployments**

    - Challenge: "It works on my machine" syndrome causing deployment issues.

    - Solution: Adopt Infrastructure as Code to define and deploy identical environments across dev/test/prod.

    - Benefit: Streamlined deployments, reduced configuration drift, and faster time-to-market.

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
