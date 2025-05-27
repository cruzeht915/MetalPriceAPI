# Metal Price Tracker

**Full-Stack Cloud-Native App** | FastAPI · React · MongoDB · AWS · Terraform · Kubernetes · Docker

---

## Project Overview

**Metal Price Tracker** is a full-stack application I built to track live and historical metal prices (e.g., iron, copper, aluminum), let users set **custom SMS alerts**, and manage their own personalized list of metals.

The app is **cloud-native** and fully containerized, designed for scalability and resilience using:

- **Docker** for containerization  
- **Kubernetes** for orchestration  
- **AWS ECS/Fargate, S3, and CloudWatch** for deployment and monitoring  
- **Terraform** for infrastructure as code (IaC)

---

## Key Features

- **User Auth** – Secure JWT-based authentication and authorization
- **Live & Historical Prices** – Updates every 4 hours with querying across date ranges
- **SMS Alerts** – Real-time notifications via Twilio when user-defined thresholds are crossed
- **Personal Metal List** – Users can follow only the metals they care about
- **Scheduled Data Ingestion** – Decoupled ETL pipeline for price scraping

---

## Tech Stack

| Layer        | Tools Used                                                                  |
|--------------|-----------------------------------------------------------------------------|
| **Frontend** | React, Tailwind CSS, Axios, Vercel                                          |
| **Backend**  | FastAPI (Python), JWT, MongoDB Atlas, Uvicorn                               |
| **Alerts**   | Twilio API                                                                  |
| **Infra**    | Docker, Kubernetes, AWS ECS, S3, CloudWatch                                 |
| **IaC**      | Terraform (sets up ECS cluster, IAM roles, MongoDB secrets, etc.)           |
| **CI/CD**    | GitHub Actions (automated builds, tests, and deployment to AWS)             |

---

## Cloud Architecture

- Backend is containerized with **Docker** and deployed to **AWS ECS** behind an **Application Load Balancer**
- **MongoDB Atlas** stores user data, alerts, and time-series price data
- **Terraform** provisions VPC, ECS cluster, IAM roles, and S3 for static storage
- **Kubernetes** (locally or optionally EKS) orchestrates containerized services in a declarative manner
- Periodic background jobs run via **CloudWatch Events** or **Lambda triggers** to fetch and store metal prices every 4 hours

---

## My Contributions

- Built the entire backend API using FastAPI with modular route handling and schema validation
- Containerized both frontend and backend with **Docker** and wrote Kubernetes manifests for local and cloud deployment
- Wrote **Terraform scripts** to manage AWS infrastructure securely and reproducibly
- Designed and deployed a **CI/CD pipeline** using GitHub Actions for seamless testing and deployment
- Integrated **Twilio SMS API** and built a robust, threshold-triggered alert system
- Optimized MongoDB queries for fast historical lookups and scalable storage

---

## Future Work

- ML-powered price trend predictions  
- Admin dashboard and moderation tools  
- Horizontal scaling tests with Kubernetes HPA  
- Enhanced mobile experience with PWA or native app

---

## Demo & Screenshots

> _Include Vercel frontend URL or demo login if possible. Add screenshots here to show key UI pages (alerts, prices, settings)._

---

## Run Locally (Dev Environment)

\`\`\`bash
# Backend
cd backend
docker build -t metal-backend .
docker run -p 8000:8000 metal-backend

# Frontend
cd frontend
npm install
npm run dev
\`\`\`

Or use \`docker-compose\` for full dev stack.

---

## Deploy with Terraform

\`\`\`bash
cd infra
terraform init
terraform apply
\`\`\`

This provisions:
- ECS Fargate cluster with backend container
- S3 bucket (for static or archival usage)
- Secrets in AWS Systems Manager
- IAM roles and policies for access control

---

## License

MIT License
