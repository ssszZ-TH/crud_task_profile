DROP TABLE IF EXISTS task_profile_log;
DROP TABLE IF EXISTS task_profile;

CREATE TABLE task_profile (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    detail TEXT,
    fname VARCHAR(100) NOT NULL,
    lname VARCHAR(100) NOT NULL,
    phone_num VARCHAR(20),
    email VARCHAR(255),
    birth_date DATE,
    status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'inactive', 'done')),
    create_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),  -- UTC
    update_at TIMESTAMPTZ NULL DEFAULT NULL        -- null until updated
);

CREATE TABLE task_profile_log (
    id SERIAL PRIMARY KEY,
    task_profile_id INTEGER,
    title VARCHAR(255) NOT NULL,
    detail TEXT,
    fname VARCHAR(100) NOT NULL,
    lname VARCHAR(100) NOT NULL,
    phone_num VARCHAR(20),
    email VARCHAR(255),
    birth_date DATE,
    status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'inactive', 'done')),
    action VARCHAR(20) NOT NULL CHECK (action IN ('create', 'update', 'delete')),
    action_at TIMESTAMPTZ NOT NULL DEFAULT NOW()   -- utc
);