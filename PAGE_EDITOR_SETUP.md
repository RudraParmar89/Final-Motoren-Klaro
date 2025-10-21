# Page Editor Setup Guide

## Overview
The Page Editor allows admins to edit the "About Us" and "Car News" pages directly from the admin panel with markdown support and image uploads.

---

## 🚀 Setup Instructions

### Step 1: Create Database Table
Run this SQL in your Supabase SQL Editor:

```sql
-- Copy the entire contents of create_pages_table.sql and run it
```

**File location**: `create_pages_table.sql`

This will:
- ✅ Create the `pages` table
- ✅ Set up proper permissions (RLS disabled for public read)
- ✅ Create default content for both pages
- ✅ Set up automatic timestamp updates

---

### Step 2: Verify Database
After running the SQL, verify in Supabase:

1. Go to **Table Editor**
2. Find the `pages` table
3. You should see 2 rows:
   - `about-us`
   - `car-news`

---

## 📝 Features

### Admin Panel Features
1. **Dual Tab Interface**: Switch between About Us and Car News
2. **Markdown Editor**: Write content with markdown formatting
3. **Image Upload**: Upload banner images for pages
4. **Live Preview**: Preview button to see changes before saving
5. **Auto-save Timestamps**: Tracks last update time
6. **SEO Support**: Meta descriptions for search engines

### Public Pages
1. **About Us Page**: `/about-us`
2. **Car News Page**: `/car-news`
3. **Responsive Design**: Mobile-friendly layout
4. **Markdown Rendering**: Beautiful formatted content
5. **Banner Images**: Hero sections with images

---

## 🎨 Usage

### How to Edit Pages (Admin)

1. **Login to Admin Panel**
   - Navigate to `/admin`
   - Use admin face recognition login

2. **Access Page Editor**
   - Click on "Page Editor" card in dashboard
   - Or click "System Settings" → "Page Editor"

3. **Edit Content**
   - Select tab: "About Us" or "Car News"
   - Edit the fields:
     - **Page Title**: Main heading
     - **Meta Description**: For SEO
     - **Banner Image**: Upload or paste URL
     - **Page Content**: Markdown formatted text

4. **Save Changes**
   - Click "Save Changes" button
   - Click "Preview" to see live page

### Markdown Support

The editor supports:
```markdown
# Heading 1
## Heading 2
### Heading 3

**Bold text**
*Italic text*

- Bullet list
- Another item

1. Numbered list
2. Another item

[Link text](https://example.com)

> Blockquote

---
Horizontal rule
```

---

## 🔗 Routes Added

### Public Routes:
- `/about-us` - About Us page
- `/car-news` - Car News page

### Admin Routes:
- `/admin` - Main admin dashboard
  - Select "Page Editor" to access editor

---

## 📂 Files Created

### Admin Components:
- `src/components/admin/PageEditor.tsx` - Main editor component

### Public Pages:
- `src/pages/AboutUs.tsx` - Public About Us page
- `src/pages/CarNews.tsx` - Public Car News page

### Database:
- `create_pages_table.sql` - Database setup script

### Documentation:
- `PAGE_EDITOR_SETUP.md` - This file

---

## 🎯 How It Works

### Data Flow:
```
Admin Editor (PageEditor.tsx)
    ↓
Supabase 'pages' table
    ↓
Public Pages (AboutUs.tsx, CarNews.tsx)
    ↓
Rendered with ReactMarkdown
```

### Database Schema:
```typescript
interface Page {
  id: UUID;              // Auto-generated
  page_slug: string;     // 'about-us' or 'car-news'
  title: string;         // Page title
  content: string;       // Markdown content
  meta_description: string; // SEO description
  banner_image: string;  // Image URL
  created_at: timestamp;
  updated_at: timestamp; // Auto-updated
}
```

---

## 🔐 Permissions

### Pages Table RLS:
- **SELECT**: Public (anon) - Anyone can read pages
- **INSERT/UPDATE/DELETE**: Authenticated only - Only logged-in users can edit

### Admin Access:
- Only authenticated admin users can access `/admin`
- Face recognition + password required

---

## 🎨 Customization

### Adding More Pages:

1. **Add to Database**:
```sql
INSERT INTO public.pages (page_slug, title, content)
VALUES ('new-page', 'New Page', '# Content here');
```

2. **Create Page Component**:
```tsx
// src/pages/NewPage.tsx
// Copy AboutUs.tsx and change page_slug to 'new-page'
```

3. **Add Route**:
```tsx
// src/App.tsx
<Route path="/new-page" element={<NewPage />} />
```

4. **Add to Editor**:
```tsx
// src/components/admin/PageEditor.tsx
// Add new tab in TabsList
```

---

## 📸 Image Upload

### How Image Upload Works:

1. **Upload to Supabase Storage**:
   - Bucket: `lovable-uploads`
   - Folder: `page-banners/`
   - Naming: `{page-slug}-banner-{timestamp}.{ext}`

2. **Get Public URL**:
   - Automatically retrieves public URL
   - Stores in `banner_image` field

3. **Display**:
   - Shows preview in editor
   - Renders as hero banner on public page

---

## 🚨 Troubleshooting

### Issue: "Failed to load pages"
**Solution**: 
- Check if `pages` table exists in Supabase
- Run `create_pages_table.sql` script
- Verify RLS policies are set correctly

### Issue: "Failed to save page"
**Solution**:
- Ensure user is authenticated
- Check Supabase connection
- Verify permissions on `pages` table

### Issue: "Image upload failed"
**Solution**:
- Check `lovable-uploads` bucket exists
- Verify storage permissions
- Ensure file size is under limit

### Issue: "Page not displaying"
**Solution**:
- Check route is added in `App.tsx`
- Verify page component is imported
- Check console for errors

---

## 📊 Default Content

Both pages come with pre-populated content:

### About Us Default:
- Company introduction
- Mission statement
- What we offer
- Why choose us
- Contact information

### Car News Default:
- Latest updates section
- Industry trends
- Upcoming events
- Regular update schedule

**Note**: You can edit or replace all default content in the admin panel.

---

## 🔄 Updates & Maintenance

### To Update Content:
1. Login to admin panel
2. Go to Page Editor
3. Make changes
4. Click "Save Changes"
5. Changes are live immediately

### To Add Images:
1. Click "Upload" button
2. Select image file
3. Wait for upload to complete
4. Preview shows automatically
5. Save page to publish

### To View Changes:
1. Click "Preview" button (opens in new tab)
2. Or navigate to public page directly:
   - `/about-us`
   - `/car-news`

---

## 🎓 Best Practices

1. **Content**:
   - Use clear, concise language
   - Break content into sections with headings
   - Use bullet points for lists
   - Add links where relevant

2. **Images**:
   - Use high-quality images
   - Recommended size: 1920x600px
   - Optimize images before upload
   - Use descriptive alt text

3. **SEO**:
   - Write compelling meta descriptions
   - Use relevant keywords naturally
   - Keep meta descriptions under 160 characters
   - Update content regularly

4. **Markdown**:
   - Preview before saving
   - Use consistent formatting
   - Test links after saving
   - Use appropriate heading levels

---

## 📱 Mobile Responsive

All pages are fully responsive:
- ✅ Mobile phones (320px+)
- ✅ Tablets (768px+)
- ✅ Laptops (1024px+)
- ✅ Desktops (1440px+)

---

## 🎉 Success!

You now have a fully functional page editor system! 

**Quick Start**:
1. Run `create_pages_table.sql` in Supabase ✅
2. Login to admin panel ✅
3. Click "Page Editor" ✅
4. Start editing! 🎨

**Questions or issues?** Check the troubleshooting section above.

---

## 📚 Additional Resources

- [Markdown Guide](https://www.markdownguide.org/)
- [Supabase Storage Docs](https://supabase.com/docs/guides/storage)
- [ReactMarkdown Docs](https://github.com/remarkjs/react-markdown)

---

**Happy Editing! 🚀**
