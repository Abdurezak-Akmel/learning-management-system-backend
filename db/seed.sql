-- Run this after registering the first account
UPDATE "User"
SET role_id = 1
WHERE user_id = 1;