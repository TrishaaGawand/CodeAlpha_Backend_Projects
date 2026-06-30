# CodeAlpha Backend Projects

![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![Express](https://img.shields.io/badge/Express-4.x-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-8.x-brightgreen)
![React](https://img.shields.io/badge/React-18.x-cyan)

## 📌 Overview

This repository contains **two backend development projects** completed during my internship at **CodeAlpha**. Both projects demonstrate my skills in building robust backend systems using the MERN stack.

---

## 📋 Projects

### 1. Event Registration System 🎫

**Description:** A full-stack event registration system where users can register for events and organizers can manage them.

**Tech Stack:** MERN (MongoDB, Express.js, React, Node.js)

**Features:**
- ✅ User Authentication (JWT + Cookies)
- ✅ Role-based Access (Attendee/Organizer)
- ✅ Create, View, Edit, Delete Events
- ✅ Register for Events
- ✅ View and Cancel Registrations
- ✅ Admin Panel for Organizers
- ✅ Seat Management

**Folder:** `/EventRegistrationSystem`

---

### 2. URL Shortener 🔗

**Description:** A URL shortening service that converts long URLs into short, shareable links with click tracking.

**Tech Stack:** Node.js, Express.js, MongoDB

**Features:**
- ✅ Shorten Long URLs
- ✅ Custom Short Codes
- ✅ Redirect to Original URL
- ✅ Click Tracking
- ✅ Analytics Dashboard

**Folder:** `/URLShortener`

---

## 🚀 How to Run

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

---

### 1. Event Registration System 🎫

```bash
# Backend
cd EventRegistrationSystem/backend
npm install
npm run dev

# Frontend (in a new terminal)
cd EventRegistrationSystem/frontend
npm install
npm start

```

### 2. Simple URL Shortner 🎫

```bash
# Backend
cd URLShortener/backend
npm install
npm run dev

# Frontend (in a new terminal)
cd URLShortener/frontend
npm install
npm start
