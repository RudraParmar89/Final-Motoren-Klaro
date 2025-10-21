# ⚡ Quick Start - User Favorites Real-Time

## 1️⃣ Run This SQL (30 seconds):

Go to Supabase → SQL Editor → Run as **postgres** role:

```sql
GRANT ALL ON public.user_favorites TO authenticated;
GRANT ALL ON public.user_favorites TO postgres;
ALTER TABLE public.user_favorites OWNER TO postgres;
CREATE POLICY IF NOT EXISTS "Admin can view all favorites" ON public.user_favorites FOR SELECT TO authenticated USING (true);
```

## 2️⃣ Refresh Admin Panel (5 seconds):

- Go to admin panel
- Press **Ctrl+Shift+R**
- Click "User Favorites" tab

## 3️⃣ Done! ✅

Now you'll see:
- ✅ User emails (not just IDs)
- ✅ Real-time updates
- ✅ Number of favorites per user
- ✅ Which cars are favorited
- ✅ Live statistics

**Test it:** Add a favorite from main site → Watch it appear instantly in admin! 🎉
