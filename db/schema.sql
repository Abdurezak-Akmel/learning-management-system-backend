CREATE TABLE Role (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT
);

-- Role must be injected first
INSERT INTO Role (role_name, description) VALUES ('Admin', 'full access');
INSERT INTO Role (role_name, description) VALUES ('Role-01', 'Access to free courses only');


CREATE TABLE "User" (
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


-- Admin Credentials
-- Email: admin@tms.com
-- Password: admin123
-- Make sure referenced role exists in the database
INSERT INTO "User" (name, email, password_hash, role_id, status, email_verified, registration_device)
VALUES ('System Admin', 'admin@tms.com', '$2b$10$g9UFpczmEXxNFe97q077h..1PguNgDHpN9LD9FvEBlwTdfjBG/ZFG', 1, 'active', true, 'Admin Device')


CREATE TABLE Course (
    course_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    level VARCHAR(50),
    price VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE role_course (
    role_id INT NOT NULL,
    course_id INT NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (role_id, course_id),
    FOREIGN KEY (role_id) REFERENCES Role(role_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES Course(course_id) ON DELETE CASCADE
);


CREATE TABLE Video (
    video_id SERIAL PRIMARY KEY,
    course_id INT NOT NULL,
    title VARCHAR(255),
    description TEXT,
    youtube_url TEXT NOT NULL,
    order_index INT,
    duration INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES Course(course_id)
);


CREATE TABLE course_material (
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


CREATE TABLE Receipt (
    receipt_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    file_path TEXT NOT NULL,
    file_size INT,
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20),
    FOREIGN KEY (user_id) REFERENCES "User"(user_id)
);


CREATE TABLE AccessRequest (
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


CREATE TABLE password_reset_tokens (
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

CREATE TABLE landing_videos (
    land_video_id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    youtube_url TEXT NOT NULL,
    order_index INT,
    duration INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

CREATE TABLE projects (
    project_id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    category VARCHAR(100),
    level VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

CREATE TABLE faqs (
    faqs_id SERIAL PRIMARY KEY,
    question TEXT,
    answer TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)