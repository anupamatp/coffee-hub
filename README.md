# ☕ Coffee Hub

A modern, full-stack web application designed to streamline coffee shop operations. Coffee Hub provides a seamless experience for customers to browse the menu and place orders, while offering robust, role-based dashboards for Admins, Chefs, and Waiters to manage the restaurant efficiently.

## 🚀 Live Demo
**[Visit Coffee Hub Live](https://anupamatp.github.io/coffee-hub)**

---

## ✨ Features

- **Role-Based Access Control**: Secure login system with distinct dashboards for `ADMIN`, `CUSTOMER`, `CHEF`, and `WAITER`.
- **Menu Management**: Admins can easily add, edit, and remove coffee and food items from the cloud database.
- **Order Processing**: Real-time order status tracking from the kitchen to the customer's table.
- **Dynamic UI**: Beautiful, fully responsive user interface built with modern web standards.
- **Secure Authentication**: Encrypted passwords using BCrypt and secure session management.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React.js
- **Build Tool**: Vite
- **Styling**: Tailwind CSS / Vanilla CSS
- **Routing**: React Router (HashRouter for static hosting)
- **Deployment**: GitHub Pages (Automated via GitHub Actions)

### Backend
- **Framework**: Java Spring Boot 3
- **Security**: Spring Security
- **Database Access**: Spring Data JPA / Hibernate
- **Deployment**: Render (Dockerized native deployment)

### Database
- **Engine**: MySQL 8.0
- **Hosting**: Aiven Cloud
- **Connection Pool**: HikariCP

---

## 🏗️ Cloud Architecture

Coffee Hub is built for the modern web using a decoupled architecture:
1. The **Frontend** is statically hosted on GitHub Pages for blazing-fast global delivery.
2. The **Backend API** runs securely inside a Docker container on Render.
3. The **Database** is a managed MySQL instance running on Aiven Cloud, ensuring high availability and secure SSL connections.

---

## 💻 Running Locally

If you wish to run the project locally on your machine for development:

### Prerequisites
- Node.js & npm
- Java Development Kit (JDK 17+)
- Maven

### Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/anupamatp/coffee-hub.git
   cd coffee-hub
   ```

2. **Run the Backend (Spring Boot):**
   ```bash
   cd backend/cod
   # You must provide your Aiven database password as an environment variable
   export DB_PASSWORD=your_password_here
   ./mvnw spring-boot:run
   ```

3. **Run the Frontend (React/Vite):**
   Open a new terminal window:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **View the App:**
   Open your browser and navigate to `http://localhost:5173`.
