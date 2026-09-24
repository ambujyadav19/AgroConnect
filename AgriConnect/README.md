# AgriConnect - A Comprehensive Solution for Farmers and Customers
**Live Demo:** [AgriConnect](https://agri-connect-017.vercel.app/)

AgriConnect is a web-based platform designed to bridge the gap between farmers and customers by providing a marketplace where farmers can list their products, and customers can place orders directly. The platform also offers various features like a chatbot for farming-related queries, blogs, dashboards, and an order management system.

## Features

- **Marketplace**: Farmers can list their products for sale, and customers can browse and purchase them.
- **Chatbot**: Farmers and Users can ask farming-related questions and receive instant replies from an AI-powered chatbot.
- **Blogs**: Farmers can write blogs about their experiences, farming techniques, and more. Users can read and react to these blogs.
- **Dashboards**: Separate dashboards for farmers and customers to manage orders, products, and profiles.
- **Order Management**: A system to handle and track customer orders efficiently.

## Technologies Used

- **Frontend**: 
  - React.js
  - Tailwind CSS
  - Axios
- **Backend**: 
  - Node.js
  - Express.js
  - MongoDB (with Mongoose)
- **Authentication**: 
  - JWT (JSON Web Tokens) for secure login and authentication.
- **Other Tools**:
  - Bcrypt for password hashing
  - CORS for cross-origin requests
  - Heroicons and Font Awesome for UI icons

## Installation

### Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/) (local or cloud)
- [Git](https://git-scm.com/)

### Steps to Set Up

1. Clone the repository:

   ```bash
   git clone https://github.com/irshad017/AgriConnect.git
2. Navigate to the Project Directory:   
   ```bash
   cd AgriConnect
3. Install dependencies
   ```bash
   # Install frontend dependencies
    cd frontend
    npm install
    
    # Install backend dependencies
    cd backend
    npm install
4.Start the Application:
  ```bash
  # Start the backend server
  cd frontend
  npm run dev
  
  # Start the frontend client
  cd backend
  nodemon api.js



