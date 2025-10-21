-- Run this to check if favorites data exists

-- This will help diagnose the issue

-- Check 1: See all user_favorites
SELECT 
    uf.id,
    uf.user_id,
    uf.car_id,
    uf.created_at,
    c.make,
    c.model
FROM user_favorites uf
LEFT JOIN cars c ON c.id = uf.car_id
ORDER BY uf.created_at DESC;

-- Check 2: Count favorites
SELECT COUNT(*) as total_favorites FROM user_favorites;

-- Check 3: Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'user_favorites';

-- Check 4: Check table permissions
SELECT grantee, privilege_type 
FROM information_schema.role_table_grants 
WHERE table_name = 'user_favorites';
