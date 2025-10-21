# 📸 Car Image Upload Guide

## How to Add 4 Images Per Car

### ✅ **What Was Added:**

1. **Multiple Image Upload Fields** in Car Management
   - Image 1 (Front)
   - Image 2 (Side)
   - Image 3 (Rear)
   - Image 4 (Interior)

2. **Auto-Upload to Supabase**
   - Images automatically upload when selected
   - Shows preview after upload
   - Stored in `lovable-uploads/car-images/` bucket

3. **YouTube Video Support**
   - Add YouTube embed URL for video reviews
   - Shows on car details page

---

## 🚀 **How to Use:**

### **Step 1: Open Admin Panel**
1. Go to `/admin`
2. Click "Manage Cars"
3. Click "Add New Car" or Edit existing car

### **Step 2: Upload Images**
1. Fill in basic car details (Brand, Make, Model)
2. Scroll to "Car Images" section
3. You'll see 4 upload fields:
   - **Image 1 (Front)** - Front view of car
   - **Image 2 (Side)** - Side profile
   - **Image 3 (Rear)** - Rear view
   - **Image 4 (Interior)** - Interior/dashboard

4. Click each "Choose File" button
5. Select your image (e.g., `BMW_X7_Front.png`)
6. Image uploads automatically
7. Preview appears next to the field

### **Step 3: Add YouTube Video (Optional)**
1. Find a YouTube video review of the car
2. Get the video ID from URL:
   - URL: `https://www.youtube.com/watch?v=ABC123`
   - Video ID: `ABC123`
3. Enter embed URL: `https://www.youtube.com/embed/ABC123`

### **Step 4: Save**
1. Click "Add Car" or "Update Car"
2. All images and video URL saved to database
3. Images appear on car listing and details pages

---

## 📂 **Image Organization:**

Images are automatically saved as:
```
car-images/BMW_X7_1_timestamp.png
car-images/BMW_X7_2_timestamp.png
car-images/BMW_X7_3_timestamp.png
car-images/BMW_X7_4_timestamp.png
```

---

## 🎯 **Image Display:**

### **Car Listings Page:**
- Shows first image (Front view)
- Hover to see all images in carousel

### **Car Details Page:**
- Full image carousel with all 4 images
- Swipe through images
- Large, high-quality display

### **YouTube Video:**
- Shows after images
- Full-width responsive player
- Auto-embedded from YouTube

---

## 💡 **Tips:**

1. **Image Order Matters:**
   - Image 1 (Front) shows as main thumbnail
   - All 4 show in carousel on details page

2. **Image Size:**
   - Recommended: 1200x800px or higher
   - Keep file size under 2MB for fast loading
   - Use JPG or PNG format

3. **YouTube Videos:**
   - Use official brand videos or reviews
   - Make sure video is public/embeddable
   - Test the embed URL works

4. **Naming Convention:**
   - Your files: `BMW_X7_Front.png`, etc.
   - Auto-renamed on upload to avoid conflicts

---

## 🔄 **Workflow Example:**

### **Adding BMW X7 with 4 Images:**

1. **Click** "Add New Car"
2. **Fill** basic details:
   - Brand: BMW
   - Make: BMW
   - Model: X7
   - Year: 2024
   - Price: 12600000
3. **Upload Images**:
   - Image 1: Select `BMW_X7_Front.png` → Auto-uploads
   - Image 2: Select `BMW_X7_Side.png` → Auto-uploads
   - Image 3: Select `BMW_X7_Rear.png` → Auto-uploads
   - Image 4: Select `BMW_X7_Interior.png` → Auto-uploads
4. **Add YouTube**:
   - Paste: `https://www.youtube.com/embed/ABC123`
5. **Click** "Add Car"
6. ✅ **Done!** Car now has 4 images + video

---

## 📊 **What Happens:**

1. **Upload** → Images go to Supabase Storage
2. **Save** → URLs stored in database `images` array
3. **Display** → Carousel shows all 4 images
4. **Video** → YouTube video embedded on details page

---

## ✅ **Quick Checklist:**

Before uploading:
- [ ] Have 4 images ready (Front, Side, Rear, Interior)
- [ ] Images are good quality (1200px+ width)
- [ ] File sizes are reasonable (< 2MB each)
- [ ] YouTube video URL ready (optional)

---

## 🎉 **Benefits:**

- ✅ Easy drag-and-drop upload
- ✅ Instant preview
- ✅ Auto-upload to Supabase
- ✅ No manual URL copying
- ✅ All images stored in array
- ✅ First image auto-set as primary
- ✅ Beautiful carousel on public pages

---

**Ready to upload images! Go to Admin → Manage Cars and start uploading!** 📸🚗
