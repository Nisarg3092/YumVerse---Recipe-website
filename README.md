# 🍽️ YumVerse API

A scalable REST API for a recipe sharing platform built with Node.js, Express.js, and MongoDB.

---

## 🌐 Live Demo

### API Base URL

https://yumverse-api.onrender.com/api/v1

### Live Health Check

https://yumverse-api.onrender.com/api/v1

### GitHub Repository

https://github.com/Nisarg3092/YumVerse---Recipe-website

---

## 🚀 Highlights

* RESTful API Architecture
* JWT Authentication & Authorization
* Refresh Token Mechanism
* Password Reset Workflow
* MongoDB Database Design
* Cloudinary Media Storage
* Request Validation using Joi
* Express Rate Limiting
* Error Handling Middleware
* Production Deployment on Render
* Automated API Testing with Postman

---

## 📖 Overview

YumVerse API powers a recipe-sharing platform where users can create, manage, review, like, and discover recipes through secure and well-structured endpoints.

The project focuses on backend architecture, authentication, validation, security, database design, and scalable API development.

---

## ✨ Features

### 🔐 Authentication

* User Registration
* User Login
* User Logout
* JWT Authentication
* Refresh Token System
* Password Hashing with bcrypt
* Forgot Password
* Reset Password

### 🍲 Recipe Management

* Create Recipes
* Update Recipes
* Delete Recipes
* Fetch Recipes
* SEO-Friendly Recipe Slugs
* Recipe Image Uploads

### 🗂 Categories & Subcategories

* Retrieve Categories
* Retrieve Subcategories
* Category-Based Recipe Organization

### ⭐ Reviews

* Add Reviews
* Update Reviews
* Delete Reviews
* View Recipe Reviews

### 👥 Social Features

* Like Recipes
* Unlike Recipes
* Follow Users
* Unfollow Users
* User Profiles

### 🛡 Security

* JWT Protected Routes
* Request Validation using Joi
* Express Rate Limiting
* Environment Variable Management
* Centralized Error Handling

### 📸 Media Uploads

* Multer File Uploads
* Cloudinary Integration
* Cloud-Based Image Storage

---

## 🛠 Tech Stack

### Backend

* Node.js
* Express.js

### Database

* MongoDB Atlas
* Mongoose

### Authentication

* JWT
* bcrypt

### Validation

* Joi

### Media Storage

* Multer
* Cloudinary

### Additional Tools

* Morgan
* Cookie Parser
* Express Rate Limit
* Nodemailer

---

## 📂 Project Structure

```text
src/
├── controllers/
├── db/
├── middlewares/
├── models/
├── routes/
├── template/
├── utils/
├── validators/
├── app.js
└── index.js
```

---

## ⚙️ Installation

```bash
git clone https://github.com/Nisarg3092/YumVerse---Recipe-website.git

cd server

npm install

npm run dev
```

---

## 🔑 Environment Variables

Create a `.env` file:

```env
PORT=

MONGODB_URI=

ACCESS_TOKEN_SECRET=
ACCESS_TOKEN_EXPIRY=

REFRESH_TOKEN_SECRET=
REFRESH_TOKEN_EXPIRY=

CORS_ORIGIN=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

EMAIL_USER=
EMAIL_PASS=
```

---

## 📬 API Testing

The API can be tested using Postman.

The provided collection includes automated workflows and dynamic variables that reduce manual testing effort.

### Collection Variables

* EMAIL
* USERNAME
* USER_ID
* CATEGORY_ID
* SUB_CATEGORY_ID
* RECIPE_ID
* REVIEW_ID
* RESET_TOKEN

### Included Workflows

* User Registration
* User Authentication
* Password Reset
* Recipe Management
* Review Management
* Like & Unlike Recipes
* Follow & Unfollow Users
* Category & Subcategory Retrieval

---

## 🚀 Deployment

The API is deployed using:

* Render Web Service
* MongoDB Atlas
* Cloudinary
* Gmail SMTP

---

## 📈 Future Improvements

* Swagger / OpenAPI Documentation
* Email Verification System
* React Frontend Application
* Advanced Search & Filtering
* Recipe Bookmarking
* Admin Dashboard

---

## 👨‍💻 Author

### Nisarg Vaghela

LinkedIn:
https://www.linkedin.com/in/nisarg3092/

GitHub:
https://github.com/Nisarg3092
