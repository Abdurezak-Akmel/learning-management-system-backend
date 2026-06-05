-- Migration: align current database to structure defined in schema.sql
-- Idempotent: safe to run multiple times on a live database
BEGIN;

-- COURSE table
CREATE TABLE IF NOT EXISTS course (
	course_id SERIAL PRIMARY KEY,
	title VARCHAR(255) NOT NULL,
	description TEXT NOT NULL,
	category VARCHAR(100) NOT NULL,
	level VARCHAR(50) NOT NULL,
	price VARCHAR(255) NOT NULL,
	duration VARCHAR(255) NOT NULL,
	course_group VARCHAR(255) NOT NULL,
	course_order INT NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_course_category ON course (category);
CREATE INDEX IF NOT EXISTS idx_course_level ON course (level);

-- Ensure `course_group` and `course_order` exist and enforce NOT NULL safely
DO $$
BEGIN
	IF NOT EXISTS (
		SELECT 1 FROM information_schema.columns
		WHERE table_name = 'course' AND column_name = 'course_group'
	) THEN
		ALTER TABLE course ADD COLUMN course_group VARCHAR(255);
	END IF;

	IF NOT EXISTS (
		SELECT 1 FROM information_schema.columns
		WHERE table_name = 'course' AND column_name = 'course_order'
	) THEN
		ALTER TABLE course ADD COLUMN course_order INT;
	END IF;

	-- Populate sensible defaults for existing rows so we can set NOT NULL
	UPDATE course SET course_group = 'Group 1 - PERN Stack Development' WHERE course_group IS NULL;
	UPDATE course SET course_order = 1 WHERE course_order IS NULL;

	-- Set NOT NULL if currently nullable
	IF EXISTS (
		SELECT 1 FROM information_schema.columns
		WHERE table_name = 'course' AND column_name = 'course_group' AND is_nullable = 'YES'
	) THEN
		ALTER TABLE course ALTER COLUMN course_group SET NOT NULL;
	END IF;

	IF EXISTS (
		SELECT 1 FROM information_schema.columns
		WHERE table_name = 'course' AND column_name = 'course_order' AND is_nullable = 'YES'
	) THEN
		ALTER TABLE course ALTER COLUMN course_order SET NOT NULL;
	END IF;
END$$;

COMMIT;

