# AI Resume Analyzer & Builder

An AI-powered platform designed to help students and job seekers automatically analyze their resumes against target job descriptions for ATS (Applicant Tracking System) compatibility, missing skills, and overall structure. It also includes an AI Resume Builder to craft new ATS-friendly templates directly in the browser.

## Features
- **User Authentication:** Secure JWT-based registration and login system.
- **Resume Uploading:** Support for native `.pdf` and `.docx` file parsing using Apache PDFBox and Apache POI.
- **AI Scoring & Analysis:** Integrates seamlessly with Google Gemini AI to generate a 0-100 ATS Score, evaluate matching keywords from a Job Description, and provide point-by-point improvement suggestions.
- **Interactive Resume Builder:** Clean UI for editing an A4 styled resume that dynamically updates. Features AI-powered "bullet point rewriting" suggestions.
- **Export to PDF:** Native print-to-PDF styles built-in for the Resume Builder workspace.

## Tech Stack
- **Frontend Layer:** React.js, Tailwind CSS, Vite
- **Backend Layer:** Java 17, Spring Boot, Spring Security, JWT 
- **Database:** MySQL
- **AI Integration:** OpenAI REST API (gpt-4o-mini)

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js & npm (v18+)
- Java JDK 17
- Maven
- MySQL Server (running on port 3306)

### 1. Database Configuration
1. Open your MySQL client and ensure you have a database schema available. By default, Spring Boot will create it if your permissions allow.
2. The default credentials in `backend/src/main/resources/application.properties` are set to username `root` and password `root`. Update these lines if your local local MySQL setup is different.
```properties
spring.datasource.username=root
spring.datasource.password=root
```

### 2. Backend Setup
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. **Add your OpenAI API Key:** Open `src/main/resources/application.properties` and add your real OpenAI API Key:
   ```properties
   openai.api.key=YOUR_ACTUAL_API_KEY
   ```
3. Build and run the Spring Boot application (ensure MySQL is running):
   - **Using Maven Wrapper (Windows):** `mvn spring-boot:run`
   - **Using Maven Wrapper (Mac/Linux):** `./mvnw spring-boot:run`
   - **Using Maven explicitly:** `mvn spring-boot:run`
4. The backend API will start on `http://localhost:8080`.

### 3. Frontend Setup
1. Open a new terminal window and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the Node modules:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. The React app will launch at `http://localhost:5173`. Open this URL in your browser.

---

## Project Structure
```
Resume Analyzer/
├── backend/
│   ├── src/main/java/com/resume/analyzer/
│   │   ├── config/          # Spring config
│   │   ├── controller/      # API Endpoints (Auth, Resume, Analysis)
│   │   ├── entity/          # JPA DB Models
│   │   ├── payload/         # Request/Response DTOs
│   │   ├── repository/      # Spring Data Repositories
│   │   ├── security/        # JWT & Authentication Filters
│   │   └── service/         # Document Parsing & Gemini API integration
│   └── pom.xml
│
└── frontend/
    ├── src/
    │   ├── components/      # Reusable UI (Analysis UI, Resume Template)
    │   ├── pages/           # Views (Login, Dashboard, Builder)
    │   └── services/        # Axios API wrapper functions
    ├── index.html
    └── tailwind.config.js
```
