# Odoo Hackathon - Fleet Management System

A comprehensive Fleet Management System built during the Odoo Hackathon. This application allows users to manage vehicles, drivers, trips, maintenance, and expenses in an integrated dashboard.

## 🚀 Features

- **User Authentication**: Secure Login and Registration system with **Role-Based Access Control (RBAC)**. Supported roles include:
    - **Manager**: Full access to all fleet operations and analytics.
    - **Dispatcher**: Managed trips, drivers, and vehicles.
    - **Safety Officer**: Focuses on driver management, vehicles, and maintenance.
    - **Financial Analyst**: Access to expenses, analytics, and vehicle data.
- **Admin Dashboard**: Overview of fleet status, active trips, and pending maintenance.
- **Vehicle Registry**: Complete lifecycle management of vehicles (CRUD).
- **Driver Profiles**: Manage driver information, assignments, and availability.
- **Trip Dispatcher**: Schedule and track trips, assigning drivers and vehicles.
- **Maintenance Logs**: Track vehicle service history and upcoming maintenance tasks.
- **Expense Tracking**: Log and categorize fuel, repair, and other operational costs.
- **Analytics**: Visual representation of fleet performance and costs.
- **User Management**: Admin capability to manage system users.

## 🛠️ Tech Stack

### Frontend
- **React**: Modern UI library for building interactive components.
- **Vite**: Fast build tool and development server.
- **React Router**: Client-side routing for seamless navigation.
- **Axios**: HTTP client for API communication.
- **Lucide React**: Beautiful and consistent iconography.
- **CSS3**: Custom styles with a focus on premium aesthetics.

### Backend
- **Node.js**: JavaScript runtime for the server.
- **Express**: Fast and minimalist web framework.
- **MongoDB**: NoSQL database for flexible data storage.
- **Mongoose**: Elegant MongoDB object modeling.
- **dotenv**: Environment variable management.
- **CORS**: Cross-Origin Resource Sharing middleware.

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) (v16.x or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local instance or Atlas URI)

## ⚙️ Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd OdooHackthon
   ```

2. **Backend Setup**:
   - Navigate to the backend directory:
     ```bash
     cd backend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Create a `.env` file in the `backend` folder and add your configuration:
     ```env
     PORT=5000
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     ```

3. **Frontend Setup**:
   - Navigate to the frontend directory:
     ```bash
     cd ../frontend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```

4. **Root Setup**:
   - Return to the root directory and install `concurrently`:
     ```bash
     cd ..
     npm install
     ```

## 🏃 Running the Application

You can run both the frontend and backend simultaneously from the root directory:

```bash
npm run dev
```

- **Frontend**: Runs on [http://localhost:5173](http://localhost:5173)
- **Backend API**: Runs on [http://localhost:5000](http://localhost:5000)

## 📁 Project Structure

```text
OdooHackthon/
├── backend/            # Express server and MongoDB models
│   ├── models/         # Mongoose schemas
│   ├── routes/         # API endpoints
│   ├── server.js       # Entry point
│   └── .env            # Environment variables
├── frontend/           # React application
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Main application views
│   │   ├── App.jsx     # Main routing logic
│   │   └── main.jsx    # Entry point
│   └── vite.config.js  # Vite configuration
└── package.json        # Root package file for managing both ends
```

## 📜 License

This project is licensed under the MIT License.
