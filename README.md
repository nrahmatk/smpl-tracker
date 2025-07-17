# SuperTracker Pro - Supermarket Inventory Management System

A modern, responsive inventory tracking application for supermarkets. Built with Next.js, TypeScript, and Tailwind CSS with mobile-first design and professional user experience.

## Features

### 🎯 Core Functionality

- **Product Search**: Search by name, brand, keywords, benefits, or category
- **Location Tracking**: Track products by line number, rack number, and sub-sections
- **Inventory Management**: Add, edit, and delete products with full CRUD operations
- **Visual Store Map**: Interactive map showing product locations across the store
- **Mobile Responsive**: Fully responsive design optimized for mobile and desktop

### 🔍 Enhanced Search & Display

- Multi-field search (name, brand, keywords, benefits)
- Category and line filtering
- Pagination with customizable items per page (6, 12, 24, 48)
- List/Grid view toggle for different display preferences
- Recent history tracking
- Real-time search results

### 📱 Mobile-First Design

- **Responsive Navbar**: Logo and manage inventory only, responsive without media queries
- **Touch-Friendly**: Optimized touch targets and interactions
- **Mobile Location Modal**: Responsive modal that adapts to screen size
- **Grid Layout**: Adaptive grid from 1 column on mobile to 6 columns on large screens
- **Professional Loading States**: Skeleton loading animations

### 🗺️ Enhanced Location System

- **Line-based Organization**: Changed from "aisles" to "lines" for better organization
- **Sub-sections**: Added section field for more precise location (A, B, C, Top, Bottom, etc.)
- **Visual Location Display**: Line {number}, Rack {number} - {section}
- **Interactive Location Cards**: Prominent location display on each product
- **Location Visualization**: Visual preview of product location in store layout

### 🏪 Improved Product Display

- **Proportional Cards**: Better aspect ratios and responsive sizing
- **Prominent Location**: Location prominently displayed on each product card
- **List View**: Alternative list view for better density on mobile
- **Enhanced Product Cards**: Hover effects and better visual hierarchy

## Pages & Navigation

### 🏠 Home Page (`/`)

- **Pagination**: Customizable items per page with navigation
- **View Modes**: Toggle between grid and list view
- **Recent History**: Shows recently added products
- **Quick Search**: Fast search with category filtering
- **Responsive Grid**: 1 column on mobile, up to 6 columns on large screens
- **Mobile Optimized**: Touch-friendly interface and interactions

### � Responsive Features

- **Mobile-First Navbar**: Simple logo + manage inventory only
- **Adaptive Layouts**: Responsive grids and flexible layouts
- **Touch Interactions**: Optimized for mobile touch
- **Modal Responsiveness**: Location modal adapts to screen size
- Real-time results
- Location highlighting

### ➕ Add Product (`/add-product`)

- Form validation with Zod schema
- Category selection
- Location input (aisle/rack)
- Keywords and benefits
- Photo URL support

### 📋 Manage Inventory (`/manage`)

- Complete product listing
- Table and grid view modes
- Sorting and filtering
- Bulk operations
- Edit/delete actions

### 🗺️ Store Map (`/map`)

- Visual layout representation
- Interactive location grid
- Product distribution view
- Location-based filtering

### ✏️ Edit Product (`/edit-product/[id]`)

- Pre-filled forms
- Product updates
- Location changes
- Image management

## Technical Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI Components
- **Database**: Supabase (PostgreSQL)
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **Deployment**: Vercel-ready

## Database Schema

```sql
-- Updated Products table with enhanced location tracking
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  brand VARCHAR(255),
  category VARCHAR(255),
  keywords TEXT,
  line_number INTEGER NOT NULL,     -- Changed from aisle_line
  rack_number INTEGER NOT NULL,
  section VARCHAR(10),              -- New: Sub-section (A, B, C, Top, Bottom, etc.)
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced indexes for performance
CREATE INDEX idx_products_name ON products USING gin(to_tsvector('english', name));
CREATE INDEX idx_products_brand ON products USING gin(to_tsvector('english', brand));
CREATE INDEX idx_products_category ON products USING gin(to_tsvector('english', category));
CREATE INDEX idx_products_keywords ON products USING gin(to_tsvector('english', keywords));
CREATE INDEX idx_products_location ON products (line_number, rack_number, section);
```

### Schema Changes

- **`aisle_line` → `line_number`**: Changed terminology for better clarity
- **Added `section`**: Sub-section within a rack for more precise location tracking
- **Updated indexes**: Enhanced location indexing with section support

## Getting Started

1. **Clone and Install**

   ```bash
   npm install
   ```

2. **Environment Setup**
   Create `.env.local`:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Database Setup**

   - Run the SQL scripts in `/scripts/` directory
   - Set up Supabase project
   - Configure RLS policies

4. **Start Development**
   ```bash
   npm run dev
   ```

## Usage Examples

### Product Search Examples

- **By Name**: "Coca Cola", "Bread", "Milk"
- **By Brand**: "Nestlé", "Unilever", "Coca Cola"
- **By Benefits**: "Vitamin C", "Protein", "Organic"
- **By Keywords**: "Dairy", "Snack", "Frozen"

### Location Format

- **Aisle**: 1-999
- **Rack**: 1-999
- **Display**: "Aisle 2, Rack 102"

## Key Improvements

### From Previous Version

1. **Complete UI Overhaul**: Modern, professional corporate design
2. **Enhanced Navigation**: Responsive navbar with mobile support
3. **Advanced Search**: Multi-field search with real-time results
4. **Location Mapping**: Visual store layout representation
5. **Better UX**: Loading states, error handling, form validation
6. **Mobile Optimization**: Fully responsive design
7. **Professional Components**: Using Radix UI for accessibility
8. **Type Safety**: Full TypeScript implementation

### Corporate Features

- Professional color scheme and typography
- Consistent spacing and layout
- Accessible design patterns
- Enterprise-ready navigation
- Modern form handling
- Proper error states
- Loading animations

## Contributing

This application follows modern React/Next.js best practices:

- Component composition
- TypeScript for type safety
- Server components where appropriate
- Client components for interactivity
- Proper error boundaries
- Accessibility considerations

## License

Built for supermarket inventory management with focus on usability and professional appearance.
