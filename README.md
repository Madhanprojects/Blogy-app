# Blogy - Blogging Platform with Secure Email Verification

## Overview

Blogy is a full-stack blogging platform that allows users to create, manage, and share blog posts. The application includes secure authentication, OTP-based email verification, image uploads, and user session management.

## Features

* User Registration and Login
* OTP-based Email Verification
* Secure Authentication
* Blog Creation and Management
* Image Upload Support
* Session Management
* Responsive User Interface
* Cloud Deployment

## Tech Stack

### Frontend

* HTML
* CSS
* Bootstrap
* EJS

### Backend

* Node.js
* Express.js

### Database

* MongoDB

### Services

* Cloudinary (Image Storage)
* Gmail API (OTP Email Service)
* Google OAuth2 Authentication

## Email Verification System

One of the key features of this project is the OTP-based email verification system.

### Workflow

1. User enters email address.
2. Server generates a secure OTP.
3. Gmail API sends the OTP to the user's inbox.
4. User enters the OTP.
5. Account is verified after successful validation.

### Why Gmail API?

Initially, SMTP-based email delivery was explored, but cloud deployment environments may encounter SMTP connectivity limitations. The application now uses the Gmail API with OAuth2 authentication, allowing emails to be sent securely over HTTPS without relying on SMTP ports.

## Installation

```bash
git clone <repository-url>
cd Blogy
npm install
```

## Environment Variables

Create a `.env` file and configure:

```env
MONGO_URL=
SESSION_SECRET=

CLIENT_ID=
CLIENT_SECRET=
REFRESH_TOKEN=
EMAIL=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

## Run Locally

```bash
npm start
```

Visit:

```text
http://localhost:3000
```

## Deployment

The application is deployed using Render and uses the Gmail API for production email delivery.

## Future Enhancements

* Password Reset via Email
* Rich Text Editor
* User Profiles
* Blog Categories
* Search and Filtering
* AI-assisted Content Generation

## Author

Madhan Bandi
