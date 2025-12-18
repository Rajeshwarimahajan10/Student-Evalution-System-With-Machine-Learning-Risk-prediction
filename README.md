# Student-Evalution-System-With-Machine-Learning-Risk-prediction
A web-based evaluation system integrating ML risk prediction to identify low-performance patterns among students. Features include performance analytics, risk scoring, and faculty evaluation support using Python, Scikit-Learn, and classification models

# Student Evaluation System with ML Risk Prediction

A comprehensive student evaluation system with machine learning-powered risk prediction, featuring separate dashboards for teachers and students with glassical UI design.


## 🚀 Features

### 🔐 Authentication & Authorization
- **Firebase Authentication** with email/password
- **Role-based access control** (Teachers & Students)
- **Authorized user management** (5 teachers, 30 students)
- **Secure login/logout functionality**

### 👨‍🎓 Student Dashboard
- **Personal Overview** with key metrics
- **Subject Performance** tracking
- **Attendance Records** with visual indicators
- **Financial Records** and payment tracking
- **AI Risk Analysis** with personalized recommendations
- **Real-time data updates**

### 👨‍🏫 Teacher Dashboard
- **Comprehensive Student Management**
- **Advanced Analytics** with charts and trends
- **Risk Management** with ML predictions
- **Attendance Management** with bulk actions
- **Student Performance Monitoring**
- **Automated Risk Alerts**

### 🤖 Machine Learning Features
- **Risk Prediction Model** based on:
  - Individual subject exam scores
  - Assignment marks
  - Attendance patterns
- **Risk Level Classification** (Low, Medium, High)
- **Personalized Recommendations**
- **Trend Analysis** and performance tracking
- **Real-time Risk Scoring**

### 🎨 UI/UX Design
- **Glassical Design** with modern glassmorphism effects
- **Responsive Layout** for all devices
- **Interactive Charts** and data visualizations
- **Smooth Animations** and transitions
- **Intuitive Navigation** with sidebar menus
- **Color-coded Risk Indicators**

## 🛠️ Technology Stack

### Frontend
- **Next.js 14** with App Router
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Lucide React** for icons
- **Chart.js** for data visualization

### Backend
- **Next.js API Routes**
- **MySQL** database
- **Firebase Authentication**
- **Custom ML Risk Prediction Model**

### Database Schema
- **Students** table with personal information
- **Teachers** table with authorized users
- **Subjects** table for course management
- **Student_Subjects** for performance tracking
- **Attendance_Records** for attendance management
- **Financial_Records** for fee tracking
- **Risk_Predictions** for ML model storage

## 📋 Prerequisites

- Node.js 18+ 
- MySQL 8.0+
- Firebase project
- npm or yarn package manager

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd student-evaluation-system
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Configuration
Create a `.env.local` file in the root directory:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# MySQL Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=student_evaluation_system
DB_PORT=3306

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here

# Server Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here

# Machine Learning Model Configuration
ML_MODEL_PATH=./models/risk_prediction_model.json
ML_THRESHOLD=0.7
```

### 4. Firebase Setup
1. Create a new Firebase project
2. Enable Authentication with Email/Password
3. Get your Firebase configuration
4. Update the environment variables

### 5. MySQL Database Setup
1. Create a MySQL database named `student_evaluation_system`
2. Update the database credentials in `.env.local`
3. Run the database initialization script

### 6. Dataset CSV File
The project uses a CSV file (`dataset.csv`) located in the root directory to import student data. The CSV file contains all student information including:
- Email addresses
- Student names
- Roll numbers
- Attendance percentage
- Subject-wise marks (assignment marks and exam scores for all 5 subjects)

The CSV file format:
```csv
email,name,roll_no,attendance_percentage,CS301_assignment,CS301_exam,CS302_assignment,CS302_exam,CS303_assignment,CS303_exam,CS304_assignment,CS304_exam,CS305_assignment,CS305_exam
mariabrown@gmail.com,Maria Brown,CS2024001,85.5,88,92,85,89,90,87,82,85,87,91
...
```

**Subject Codes:**
- CS301: Object Oriented Programming
- CS302: Data Structures and Algorithms
- CS303: Deep Learning
- CS304: Machine Learning
- CS305: Operating System

You can modify the `dataset.csv` file to add, remove, or update student records and their marks. The seed script will automatically read from this file and use the actual marks to calculate risk scores.

### 7. Seed Sample Data
```bash
npm run seed
# or
yarn seed
```

This command will:
- Read student data from `dataset.csv` including attendance and subject marks
- Initialize the database tables
- Seed all student records from the CSV file
- Use actual marks from CSV to calculate risk scores (not random values)
- Populate student_subjects table with marks from CSV

### 8. Start the Development Server
```bash
npm run dev
# or
yarn dev
```

Visit `http://localhost:3000` to see the application.

## 👥 Authorized Users

### Teachers (5 authorized accounts)
Add 5 authorized teachers account 

### Students (30 authorized accounts)
- mariabrown@gmail.com
- omarwilliam@gmail.com
- johnsmith@gmail.com
- liambrown@gmail.com
- ahmedjones@gmail.com
- ahmedsmith@gmail.com
- omarsmith@gmail.com
- sarasmith@gmail.com
- johnsmith9@gmail.com
- johndavis@gmail.com
- johnwilliams@gmail.com
- liamwilliams@gmail.com
- mariajones@gmail.com
- liamdavis@gmail.com
- liamjones@gmail.com
- johnjohnson@gmail.com
- emmadavis@gmail.com
- ahmedjones@ugmail.com
- saradavis@gmail.com
- mariawilliams@university.com
- emmajohnson@gmail.com
- sarajohnson@gmail.com
- ahmedbrown@gmail.com
- alijohnson@gmail.com
- mariasmith@gmail.com
- sarawilliams@gmail.com
- ammadavis@gmail.com
- ahmedsmith@ugmail.com
- mariadavis@gmail.com
- aliwilliams@gmail.com

**Default Password for all accounts:** `Pass1234`

## 🎯 Computer Engineering Subjects

The system includes 5 core Computer Engineering subjects:
1. **Object Oriented Programming** (CS301)
2. **Data Structures and Algorithms** (CS302)
3. **Deep Learning** (CS303)
4. **Machine Learning** (CS304)
5. **Operating System** (CS305)

## 🤖 Machine Learning Risk Prediction

### Risk Factors
The ML model considers three primary factors:
1. **Attendance Risk** (40% weight)
2. **Assignment Risk** (30% weight)
3. **Exam Risk** (30% weight)

### Risk Levels
- **Low Risk** (0-30%): Good performance, minimal intervention needed
- **Medium Risk** (30-60%): Moderate performance, monitoring required
- **High Risk** (60-100%): Poor performance, immediate intervention needed

### Recommendations
The system provides personalized recommendations based on risk factors:
- Attendance improvement strategies
- Study material suggestions
- Academic counseling referrals
- Performance monitoring plans

## 📊 Analytics Features

### Student Analytics
- Performance trends over time
- Grade distribution analysis
- Subject-wise performance comparison
- Attendance pattern analysis

### Risk Analytics
- Risk distribution across students
- Risk trend analysis
- Intervention effectiveness tracking
- Predictive risk modeling

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### Students
- `GET /api/students` - Get all students
- `POST /api/students` - Create new student
- `GET /api/students/[id]` - Get student by ID
- `PUT /api/students/[id]` - Update student
- `DELETE /api/students/[id]` - Delete student

### Risk Prediction
- `GET /api/risk-prediction/[id]` - Get risk prediction for student

### Attendance
- `GET /api/attendance` - Get attendance records
- `POST /api/attendance` - Create attendance record

## 🎨 UI Components

### Glassical Design Elements
- **Glass Cards** with backdrop blur effects
- **Gradient Backgrounds** with smooth transitions
- **Transparent Elements** with subtle borders
- **Hover Effects** with smooth animations
- **Color-coded Indicators** for different states

### Responsive Design
- Mobile-first approach
- Flexible grid layouts
- Adaptive navigation
- Touch-friendly interactions

## 🚀 Deployment

### Quick Start (Development)
1. Install dependencies: `npm install`
2. Create `.env.local` (see `.env.local.example`)
3. Setup database: Create MySQL database `student_evaluation_system`
4. Seed database: `npm run seed`
5. Start server: `npm run dev`
6. Open: `http://localhost:3001`

**Windows Users:** Double-click `start-server.bat` for easy startup!

### Production Build
```bash
npm run build
npm start
```

### Environment Variables for Production
Ensure all environment variables are properly set in your production environment.

### Database Migration
Run the database initialization script on your production database.

### Troubleshooting
- **Connection Refused?** Make sure server is running: `npm run dev`
- **Login Error?** Create user accounts in Firebase Console (see `FIREBASE_SETUP.md`)
- **Database Error?** Make sure MySQL is running and database exists

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run seed` - Seed sample data from `dataset.csv` file

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request


## 🔮 Future Enhancements

- Real-time notifications
- Advanced ML models
- Mobile app development
- Integration with external systems
- Advanced reporting features
- Multi-language support

---

