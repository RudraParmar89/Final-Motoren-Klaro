# 📧 Add User Emails to Favorites Panel

## Quick Setup (1 minute):

### Step 1: Run SQL in Supabase

1. Go to Supabase → SQL Editor
2. Run as **postgres** role
3. Copy and paste:

```sql
-- Create function to get user email
CREATE OR REPLACE FUNCTION public.get_user_email(user_id_param uuid)
RETURNS TABLE (email text)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT au.email::text
  FROM auth.users au
  WHERE au.id = user_id_param;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.get_user_email(uuid) TO authenticated;
```

4. Click **Run**

### Step 2: Refresh Admin Panel

1. Go to admin panel
2. Press **Ctrl+Shift+R**
3. Click "User Favorites"

**Now you'll see actual user emails instead of "User abc12345"!** 📧

---

## What You'll See:

Before:
```
User: User 47c8fc8a
```

After:
```
User: john@example.com
ID: 47c8fc8a...
```

This way admin can contact users directly! 🎉
