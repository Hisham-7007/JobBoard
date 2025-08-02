# Job Board - Full Stack Application

A modern job board platform built with Next.js, Express.js, and MongoDB. This application allows job seekers to browse and apply for jobs while providing administrators with tools to manage job postings and applications.

## 🚀 Features

### For Job Seekers

- **User Registration & Authentication**: Secure signup/login with JWT
- **Job Browsing**: Search and filter jobs by location, type, and experience level
- **Job Applications**: Apply with resume and cover letter
- **Application Tracking**: Monitor application status and history
- **Responsive Design**: Works seamlessly on desktop and mobile

### For Administrators

- **Admin Dashboard**: Comprehensive overview of platform activity
- **Job Management**: Create, edit, and delete job postings
- **Application Review**: View and manage all job applications
- **User Management**: Monitor registered users and their activity

## 🛠️ Tech Stack

### Frontend

- **Next.js 14** - React framework with App Router
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern UI component library
- **TypeScript** - Type-safe JavaScript

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing

## 📦 Installation

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   \`\`\`bash
   cd backend
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Create environment file:
   \`\`\`bash
   cp .env.example .env
   \`\`\`

4. Update the \`.env\` file with your configuration:
   \`\`\`env
   MONGODB_URI=mongodb://localhost:27017/jobboard
   JWT_SECRET=your_super_secret_jwt_key_here
   PORT=5000
   NODE_ENV=development
   \`\`\`

5. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

### Frontend Setup

1. Navigate to the frontend directory (root):
   \`\`\`bash
   cd ../
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Create environment file:
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`

4. Update the \`.env.local\` file:
   \`\`\`env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   \`\`\`

5. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

## 🚀 Usage

1. **Access the Application**:

   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

2. **Create Admin Account**:

   - Register with role set to "admin"
   - Use admin account to create job postings

3. **Job Seeker Flow**:
   - Register as a job seeker
   - Browse available jobs
   - Apply for positions
   - Track application status

## 📱 API Endpoints

### Authentication

- \`POST /api/auth/register\` - User registration
- \`POST /api/auth/login\` - User login
- \`GET /api/auth/me\` - Get current user

### Jobs

- \`GET /api/jobs\` - Get all jobs (with filters)
- \`GET /api/jobs/:id\` - Get single job
- \`POST /api/jobs\` - Create job (admin only)
- \`PUT /api/jobs/:id\` - Update job (admin only)
- \`DELETE /api/jobs/:id\` - Delete job (admin only)

### Applications

- \`POST /api/applications\` - Submit application
- \`GET /api/applications/my-applications\` - Get user applications
- \`GET /api/applications\` - Get all applications (admin only)
- \`PUT /api/applications/:id/status\` - Update application status (admin only)

### Users

- \`GET /api/users\` - Get all users (admin only)
- \`GET /api/users/stats\` - Get user statistics (admin only)

## 🔒 Security Features

- **Password Hashing**: bcrypt for secure password storage
- **JWT Authentication**: Stateless authentication tokens
- **Role-Based Access Control**: Admin and job seeker permissions
- **Input Validation**: Server-side validation with express-validator
- **CORS Protection**: Cross-origin request handling

## 🎨 UI/UX Features

- **Responsive Design**: Mobile-first approach
- **Dark Mode Support**: Built-in theme switching
- **Loading States**: Skeleton loaders and spinners
- **Error Handling**: User-friendly error messages
- **Toast Notifications**: Success and error feedback
- **Accessibility**: ARIA labels and keyboard navigation

## 📊 Database Schema

### User Model

- name, email, password (hashed)
- role (job_seeker | admin)
- phone, location, skills, experience
- timestamps

### Job Model

- title, company, description, requirements
- location, type, experience level
- salary range, skills, status
- postedBy (User reference)
- timestamps

### Application Model

- job (Job reference)
- applicant (User reference)
- resume, coverLetter, status
- notes (admin use)
- timestamps

## 🚀 Deployment

### Backend Deployment

1. Set production environment variables
2. Deploy to platforms like Heroku, Railway, or DigitalOcean
3. Ensure MongoDB connection is configured

### Frontend Deployment

1. Update \`NEXT_PUBLIC_API_URL\` to production API URL
2. Deploy to Vercel, Netlify, or similar platforms
3. Configure environment variables in deployment platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: \`git checkout -b feature/new-feature\`
3. Commit changes: \`git commit -am 'Add new feature'\`
4. Push to branch: \`git push origin feature/new-feature\`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with modern web technologies
- UI components from shadcn/ui
- Icons from Lucide React
- Styling with Tailwind CSS
