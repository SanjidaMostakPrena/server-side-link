## 🔥 **What Is Local Food Network?**

Local Food Network is a food review and discovery platform where:

* Users can browse various foods from local restaurants.
* They can write reviews with ratings and descriptions.
* Users can save favorite foods to their profile.
* They can manage their own reviews (edit, delete).
* The platform provides suggestions and a clean UI for an enjoyable experience.

It works similarly to a simplified version of **Foodpanda Review**, **Yelp**, or **Zomato** but focused on local homemade and street foods.

---

# ✨ **Main Features (Full Explanation)**

### 1️⃣ **User Authentication (Email + Google Sign-In)**

The website uses Firebase authentication so users can:

* Register with email and password
* Login securely
* Login using Google account
* Stay logged in automatically
* Logout when needed

This ensures security and personalized experience.

---

### 2️⃣ **Food Display Page**

All foods are fetched from the server and displayed in a responsive grid:

* Food image
* Name
* Price / category (if available)
* Restaurant name
* Location
* Rating
* "Add to Favorites" button

Every food card is beautifully designed and fully responsive.

---

### 3️⃣ **Add Review System**

Users can review any food with:

* Reviewer name
* Email
* Food name
* Restaurant
* Rating
* Review details
* Date

Reviews get stored in MongoDB and appear instantly after submission.

---

### 4️⃣ **Edit & Delete Review**

In **My Reviews** page:

* Users can edit their previous reviews
* They can delete a review
* Toast messages confirm all actions

All interactions update instantly without page reload.

---

### 5️⃣ **Favorite Foods (Wishlist) Feature**

Users can add any food to **My Favorites**.

Favorites page contains:

* Food image
* Food name
* Restaurant
* Location
* Rating
* Remove button

Removing an item updates instantly with toast notifications.

---

### 6️⃣ **Fully Responsive Design (375px, 420px, etc.)**

The website is optimized for all screen sizes:

* Extra small mobile (≤ 375px)
* Small mobile (≤ 420px)
* Tablet
* Laptop
* Desktop

Tables, images, cards, buttons, sliders—all scale perfectly.

---

### 7️⃣ **Modern UI**

The design uses:

* Tailwind CSS
* DaisyUI components
* Smooth hover effects
* Box shadows
* Rounded corners
* Gradient buttons
* Modal dialogs
* Skeleton loaders
* Toast notifications

Every page has a clean, modern, elegant UI.

---

### 8️⃣ **Toastify & React-Hot-Toast Integration**

Toast notifications are used for:

* Login success
* Login error
* Google sign-in
* Review added
* Review updated
* Review deleted
* Add/remove favorite
* Validation warnings
* Cancel actions

You used both **react-toastify** and **react-hot-toast** in different pages.

---

### 9️⃣ **Admin-Friendly API (MongoDB + Node + Express)**

Backend features:

* CRUD operations for foods
* CRUD operations for reviews
* CRUD operations for favorites
* API filtering by user email
* JSON response
* Hosted on Vercel

---

# ⚙️ **Technology Used**

### **Frontend**

* React
* React Router DOM
* Axios
* Tailwind CSS
* DaisyUI
* React Toastify
* React Hot Toast
* React Slick Slider
* Firebase Auth

### **Backend**

* Node.js
* Express.js
* MongoDB (Atlas)
* JWT (optional)
* Vercel Deployment

---


# 🎯 **Goals of the Project**

* Help users discover local foods
* Support local restaurants
* Allow food lovers to share experiences
* Create a simple, interactive, user-friendly food platform
* Build real-world full-stack web development experience.





