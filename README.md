# 🍽️ YumVerse API

A scalable REST API for a recipe sharing platform built with Node.js, Express.js, and MongoDB.

## Overview

YumVerse API powers a recipe platform where users can create, manage, review, like, and discover recipes through secure and well-structured endpoints.

This project focuses on backend architecture, authentication, validation, database design, and API security.

## Features

### Authentication

* User registration
* User login
* JWT authentication
* Secure password hashing with bcrypt

### Recipe Management

* Create recipes
* Update recipes
* Delete recipes
* Fetch recipes
* SEO-friendly recipe slugs

### Categories

* Categories
* Subcategories

### Reviews

* Add reviews
* Update reviews
* Delete reviews
* View recipe reviews

### Social Features

* Like recipes
* Follow users
* User profiles

### Security

* JWT protected routes
* Request validation using Joi
* Rate limiting
* Environment variable management
* Error handling middleware

### Media Uploads

* Cloudinary integration
* Multer file uploads

## Tech Stack

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose

### Authentication

* JWT
* bcrypt

### Validation

* Joi

### File Uploads

* Multer
* Cloudinary

### Additional Tools

* Morgan
* Cookie Parser
* Express Rate Limit

## Project Structure

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

## Installation

```bash
git clone <repository-url>

cd server

npm install

npm run dev
```

## Environment Variables

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
```

## API Base URL

```text
/api/v1
```

## Author

Nisarg Vaghela

LinkedIn:
https://www.linkedin.com/in/nisarg3092/
