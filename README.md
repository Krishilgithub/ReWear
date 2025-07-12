## Project info


**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Google Analytics
- Vercel Analytics

## 🚀 Deployment

### Vercel Deployment (Recommended)

This project is optimized for Vercel deployment with built-in analytics tracking.

**Quick Deploy:**

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Vercel will auto-detect the Vite configuration
4. Deploy with one click

**Analytics Setup:**

1. **Google Analytics**: Replace `G-XXXXXXXXXX` in `index.html` with your GA4 Measurement ID
2. **Vercel Analytics**: Enable in your Vercel dashboard (Pro plan required)

**Environment Variables:**
Set these in your Vercel dashboard:

```bash
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
VITE_API_URL=https://your-api-domain.com
```

For detailed deployment instructions, see [VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md)

### Alternative Deployment Options

**Lovable Platform**
Simply open [Lovable](https://lovable.dev/projects/a6a9bae2-e84a-47d1-bfb1-cc32e660918c) and click on Share -> Publish.

**Other Platforms**

- **Netlify**: Use `npm run build` and deploy the `dist` folder
- **GitHub Pages**: Configure GitHub Actions for automatic deployment
- **AWS S3 + CloudFront**: Upload built files to S3 bucket

## 📊 Analytics & Performance

This project includes comprehensive analytics tracking:

- **Google Analytics 4**: User behavior, conversions, and traffic analysis
- **Vercel Analytics**: Performance metrics and Core Web Vitals
- **Custom Events**: Track user interactions, sign-ups, item views, etc.

**Tracked Events:**

- User authentication (sign-up, sign-in, sign-out)
- Item interactions (view, like, swap request)
- Navigation patterns
- Form submissions and errors

## Can I connect a custom domain to my Vercel project?

Yes, you can!

To connect a domain to Vercel:

1. Go to your Vercel project dashboard
2. Navigate to "Settings" → "Domains"
3. Add your custom domain
4. Configure DNS settings as instructed

For Lovable projects:
Navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── Header.tsx      # Navigation component
│   ├── Hero.tsx        # Landing page hero
│   └── ...
├── pages/              # Page components
│   ├── Index.tsx       # Landing page
│   ├── SignIn.tsx      # Authentication
│   ├── SignUp.tsx      # Registration
│   ├── Profile.tsx     # User profile
│   └── ...
├── hooks/              # Custom React hooks
│   ├── useAnalytics.ts # Analytics tracking
│   └── ...
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication state
└── lib/                # Utility functions
    └── utils.ts        # Helper functions
```

## 🔧 Development Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 📈 Performance Features

- **Vite**: Fast development and optimized builds
- **Code Splitting**: Automatic route-based code splitting
- **Tree Shaking**: Remove unused code
- **Image Optimization**: Optimized image loading
- **Caching**: Static assets cached for 1 year
- **CDN**: Global content delivery network

## 🛡️ Security Features

- **HTTPS**: Automatic SSL certificates
- **Security Headers**: XSS protection, content type options
- **Input Validation**: Client and server-side validation
- **Authentication**: Secure user authentication flow
- **Environment Variables**: Secure configuration management
