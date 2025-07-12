# 🧠 ReWear ML Module — AI-Powered Clothing Auto-Tagging

This module is a core part of the **ReWear platform**, developed for the **Odoo Hackathon 2025**, focused on promoting sustainable fashion through technology.

It enables automatic detection of clothing categories using AI, allowing users to simply upload an image and have the item type predicted instantly. This reduces friction in listing items, especially for users unfamiliar with fashion taxonomy.

---

## 🎯 Problem Statement

Listing second-hand clothing manually on platforms is time-consuming and inconsistent due to varied user knowledge, language, and formatting.

Our objective was to simplify this with a **lightweight, browser-based ML solution** that:

- Detects clothing type from an image
- Automatically fills the category field in the listing form
- Works without needing server-side compute or API calls

---

## 🧰 My Contribution (ML Component)

I led the entire machine learning pipeline — from data collection to front-end integration — under the `anshu` branch of our repo:  
🔗 [GitHub: Odoo-Hackathon-2025 (anshu branch)](https://github.com/Krishilgithub/Odoo-Hackathon-2025/tree/anshu)

### 📦 1. Dataset Curation

- Curated ~10 clean and representative images per clothing type using:
  - Google Image Search
  - Pinterest
  - Unsplash
  - Recyclable fashion datasets (public domain)
- Cropped/resized images for uniformity
- Labeled and categorized into 10 folders, each representing a class

### 👗 2. Class Labels Used (10 Classes)

These are the clothing categories the model was trained to recognize:

| Class Name       | Description                                |
|------------------|--------------------------------------------|
| T-shirt          | Short-sleeved casual tops                  |
| Shirt            | Formal/informal buttoned shirts            |
| Kurta            | Traditional long Indian tops               |
| Dress            | One-piece garments typically worn by women |
| Jeans            | Denim pants                                |
| Jacket           | Outerwear with zippers/buttons             |
| Skirt            | Lower garment without legs                 |
| Saree            | Draped traditional Indian attire           |
| Sweater/Hoodie   | Warm, long-sleeved tops                    |
| Shorts           | Pants that end above the knees             |

> 📸 Total training images: ~100  
> 🔁 All classes balanced (≈10 images/class)

---

## 🧠 3. Model Training Using Teachable Machine

- **Tool**: [Teachable Machine](https://teachablemachine.withgoogle.com/)
- **Type**: Image Classification
- **Model Architecture**: MobileNet-based (auto-handled by Teachable Machine)
- **Export Type**: TensorFlow.js (for browser deployment)
- **Output Files**:
  - `model.json`
  - `metadata.json`
  - `weights.bin`

Training was iterative — conducted multiple test runs, evaluated predictions on unseen images, and refined the dataset where needed.

---

## 🧩 4. Frontend Integration (TensorFlow.js)

- The trained model was loaded directly in the browser using TensorFlow.js
- Used the `@tensorflow/tfjs` and `@teachablemachine/image` libraries
- Integrated into the “Add New Item” form
- Once an image is uploaded, the model is triggered and returns predictions instantly

✅ Prediction is inserted into the form’s **"Category"** field without user input.

### 🔄 Working Demo Flow

1. User opens the form
2. Uploads a photo of their clothing item
3. AI model runs inference in the browser
4. Predicted clothing type appears in the category dropdown (auto-filled)

---

## 🛠️ Tech Stack

| Layer       | Tool/Library                        |
|-------------|-------------------------------------|
| Training    | Google Teachable Machine            |
| Inference   | TensorFlow.js (Browser Runtime)     |
| Frontend    | HTML, JS, CSS                       |
| Repo        | GitHub (`anshu` branch)             |
| Deployment  | Browser-based, fully client-side    |

---

## 📊 Performance Summary

| Metric               | Value                         |
|----------------------|-------------------------------|
| Avg Prediction Time  | < 1 second (browser-side)     |
| Model Size           | ~10MB                         |
| Accuracy (demo data) | 80–90% (top-1 match)          |
| Classes Supported    | 10                            |

While not production-grade, the model is **accurate enough for hackathon/demo use** and is a strong proof-of-concept for scaling later.

---

## 🔮 Future Enhancements

- 📈 **Larger dataset** with better lighting, angles, and real-world diversity
- 🧵 Multi-label support (e.g., material, occasion, condition)
- 🔁 User feedback loop for continual learning
- 🔍 Support for multiple item detection in a single image
- ⚡️ Convert model to ONNX or TensorFlow Lite for performance boosts on mobile

---

## 🙌 Acknowledgements

- Trained using Google Teachable Machine  
- Inference powered by TensorFlow.js  
- Images collected and prepared manually  
- Entire ML workflow developed by **Anshu Trivedi**  
- Part of the official [ReWear Hackathon Repo](https://github.com/Krishilgithub/Odoo-Hackathon-2025/tree/anshu)

> This work showcases how even low-resource machine learning solutions can provide meaningful user value in real-world platforms — promoting sustainable fashion and ease-of-use.

---
