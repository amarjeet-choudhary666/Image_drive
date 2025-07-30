FRONTNED RUN COMMAND :-
npm run dev

BACKEND COMMAND:-
npm run dev

vercel deployed frontend link :- [https://image-drive-1yma.vercel.app/login](https://vercel.com/amarjeet-choudhary666s-projects/image-drive-1yma) 

credentials:-
email: amarjeetchoudhary647@gmail.com,
password:- manishbhai


# 🗂️ NestDrive – A Google Drive Inspired File Manager

A full-stack web application that allows users to register, create nested folders, upload and search images by name. Users have their own private storage area and can only view the content they have uploaded.

---

## 🚀 Features

- 🔐 **User Authentication**  
  - Signup, Login, Logout (JWT-based)
  - Password hashing using `bcrypt`
  - Session and token management

- 📁 **Nested Folder Structure**  
  - Create folders and subfolders similar to Google Drive
  - Maintain parent-child hierarchy in MongoDB

- 🖼️ **Image Uploading**  
  - Upload image files with a custom name
  - Each image belongs to a specific folder

- 🔍 **Search Functionality**  
  - Search images by name (case-insensitive)
  - Only searches within the user's own files

- 👤 **User-specific Access Control**  
  - Users can only access their own folders and images
  - Each document (folder/image) is associated with a user ID

---

## 🛠️ Tech Stack

| Layer      | Technology |
|------------|------------|
| Frontend   | ReactJS (Vite or CRA) |
| Backend    | Node.js + Express |
| Database   | MongoDB (Mongoose) |
| Auth       | JWT (access + refresh tokens) |
| File Upload | Multer / Cloudinary (optional) |

---


