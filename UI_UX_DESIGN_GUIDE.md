# ReWear UI/UX Design Guide

## Table of Contents

1. [Design Philosophy](#design-philosophy)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Component Library](#component-library)
5. [Layout & Spacing](#layout--spacing)
6. [Responsive Design](#responsive-design)
7. [Animation & Interactions](#animation--interactions)
8. [Accessibility](#accessibility)
9. [Design Tools & Resources](#design-tools--resources)
10. [Implementation Guidelines](#implementation-guidelines)

## Design Philosophy

### Core Principles

- **Sustainability First**: Every design decision reflects our commitment to environmental consciousness
- **Community-Centric**: Design fosters trust, connection, and collaboration between users
- **Accessibility**: Inclusive design that works for everyone
- **Simplicity**: Clean, intuitive interfaces that reduce cognitive load
- **Authenticity**: Warm, approachable design that feels human and trustworthy

### Brand Values

- **Eco-Friendly**: Natural, earthy color palette and organic shapes
- **Community**: Collaborative features and social interactions
- **Quality**: Premium feel without being pretentious
- **Transparency**: Clear, honest communication through design

## Color System

### Primary Color Palette

#### Sage Green (Primary Brand Color)

```css
--primary: 145 25% 45%;
--primary-foreground: 0 0% 98%;
```

- **Hex**: #6B8E6B
- **RGB**: 107, 142, 107
- **Usage**: Primary buttons, links, brand elements, success states
- **Psychology**: Growth, harmony, sustainability, nature

#### Sage Green Scale

```css
sage-50: hsl(145, 30%, 95%)   /* #F2F7F2 - Lightest backgrounds */
sage-100: hsl(145, 25%, 88%)  /* #E1EDE1 - Subtle backgrounds */
sage-200: hsl(145, 25%, 78%)  /* #C8DBC8 - Borders, dividers */
sage-300: hsl(145, 25%, 68%)  /* #AFC9AF - Hover states */
sage-400: hsl(145, 25%, 58%)  /* #96B796 - Secondary actions */
sage-500: hsl(145, 25%, 48%)  /* #7DA57D - Primary brand */
sage-600: hsl(145, 25%, 38%)  /* #649364 - Active states */
sage-700: hsl(145, 25%, 28%)  /* #4B814B - Text on light */
sage-800: hsl(145, 25%, 18%)  /* #326F32 - Headers */
sage-900: hsl(145, 25%, 12%)  /* #195D19 - Darkest */
```

#### Terracotta (Secondary Brand Color)

```css
--accent: 15 35% 85%;
--accent-foreground: 25 15% 15%;
```

- **Hex**: #D4A574
- **RGB**: 212, 165, 116
- **Usage**: Accent elements, highlights, warm touches
- **Psychology**: Warmth, earthiness, comfort, creativity

#### Terracotta Scale

```css
terracotta-50: hsl(15, 45%, 92%)   /* #FDF8F5 - Lightest backgrounds */
terracotta-100: hsl(15, 40%, 85%)  /* #F9EDE6 - Subtle backgrounds */
terracotta-200: hsl(15, 40%, 75%)  /* #F2D9C7 - Borders, dividers */
terracotta-300: hsl(15, 40%, 65%)  /* #EBC5A8 - Hover states */
terracotta-400: hsl(15, 40%, 55%)  /* #E4B189 - Secondary actions */
terracotta-500: hsl(15, 40%, 45%)  /* #DD9D6A - Primary accent */
terracotta-600: hsl(15, 40%, 35%)  /* #D6894B - Active states */
terracotta-700: hsl(15, 40%, 25%)  /* #CF752C - Text on light */
terracotta-800: hsl(15, 40%, 15%)  /* #C8610D - Headers */
terracotta-900: hsl(15, 40%, 8%)   /* #C14D00 - Darkest */
```

### Neutral Color Palette

#### Light Mode Neutrals

```css
--background: 35 20% 98%; /* #FDFCFA - Main background */
--foreground: 25 15% 15%; /* #2A2620 - Primary text */
--card: 35 25% 96%; /* #F8F6F3 - Card backgrounds */
--card-foreground: 25 15% 15%; /* #2A2620 - Card text */
--muted: 35 15% 92%; /* #F2F0ED - Muted backgrounds */
--muted-foreground: 25 10% 50%; /* #8A8580 - Muted text */
--border: 35 15% 88%; /* #E8E5E1 - Borders */
--input: 35 15% 88%; /* #E8E5E1 - Input fields */
```

#### Dark Mode Neutrals

```css
--background: 25 15% 8%; /* #1A1610 - Main background */
--foreground: 35 20% 95%; /* #F5F3F0 - Primary text */
--card: 25 15% 12%; /* #2A2620 - Card backgrounds */
--card-foreground: 35 20% 95%; /* #F5F3F0 - Card text */
--muted: 25 10% 18%; /* #3A3630 - Muted backgrounds */
--muted-foreground: 35 10% 65%; /* #B0ABA6 - Muted text */
--border: 25 10% 20%; /* #4A4640 - Borders */
--input: 25 10% 20%; /* #4A4640 - Input fields */
```

### Semantic Colors

#### Success

- **Light**: `hsl(145, 25%, 45%)` - Sage green
- **Dark**: `hsl(145, 25%, 55%)` - Lighter sage

#### Warning

- **Light**: `hsl(45, 80%, 60%)` - Warm yellow
- **Dark**: `hsl(45, 80%, 70%)` - Lighter yellow

#### Error/Destructive

```css
--destructive: 0 65% 55%; /* #D64545 - Error states */
--destructive-foreground: 0 0% 98%; /* #FAFAFA - Text on error */
```

### Gradient System

#### Primary Gradients

```css
.gradient-sage {
	background: linear-gradient(
		135deg,
		hsl(145, 25%, 55%) 0%,
		hsl(125, 20%, 45%) 100%
	);
}

.gradient-terracotta {
	background: linear-gradient(
		135deg,
		hsl(15, 45%, 65%) 0%,
		hsl(25, 40%, 55%) 100%
	);
}
```

#### Usage Guidelines

- **Primary Actions**: Use sage gradient for main CTAs
- **Secondary Actions**: Use terracotta gradient for accents
- **Cards**: Subtle gradients for depth and visual interest
- **Hero Sections**: Full gradient backgrounds for impact

## Typography

### Font Stack

```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
	"Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji",
	"Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
```

### Type Scale

#### Headings

```css
/* Display Large */
font-size: 3.75rem; /* 60px */
line-height: 1.1;
font-weight: 700;
letter-spacing: -0.02em;

/* Display Medium */
font-size: 3rem; /* 48px */
line-height: 1.2;
font-weight: 700;
letter-spacing: -0.01em;

/* Display Small */
font-size: 2.25rem; /* 36px */
line-height: 1.3;
font-weight: 600;
letter-spacing: -0.01em;

/* Heading Large */
font-size: 1.875rem; /* 30px */
line-height: 1.4;
font-weight: 600;

/* Heading Medium */
font-size: 1.5rem; /* 24px */
line-height: 1.5;
font-weight: 600;

/* Heading Small */
font-size: 1.25rem; /* 20px */
line-height: 1.6;
font-weight: 600;
```

#### Body Text

```css
/* Body Large */
font-size: 1.125rem; /* 18px */
line-height: 1.7;
font-weight: 400;

/* Body Medium */
font-size: 1rem; /* 16px */
line-height: 1.6;
font-weight: 400;

/* Body Small */
font-size: 0.875rem; /* 14px */
line-height: 1.5;
font-weight: 400;

/* Caption */
font-size: 0.75rem; /* 12px */
line-height: 1.4;
font-weight: 400;
```

### Typography Guidelines

#### Hierarchy

1. **Display**: Hero sections, main headlines
2. **Heading**: Section titles, page headers
3. **Body**: Main content, descriptions
4. **Caption**: Metadata, labels, small text

#### Readability

- **Line Length**: 45-75 characters for optimal reading
- **Line Height**: 1.5-1.7 for body text
- **Contrast**: Minimum 4.5:1 for normal text, 3:1 for large text
- **Spacing**: Generous whitespace between sections

## Component Library

### Buttons

#### Primary Button

```tsx
<Button className="gradient-sage text-white hover:opacity-90">
	Get Started
</Button>
```

#### Secondary Button

```tsx
<Button
	variant="outline"
	className="border-sage-300 text-sage-700 hover:bg-sage-50"
>
	Learn More
</Button>
```

#### Ghost Button

```tsx
<Button variant="ghost" className="text-muted-foreground hover:text-foreground">
	Sign In
</Button>
```

### Cards

#### Product Card

```tsx
<div className="group relative overflow-hidden rounded-lg border bg-card hover-lift">
	<div className="aspect-square overflow-hidden">
		<img
			src={image}
			alt={title}
			className="object-cover transition-transform group-hover:scale-105"
		/>
	</div>
	<div className="p-4">
		<h3 className="font-semibold text-foreground">{title}</h3>
		<p className="text-sm text-muted-foreground">{description}</p>
	</div>
</div>
```

#### Feature Card

```tsx
<div className="rounded-lg border bg-card p-6 hover-lift">
	<div className="mb-4 w-12 h-12 rounded-lg gradient-sage flex items-center justify-center">
		<Icon className="w-6 h-6 text-white" />
	</div>
	<h3 className="mb-2 font-semibold">{title}</h3>
	<p className="text-muted-foreground">{description}</p>
</div>
```

### Forms

#### Input Fields

```tsx
<div className="space-y-2">
	<Label htmlFor="email">Email</Label>
	<Input
		id="email"
		type="email"
		placeholder="Enter your email"
		className="border-sage-200 focus:border-sage-500 focus:ring-sage-500"
	/>
</div>
```

#### Form Layout

```tsx
<form className="space-y-6">
	<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
		{/* Form fields */}
	</div>
	<Button type="submit" className="w-full gradient-sage">
		Submit
	</Button>
</form>
```

### Navigation

#### Header Navigation

- **Logo**: Sage green gradient with heart icon
- **Primary Nav**: Muted text with hover states
- **Actions**: Ghost buttons for secondary actions, gradient for primary

#### Mobile Navigation

- **Hamburger Menu**: Clean dropdown with proper spacing
- **Touch Targets**: Minimum 44px for mobile interactions
- **Gestures**: Swipe-friendly navigation patterns

## Layout & Spacing

### Grid System

```css
/* Container */
.container {
	max-width: 1200px;
	margin: 0 auto;
	padding: 0 1rem;
}

/* Grid Layouts */
.grid-cols-1 {
	grid-template-columns: repeat(1, minmax(0, 1fr));
}
.grid-cols-2 {
	grid-template-columns: repeat(2, minmax(0, 1fr));
}
.grid-cols-3 {
	grid-template-columns: repeat(3, minmax(0, 1fr));
}
.grid-cols-4 {
	grid-template-columns: repeat(4, minmax(0, 1fr));
}
```

### Spacing Scale

```css
/* Tailwind spacing scale */
space-1: 0.25rem; /* 4px */
space-2: 0.5rem; /* 8px */
space-3: 0.75rem; /* 12px */
space-4: 1rem; /* 16px */
space-6: 1.5rem; /* 24px */
space-8: 2rem; /* 32px */
space-12: 3rem; /* 48px */
space-16: 4rem; /* 64px */
space-24: 6rem; /* 96px */
```

### Layout Patterns

#### Hero Section

```tsx
<section className="relative min-h-[80vh] flex items-center">
	<div className="container mx-auto px-4">
		<div className="max-w-3xl">
			<h1 className="text-4xl md:text-6xl font-bold mb-6">
				Sustainable Fashion for Everyone
			</h1>
			<p className="text-xl text-muted-foreground mb-8">
				Join our community of conscious consumers
			</p>
			<Button size="lg" className="gradient-sage">
				Get Started
			</Button>
		</div>
	</div>
</section>
```

#### Content Sections

```tsx
<section className="py-16 md:py-24">
	<div className="container mx-auto px-4">
		<div className="text-center mb-12">
			<h2 className="text-3xl font-bold mb-4">How It Works</h2>
			<p className="text-muted-foreground max-w-2xl mx-auto">
				Simple steps to join our sustainable fashion community
			</p>
		</div>
		<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
			{/* Feature cards */}
		</div>
	</div>
</section>
```

## Responsive Design

### Breakpoints

```css
/* Mobile First Approach */
sm: 640px   /* Small tablets */
md: 768px   /* Tablets */
lg: 1024px  /* Laptops */
xl: 1280px  /* Desktop */
2xl: 1536px /* Large screens */
```

### Responsive Patterns

#### Mobile Navigation

- **Hamburger Menu**: Collapsible navigation for mobile
- **Touch-Friendly**: Large touch targets (44px minimum)
- **Swipe Gestures**: Intuitive mobile interactions

#### Responsive Typography

```css
/* Fluid typography */
h1 {
	font-size: clamp(2rem, 5vw, 4rem);
	line-height: 1.1;
}

p {
	font-size: clamp(1rem, 2vw, 1.125rem);
}
```

#### Responsive Grid

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
	{/* Responsive grid items */}
</div>
```

### Mobile-First Guidelines

1. **Start with mobile**: Design for smallest screen first
2. **Progressive enhancement**: Add features for larger screens
3. **Touch targets**: Minimum 44px for interactive elements
4. **Readable text**: Minimum 16px font size on mobile
5. **Fast loading**: Optimize images and assets for mobile

## Animation & Interactions

### Micro-Interactions

#### Hover Effects

```css
.hover-lift {
	transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.hover-lift:hover {
	transform: translateY(-2px);
	box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.1);
}
```

#### Button Interactions

```css
.button-primary {
	transition: all 0.2s ease;
}

.button-primary:hover {
	transform: translateY(-1px);
	box-shadow: 0 4px 12px rgba(107, 142, 107, 0.3);
}

.button-primary:active {
	transform: translateY(0);
}
```

### Page Transitions

```css
/* Fade in animation */
@keyframes fade-in {
	0% {
		opacity: 0;
		transform: translateY(10px);
	}
	100% {
		opacity: 1;
		transform: translateY(0);
	}
}

.fade-in {
	animation: fade-in 0.6s ease-out;
}
```

### Loading States

```tsx
// Skeleton loading
<div className="animate-pulse">
	<div className="h-4 bg-muted rounded mb-2"></div>
	<div className="h-4 bg-muted rounded w-3/4"></div>
</div>
```

## Accessibility

### WCAG 2.1 AA Compliance

#### Color Contrast

- **Normal Text**: Minimum 4.5:1 contrast ratio
- **Large Text**: Minimum 3:1 contrast ratio
- **UI Components**: Minimum 3:1 contrast ratio

#### Keyboard Navigation

```tsx
// Focus management
<button
	className="focus:outline-none focus:ring-2 focus:ring-sage-500 focus:ring-offset-2"
	onKeyDown={handleKeyDown}
>
	Click me
</button>
```

#### Screen Reader Support

```tsx
// Proper ARIA labels
<button aria-label="Add item to favorites">
  <Heart className="w-5 h-5" />
</button>

// Semantic HTML
<main role="main">
  <section aria-labelledby="section-title">
    <h2 id="section-title">Featured Items</h2>
  </section>
</main>
```

### Accessibility Guidelines

1. **Semantic HTML**: Use proper HTML elements
2. **ARIA Labels**: Provide context for screen readers
3. **Focus Management**: Clear focus indicators
4. **Alternative Text**: Descriptive alt text for images
5. **Keyboard Navigation**: All interactions keyboard accessible

## Design Tools & Resources

### Design System Tools

- **Figma**: Primary design tool for UI/UX
- **Storybook**: Component documentation and testing
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Component library

### Color Tools

- **Coolors**: Color palette generation
- **Adobe Color**: Color wheel and harmonies
- **WebAIM Contrast Checker**: Accessibility validation

### Typography Tools

- **Google Fonts**: Web font selection
- **Type Scale**: Typography scale generator
- **Font Pair**: Font combination suggestions

### Icon Libraries

- **Lucide React**: Primary icon library
- **Heroicons**: Alternative icon set
- **Feather Icons**: Minimal icon style

## Implementation Guidelines

### CSS Architecture

```css
/* Component-based CSS */
@layer components {
	.btn-primary {
		@apply gradient-sage text-white px-6 py-3 rounded-lg font-medium;
	}

	.card-hover {
		@apply hover-lift transition-all duration-200;
	}
}
```

### Component Structure

```tsx
// Consistent component structure
interface ComponentProps {
	className?: string;
	children?: React.ReactNode;
}

const Component: React.FC<ComponentProps> = ({ className, children }) => {
	return <div className={cn("base-styles", className)}>{children}</div>;
};
```

### Naming Conventions

- **Components**: PascalCase (e.g., `ProductCard`)
- **Files**: PascalCase (e.g., `ProductCard.tsx`)
- **CSS Classes**: kebab-case (e.g., `product-card`)
- **Variables**: camelCase (e.g., `productData`)

### Performance Guidelines

1. **Optimize Images**: Use WebP format, proper sizing
2. **Lazy Loading**: Implement for images and components
3. **Code Splitting**: Split bundles by routes
4. **Caching**: Implement proper caching strategies
5. **Minification**: Compress CSS, JS, and assets

### Testing Strategy

1. **Visual Regression**: Automated visual testing
2. **Accessibility Testing**: Automated a11y checks
3. **Cross-browser Testing**: Test on major browsers
4. **Mobile Testing**: Test on various devices
5. **Performance Testing**: Lighthouse audits

---

## Quick Reference

### Color Usage

- **Primary Actions**: Sage green (`#6B8E6B`)
- **Secondary Actions**: Terracotta (`#D4A574`)
- **Success States**: Sage green variants
- **Error States**: Red (`#D64545`)
- **Neutral Text**: Dark gray (`#2A2620`)

### Typography Scale

- **Hero**: 3.75rem (60px)
- **Headings**: 1.875rem (30px)
- **Body**: 1rem (16px)
- **Caption**: 0.75rem (12px)

### Spacing Scale

- **Small**: 0.5rem (8px)
- **Medium**: 1rem (16px)
- **Large**: 2rem (32px)
- **Extra Large**: 4rem (64px)

### Component Patterns

- **Cards**: Rounded corners, subtle shadows, hover effects
- **Buttons**: Gradient backgrounds, hover animations
- **Forms**: Clean inputs, clear labels, helpful validation
- **Navigation**: Consistent spacing, clear hierarchy

This design system ensures consistency, accessibility, and a delightful user experience across all touchpoints of the ReWear platform.
