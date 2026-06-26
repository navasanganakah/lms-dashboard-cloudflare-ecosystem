-- Migration 0000: Initial LMS Schema
-- Apply this using: npx wrangler d1 migrations apply lms_db_preview --local

CREATE TABLE users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'student',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE courses (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    thumbnail_url TEXT,
    instructor_id TEXT NOT NULL,
    status TEXT DEFAULT 'draft',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (instructor_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE enrollments (
    user_id TEXT NOT NULL,
    course_id TEXT NOT NULL,
    progress INTEGER DEFAULT 0,
    enrolled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, course_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE TABLE fcm_tokens (
    user_id TEXT NOT NULL,
    token TEXT NOT NULL,
    device_type TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, token),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Seed Data for Preview
INSERT INTO users (id, name, email, role) VALUES 
('usr_1', 'Admin Instructor', 'admin@zerotrust.local', 'admin'),
('usr_2', 'Jane Doe', 'jane@student.local', 'student');

INSERT INTO courses (id, title, description, instructor_id, status) VALUES 
('crs_1', 'Cloudflare Workers Masterclass', 'Learn to build edge applications.', 'usr_1', 'published'),
('crs_2', 'React & Next.js Advanced', 'Frontend architecture at scale.', 'usr_1', 'published');
