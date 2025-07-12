# Backend Development Report – ReWear  
**Author:** Dhyan

This document outlines my contributions, challenges faced, how I resolved them, and the final outcomes during backend development of **ReWear – Community Clothing Exchange**, a platform designed to promote sustainable fashion through community-based clothing exchange.

---

## 🧑‍💻 My Contributions

As the backend developer, I was responsible for:

- Designing the database schema using **Prisma ORM**.
- Setting up and managing the **PostgreSQL** database.
- Building **RESTful CRUD APIs** for all core entities: `User`, `Item`, `Image`, `SwapRequest`, `Swap`, and `Admin`.
- Integrating **Cloudinary** to handle secure item image uploads and deletions.
- Creating **Postman collections** to test APIs end-to-end.
- Collaborating with frontend to ensure smooth integration and flow.

---

## 🚧 Challenges Faced & How I Solved Them

### 1. **Prisma Setup & Environment Variables**
**Problem:**  
Initial errors due to incorrect `DATABASE_URL` in `.env` and missing Prisma client.

**Solution:**  
Corrected the `.env` format, ran `npx prisma generate`, and verified connection with `npx prisma studio`.

**Outcome:**  
Prisma client initialized successfully and was able to connect and query the PostgreSQL database.

---

### 2. **Foreign Key Constraint Violations**
**Problem:**  
Could not insert `Item` or `ItemImage` due to missing `userId` or `itemId`.

**Solution:**  
Created dummy users and items beforehand to ensure all references were valid. Used UUIDs generated in Postman.

**Outcome:**  
All records could be inserted and linked properly, enabling full CRUD operations on all models.

---

### 3. **Cloudinary Image Upload Integration**
**Problem:**  
`req.file.path` was returning undefined during image uploads.

**Solution:**  
- Set up `Multer` with custom `Cloudinary` storage engine.  
- Verified the middleware order in Express router.  
- Added proper key in `FormData` as `image` when uploading from frontend.

**Outcome:**  
Image uploads now store `imageUrl` and `publicId` in Cloudinary and PostgreSQL seamlessly. Deletion also works both in DB and cloud.

---

### 4. **Postman Testing with UUIDs**
**Problem:**  
Hard to manage relations with UUIDs and test dependent routes.

**Solution:**  
Manually inserted dummy data in proper order:
1. Create User → 2. Create Item with `userId` → 3. Upload Image with `itemId`.

**Outcome:**  
Postman tests ran successfully and covered all edge cases for each CRUD operation.

---

### 5. **Frontend & Backend Integration**
**Problem:**  
ImageUpload component was initially using base64 and not communicating with backend.

**Solution:**  
- Rewrote frontend `ImageService` to use `FormData` and POST to backend `/upload` route.  
- Updated preview logic to match the new cloud-hosted URL.

**Outcome:**  
Image uploads now work in real-time from frontend, displaying Cloudinary-hosted images immediately after successful POST.

---

## 🏆 Achievements & Final Outcome

✅ Designed and implemented a complete **relational database** with `User`, `Item`, `Image`, and `Swap` logic.  
✅ Fully integrated **Cloudinary** with backend and frontend.  
✅ Implemented modular **Express routes and controllers** for clean code organization.  
✅ Verified backend stability using **Postman testing** with realistic UUID-based payloads.  
✅ Enabled smooth **frontend integration** for sign-in, item posting, and image uploads.

---

## 🧩 Skills & Takeaways

- ✅ Hands-on experience with **Prisma ORM** and complex relations.
- ✅ Integration of **cloud-based media storage** with Multer and Cloudinary.
- ✅ Debugging and fixing real-world production-style issues (e.g., FK violations, async errors).
- ✅ Gained deeper understanding of **RESTful API architecture** and deployment preparation.
- ✅ Successfully bridged frontend and backend teams through working, tested endpoints.

---

## 🙌 Conclusion

Despite several real-world development roadblocks, I was able to deliver a **stable**, **scalable**, and **production-ready backend** for ReWear. This backend now forms the foundation of a platform that promotes **sustainable clothing habits** and empowers users to give unused clothing a new life.

