-- CREATE DATABASE tms;

CREATE TABLE IF NOT EXISTS Role (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT
);

-- Role must be injected first
INSERT INTO Role (role_name, description) 
VALUES ('Admin', 'Full access'), ('Role_01', 'Access to free courses only')
ON CONFLICT (role_name) DO NOTHING;


CREATE TABLE IF NOT EXISTS "User" (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role_id INT,
    status VARCHAR(20),
    email_verified BOOLEAN DEFAULT FALSE,
    verification_token TEXT,
    verification_token_expiry TIMESTAMP,
    registration_device VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES Role(role_id)
);

CREATE INDEX IF NOT EXISTS idx_user_role_id ON "User" (role_id);
CREATE INDEX IF NOT EXISTS idx_user_email ON "User" (email);

CREATE TABLE IF NOT EXISTS Course (
    course_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    level VARCHAR(50) NOT NULL,
    price VARCHAR(255) NOT NULL,
    duration VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_course_category ON Course (category);
CREATE INDEX IF NOT EXISTS idx_course_level ON Course (level);

INSERT INTO Course (title, description, category, level, price, duration)
VALUES (
    'Fundamentals of Web Development', 
    'Learn the basics of web-site developmenet with HTML, CSS, and Basic Javascript.', 
    'Web Development', 
    'Beginner', 
    'FREE',
    '2 Months'
)
ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS role_course (
    role_id INT NOT NULL,
    course_id INT NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (role_id, course_id),
    FOREIGN KEY (role_id) REFERENCES Role(role_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES Course(course_id) ON DELETE CASCADE
);

INSERT INTO role_course (role_id, course_id)
VALUES (2, 1)
ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS Video (
    video_id SERIAL PRIMARY KEY,
    course_id INT NOT NULL,
    title VARCHAR(255),
    description TEXT,
    youtube_url TEXT NOT NULL,
    order_index INT,
    duration VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES Course(course_id)
);

CREATE INDEX IF NOT EXISTS idx_video_course_id ON Video (course_id);


CREATE TABLE IF NOT EXISTS course_material (
    material_id SERIAL PRIMARY KEY,
    course_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(50),
    file_size INT,
    file_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (course_id)
        REFERENCES course(course_id)
        ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_material_course_id ON course_material (course_id);


CREATE TABLE IF NOT EXISTS Receipt (
    receipt_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    file_path TEXT NOT NULL,
    file_size INT,
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20),
    FOREIGN KEY (user_id) REFERENCES "User"(user_id)
);

CREATE INDEX IF NOT EXISTS idx_receipt_user_id ON Receipt (user_id);

CREATE TABLE IF NOT EXISTS AccessRequest (
    request_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    course_id INT NOT NULL,
    receipt_id INT NOT NULL,
	payment_amount INT NOT NULL,
    status VARCHAR(20),
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES "User"(user_id),
    FOREIGN KEY (course_id) REFERENCES Course(course_id),
    FOREIGN KEY (receipt_id) REFERENCES Receipt(receipt_id)
);

CREATE INDEX IF NOT EXISTS idx_access_request_user_id ON AccessRequest (user_id);
CREATE INDEX IF NOT EXISTS idx_access_request_course_id ON AccessRequest (course_id);


CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    reset_token TEXT NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_user
        FOREIGN KEY (user_id)
        REFERENCES "User"(user_id)
        ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_password_reset_user_id ON password_reset_tokens (user_id);


CREATE TABLE IF NOT EXISTS landing_videos (
    land_video_id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    youtube_url TEXT NOT NULL,
    order_index INT,
    duration INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_landing_videos_order ON landing_videos (order_index);

CREATE TABLE IF NOT EXISTS projects (
    project_id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    category VARCHAR(100),
    level VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_projects_category ON projects (category);

CREATE TABLE IF NOT EXISTS faqs (
    faqs_id SERIAL PRIMARY KEY,
    question TEXT,
    answer TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);