# Core Use Cases

## Primary Use Cases

1. Application Deployment
   - Deploy web applications from various frameworks (Next.js, Nuxt, Django, etc.)
   - Automatic configuration of routing and load balancing via Traefik
   - Support for multiple programming languages and frameworks
   
2. Database Management
   - Create and manage different types of databases (MySQL, PostgreSQL, MongoDB, etc.)
   - Automated database backups to external storage
   - Database monitoring and maintenance
   
3. Container Orchestration
   - Deploy and manage Docker containers
   - Docker Compose support for complex multi-container applications
   - Container scaling across multiple nodes using Docker Swarm

4. Infrastructure Management
   - Multi-server deployment and management
   - Real-time resource monitoring (CPU, memory, storage, network)
   - Server health checks and notifications

5. Application Templates
   - One-click deployment of popular open-source applications
   - Pre-configured templates for common stacks
   - Custom template creation and sharing

## Typical User Journeys

### Journey 1: Web Developer Deploying a New Application
1. Developer signs up for Dokploy
2. Sets up a new server or connects an existing VPS
3. Creates a new application from their Git repository
4. Configures environment variables and build settings
5. Deploys the application with auto-generated HTTPS
6. Monitors application performance through the dashboard

### Journey 2: DevOps Engineer Managing Multiple Services
1. Engineer installs Dokploy on company infrastructure
2. Sets up multiple nodes for high availability
3. Configures automated backups for critical databases
4. Deploys applications across different environments
5. Sets up monitoring and notification alerts
6. Manages scaling based on resource utilization

### Journey 3: Small Business Owner Using Templates
1. Owner accesses the template marketplace
2. Selects a pre-configured application (e.g., Plausible Analytics)
3. Customizes basic settings and domain
4. Deploys the application to their server
5. Manages updates and backups through the dashboard

### Journey 4: Team Collaboration on Projects
1. Team lead creates organization in Dokploy
2. Invites team members with appropriate permissions
3. Sets up staging and production environments
4. Configures automated deployment pipelines
5. Team members deploy to staging for testing
6. Lead manages production deployments and monitoring