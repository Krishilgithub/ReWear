# UI/UX Design Guide for ReWear

## 🎨 Design Principles

- **User-Centric:** Prioritize ease of use, clarity, and accessibility.
- **Sustainable Aesthetic:** Use eco-friendly, modern, and clean visuals.
- **Consistency:** Maintain a consistent look and feel across all pages and components.
- **Accessibility:** Ensure the app is usable for everyone, including those with disabilities.

---

## 📱 Responsive Design

- **Mobile-First:** Design for mobile screens first, then scale up for tablets and desktops.
- **Breakpoints:** Use Tailwind CSS breakpoints for seamless adaptation.
- **Flexible Grids:** Employ CSS grid/flexbox for layouts that adapt to screen size.
- **Touch Targets:** Ensure buttons and interactive elements are large enough for touch.

---

## 🧭 Navigation Patterns

- **Breadcrumbs:**
  - Show user’s current location in the app hierarchy.
  - Use on dashboard, item detail, and admin pages.
- **Pagination:**
  - Use for item lists, search results, and admin tables.
  - Provide clear navigation (previous/next, page numbers).
- **Sidebar/Menu:**
  - Collapsible on mobile, always visible on desktop.
- **Header:**
  - Contains logo, main navigation, and user actions (profile, sign out).

---

## 🔍 Search & Filter

- **Search Bar:**
  - Prominently placed on item listing and dashboard pages.
  - Supports instant feedback and suggestions.
- **Filters:**
  - Category, size, condition, location, points, etc.
  - Use checkboxes, dropdowns, and sliders for filter controls.
- **Sort Options:**
  - Allow sorting by newest, most popular, points, etc.

---

## 🌈 Color & Typography

- **Color Palette:**
  - Primary: Sage Green (`hsl(145, 25%, 45%)`)
  - Secondary: Terracotta (`hsl(15, 40%, 45%)`)
  - Background: Warm neutrals
  - Accent: Muted earth tones
- **Contrast:**
  - Ensure sufficient contrast between text and background for readability.
  - Use accessible color combinations (test with tools like WebAIM Contrast Checker).
- **Typography:**
  - Use system fonts for performance and clarity.
  - Clear hierarchy: headings, subheadings, body, captions.

---

## 🧩 Components & Patterns

- **Reusable Components:**
  - Buttons, cards, badges, modals, tables, forms, avatars, etc.
  - Use shadcn/ui and Tailwind CSS for consistency.
- **Feedback:**
  - Show loading spinners, skeletons, and toast notifications for actions.
  - Provide clear error and success messages.
- **Accessibility:**
  - Use semantic HTML and ARIA attributes.
  - Ensure keyboard navigation and screen reader support.
  - Test with tools like Lighthouse and axe.

---

## 🖥️ Example UI/UX Features

- **Responsive Item Grid:**
  - 1 column on mobile, 2 on tablet, 4 on desktop.
- **Pagination:**
  - Show 8-12 items per page, with navigation controls.
- **Breadcrumb:**
  - Home / Dashboard / My Items / Item Detail
- **Search & Filter:**
  - Search bar at top, filters in sidebar or dropdown.
- **Color Usage:**
  - Primary buttons: Sage green background, white text.
  - Secondary buttons: Terracotta border, transparent background.
  - Text: Dark on light backgrounds, light on dark backgrounds.

---

## 🛠️ Tools & Technologies

- **Tailwind CSS:** Utility-first responsive design.
- **shadcn/ui:** Accessible, reusable UI components.
- **React Router:** For navigation, breadcrumbs, and pagination.
- **Headless UI:** For accessible dropdowns, modals, and popovers.
- **Lighthouse, axe:** For accessibility and performance testing.

---

## ✅ Best Practices

- Test all pages on multiple devices and browsers.
- Use Figma or similar tools for prototyping and design handoff.
- Document all components and patterns in a design system.
- Continuously gather user feedback and iterate on design.

---

## 📋 UI/UX Checklist

- [x] Responsive layouts for all screens
- [x] Accessible color contrast and font sizes
- [x] Clear navigation with breadcrumbs and pagination
- [x] Search and filter functionality
- [x] Consistent, reusable components
- [x] Error and loading states
- [x] Accessibility compliance

---

This guide should be used by all team members to ensure a consistent, accessible, and delightful user experience throughout the ReWear platform.
