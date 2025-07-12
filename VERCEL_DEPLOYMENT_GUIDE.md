# Vercel Deployment Guide for ReWear

## 🚀 Quick Deployment Steps

### 1. **Prepare Your Project**

- Ensure all code is committed to your Git repository
- Make sure your project builds successfully locally: `npm run build`
- Verify all environment variables are properly configured

### 2. **Deploy to Vercel**

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your Git repository
4. Vercel will auto-detect it's a Vite project
5. Configure build settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
6. Click "Deploy"

---

## 📊 Analytics Setup

### **Google Analytics Setup**

1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new property for your website
3. Get your Measurement ID (format: G-XXXXXXXXXX)
4. Replace `G-XXXXXXXXXX` in `index.html` with your actual Measurement ID
5. Deploy the changes

### **Vercel Analytics Setup**

1. In your Vercel dashboard, go to your project
2. Navigate to "Analytics" tab
3. Enable "Web Analytics" (requires Pro plan)
4. The script is already included in your `index.html`

---

## 🔧 Configuration Files

### **vercel.json** (Already Created)

```json
{
	"buildCommand": "npm run build",
	"outputDirectory": "dist",
	"framework": "vite",
	"rewrites": [
		{
			"source": "/(.*)",
			"destination": "/index.html"
		}
	],
	"headers": [
		{
			"source": "/(.*)",
			"headers": [
				{
					"key": "X-Content-Type-Options",
					"value": "nosniff"
				},
				{
					"key": "X-Frame-Options",
					"value": "DENY"
				},
				{
					"key": "X-XSS-Protection",
					"value": "1; mode=block"
				},
				{
					"key": "Referrer-Policy",
					"value": "strict-origin-when-cross-origin"
				}
			]
		},
		{
			"source": "/assets/(.*)",
			"headers": [
				{
					"key": "Cache-Control",
					"value": "public, max-age=31536000, immutable"
				}
			]
		}
	]
}
```

---

## 🌍 Environment Variables

### **Required Environment Variables**

Set these in your Vercel dashboard under "Settings" → "Environment Variables":

```bash
# Google Analytics (replace with your actual ID)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# API URLs (if you have backend)
VITE_API_URL=https://your-api-domain.com
VITE_WS_URL=wss://your-ws-domain.com

# Authentication (if using auth providers)
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_AUTH_DOMAIN=your-auth-domain
```

### **How to Set Environment Variables**

1. Go to your Vercel project dashboard
2. Navigate to "Settings" → "Environment Variables"
3. Add each variable with the appropriate environment (Production, Preview, Development)
4. Redeploy your project

---

## 📈 Performance Optimization

### **Build Optimization**

- Your project already uses Vite for fast builds
- Code splitting is automatically handled
- Tree shaking removes unused code

### **Caching Strategy**

- Static assets are cached for 1 year (configured in vercel.json)
- API responses can be cached using Vercel's Edge Caching

### **CDN Distribution**

- Vercel automatically distributes your assets globally
- Images and static files are served from the edge

---

## 🔍 Monitoring & Analytics

### **Vercel Analytics Dashboard**

- View real-time performance metrics
- Monitor Core Web Vitals
- Track user interactions
- Analyze page load times

### **Google Analytics Dashboard**

- Track user behavior
- Monitor conversion rates
- Analyze traffic sources
- View custom events (sign-ups, item views, etc.)

### **Custom Events Tracking**

Your app tracks these events automatically:

- User sign-ups and sign-ins
- Item interactions (views, likes, swaps)
- Navigation patterns
- Form submissions and errors

---

## 🛠️ Troubleshooting

### **Common Issues**

#### **Build Failures**

```bash
# Check build locally first
npm run build

# Common fixes:
npm install
npm run lint --fix
```

#### **Analytics Not Working**

1. Verify Google Analytics ID is correct
2. Check browser console for errors
3. Ensure ad blockers are disabled for testing
4. Verify Vercel Analytics is enabled in dashboard

#### **Environment Variables Not Loading**

1. Check variable names start with `VITE_` for client-side access
2. Redeploy after adding new environment variables
3. Verify variables are set for the correct environment

### **Performance Issues**

1. Check Vercel Analytics for Core Web Vitals
2. Optimize images and assets
3. Enable compression in vercel.json
4. Use lazy loading for components

---

## 🔄 Continuous Deployment

### **Automatic Deployments**

- Every push to `main` branch triggers production deployment
- Pull requests create preview deployments
- Branch deployments for testing

### **Deployment Status**

- Monitor deployments in Vercel dashboard
- Set up notifications for deployment status
- Configure deployment protection rules

---

## 📊 Analytics Events

### **Tracked Events**

Your app automatically tracks:

- Page views
- User authentication (sign-up, sign-in, sign-out)
- Item interactions (view, like, swap request)
- Navigation events
- Form submissions and errors

### **Custom Event Examples**

```typescript
// Track item view
trackEvent("item_view", "engagement", itemId);

// Track swap request
trackEvent("swap_request", "conversion", itemId);

// Track search
trackEvent("search_performed", "engagement", searchTerm);
```

---

## ✅ Deployment Checklist

- [x] Project builds successfully locally
- [x] All environment variables configured
- [x] Google Analytics ID updated
- [x] Vercel Analytics enabled
- [x] Custom domain configured (if needed)
- [x] SSL certificate active
- [x] Performance monitoring set up
- [x] Error tracking configured
- [x] Analytics events working
- [x] Mobile responsiveness tested
- [x] Cross-browser compatibility verified

---

## 🎯 Next Steps

1. **Monitor Performance**: Use Vercel Analytics to track Core Web Vitals
2. **Optimize Based on Data**: Use Google Analytics insights to improve UX
3. **Set Up Alerts**: Configure performance and error alerts
4. **Scale Infrastructure**: Upgrade Vercel plan as needed
5. **Implement A/B Testing**: Use analytics data to test improvements

---

Your ReWear project is now fully configured for Vercel deployment with comprehensive analytics tracking!
