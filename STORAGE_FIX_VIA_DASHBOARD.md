# 🔧 Fix Storage Permissions via Supabase Dashboard

## ❌ SQL Script Won't Work
The SQL script requires owner permissions which you don't have in the SQL editor.

## ✅ Fix Using Supabase Dashboard (Easy Way)

### **Step 1: Go to Storage Settings**
1. Open Supabase Dashboard
2. Click **Storage** (left sidebar)
3. Find `lovable-uploads` bucket
4. Click the **3 dots (...)** or settings icon
5. Click **Edit bucket**

### **Step 2: Make Bucket Public**
1. Check the box: **"Public bucket"** ✅
2. Click **Save**

### **Step 3: Add Storage Policies**
1. Still in Storage, click `lovable-uploads` bucket
2. Click **Policies** tab at the top
3. Click **New Policy**

#### **Policy 1: Allow Public Read**
- Name: `Public can view images`
- Allowed operation: `SELECT`
- Target roles: `public`
- Policy definition: `(bucket_id = 'lovable-uploads')`
- Click **Create**

#### **Policy 2: Allow Authenticated Upload**
- Click **New Policy** again
- Name: `Authenticated can upload`
- Allowed operation: `INSERT`
- Target roles: `authenticated`
- Policy definition: `(bucket_id = 'lovable-uploads')`
- Click **Create**

#### **Policy 3: Allow Authenticated Update**
- Click **New Policy** again
- Name: `Authenticated can update`
- Allowed operation: `UPDATE`
- Target roles: `authenticated`
- Policy definition: `(bucket_id = 'lovable-uploads')`
- Click **Create**

#### **Policy 4: Allow Authenticated Delete**
- Click **New Policy** again
- Name: `Authenticated can delete`
- Allowed operation: `DELETE`
- Target roles: `authenticated`
- Policy definition: `(bucket_id = 'lovable-uploads')`
- Click **Create**

---

## 🚀 After Setting Policies:

**Try uploading images again in admin panel!** It should work now!

---

## 📸 **Alternative: Manual Upload (Works Right Now)**

If you don't want to mess with policies:

### **Upload Images Manually:**
1. **Supabase Dashboard** → **Storage** → `lovable-uploads`
2. **Create folder:** `car-images`
3. **Upload files:**
   - `BMW_X7_Main.png`
   - `BMW_X7_Side.png`
   - `BMW_X7_Front.png`
   - `BMW_X7_Rear.png`
4. **Copy each URL** (click image → Copy URL button)
5. **In Admin Panel:**
   - Edit BMW X7
   - Click **"Use URLs Instead"** button
   - Paste the 4 URLs
   - Save

### **Example URLs:**
After upload, you'll get URLs like:
```
https://abcdefgh.supabase.co/storage/v1/object/public/lovable-uploads/car-images/BMW_X7_Main.png
https://abcdefgh.supabase.co/storage/v1/object/public/lovable-uploads/car-images/BMW_X7_Side.png
https://abcdefgh.supabase.co/storage/v1/object/public/lovable-uploads/car-images/BMW_X7_Front.png
https://abcdefgh.supabase.co/storage/v1/object/public/lovable-uploads/car-images/BMW_X7_Rear.png
```

Paste these in the admin form and save!

---

## 🎯 **Recommended Right Now:**

**Use the "Use URLs Instead" method:**
1. Upload images to Supabase Storage manually
2. Copy URLs
3. Paste in admin form
4. This works 100% without any SQL!

**This is the fastest way to get your images working!** 🚀
