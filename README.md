# IssueFlow - Full-Stack Issue Tracker

A robust, full-stack web application designed to streamline issue and task management through complete CRUD (Create, Read, Update, Delete) functionalities. This repository contains both the client-side and server-side codebases, cleanly separated to maintain a scalable architecture. 

The application provides a seamless user experience for tracking project bugs and tasks, featuring secure user authentication, dynamic status filtering, and a high-performance, modern user interface.

## Tech Stack Overview

**Frontend (`/client`)**
* **Core:** React, Vite.js
* **UI & Styling:** Tailwind CSS, Shadcn/UI (Nova preset for high-density, professional layouts)
* **State Management:** Zustand for efficient, boilerplate-free state handling

**Backend (`/server`)**
* **Core:** Node.js, Express.js (ES Modules)
* **Database:** MongoDB with Mongoose ODM (Flexible schema for optional issue fields)
* **Security:** JSON Web Tokens (JWT) for secure, stateless user authentication and bcrypt for password hashing.

**Deployment**
* Hosted dynamically on AWS EC2.
