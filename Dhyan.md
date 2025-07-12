# Backend Development Report – ReWear  
**Author:** Dhyan

This document outlines the key challenges faced and milestones achieved during the backend development of **ReWear – Community Clothing Exchange**, a sustainable fashion web application designed for users to swap or donate unused clothing.

---

## 🚧 Challenges Faced

### 1. **Prisma & PostgreSQL Setup**
- Misconfigured `DATABASE_URL` in `.env` file led to early connection errors.
- Required understanding of Prisma schema syntax, relations, and migration flow.
- Initial difficulty in seeding dummy data due to foreign key constraints.

### 2. **Foreign Key Violations**
- Encountered errors when inserting `Item` or `Image` records without valid `userId` or `itemId`.
- Solved by inserting dummy users/items first before establishing relations.

### 3. **Cloudinary Integration**
- Required configuring `Multer` and `Cloudinary` together for file uploads.
- Faced issues with `req.file.path` being undefined until Multer was properly set up.
- Needed a custom route for image upload (`/upload`) and delete with public ID from Cloudinary.

### 4. **Connecting Frontend to Backend**
- Ensuring frontend components (like `ImageUpload`) interact properly with the backend.
- Adjusted the frontend image service to replace base64 local processing with actual Cloudinary uploads.
- Required sending `itemId` dynamically through `FormData` from frontend.

### 5. **UUID & Relationships**
- Prisma models use UUIDs instead of auto-incrementing IDs, requiring explicit UUID management in testing.
- Managing complex relations between models (`User`, `Item`, `Swap`, `SwapRequest`) was a learning curve.

---

## 🏆 What We Achieved

### ✅ Robust Prisma Schema
- Designed and implemented a normalized schema using Prisma ORM.
- Handled all key entities: `User`, `Item`, `ItemImage`, `SwapRequest`, `Swap`, `Admin`.
- Implemented enums for item status and swap methods.

### ✅ Cloud-Based Image Storage
- Integrated Cloudinary to store uploaded item images securely.
- Enabled image deletion via public ID both from the DB and cloud.

### ✅ Full CRUD Operations
- Developed RESTful API endpoints for all models:
  - `GET`, `POST`, `PUT`, `DELETE` for Users, Items, Images, and Swap logic.
- Validated payloads and returned meaningful error responses.

### ✅ Postman Testing Suite
- Tested all endpoints using Postman with real payloads and UUIDs.
- Verified image uploads and relations (e.g., image → item → user) end-to-end.

### ✅ Frontend Integration Ready
- Backend fully supports real-time frontend operations including:
  - Authentication
  - Item addition and image uploads
  - User-specific item management

### ✅ Scalable File Structure
- Modular controller, route, and service-based backend architecture.
- Easy to maintain and extend for future features like notifications, messaging, or analytics.

---

## 🙌 Conclusion

The backend development phase for ReWear equipped me with hands-on experience in:
- Prisma ORM and relational data modeling  
- RESTful API design  
- Cloudinary media handling  
- Error debugging and stateful testing  
- React + Express integration strategy

Despite challenges, the backend is now **fully operational**, **extensible**, and **cloud-integrated**, forming a strong foundation for the complete ReWear platform.
