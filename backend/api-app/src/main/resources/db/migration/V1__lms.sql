CREATE SCHEMA IF NOT EXISTS dynamo;
CREATE SCHEMA IF NOT EXISTS lms_svc;

CREATE SEQUENCE IF NOT EXISTS dynamo.idm_info_seq START 1 INCREMENT 1;

DROP TABLE IF EXISTS dynamo.idm_info CASCADE;
CREATE TABLE dynamo.idm_info (
    id BIGINT NOT NULL DEFAULT NEXTVAL('dynamo.idm_info_seq'),
    idm_unique_id VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_on TIMESTAMPTZ,
    modified_on TIMESTAMPTZ,
    CONSTRAINT idm_info_pkey PRIMARY KEY (id)
);

CREATE SEQUENCE IF NOT EXISTS dynamo.user_seq START 1 INCREMENT 1;

DROP TABLE IF EXISTS dynamo."user" CASCADE;
CREATE TABLE dynamo."user" (
    id BIGINT NOT NULL DEFAULT NEXTVAL('dynamo.user_seq'),
    unique_id UUID UNIQUE NOT NULL,
    idm_user_id VARCHAR(100) UNIQUE NOT NULL,
    idm_info BIGINT NOT NULL,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(100),
    status VARCHAR(50) NOT NULL,
    additional_info TEXT,
    profile_photo_key TEXT,
    created_on TIMESTAMPTZ,
    modified_on TIMESTAMPTZ,
    CONSTRAINT user_pkey PRIMARY KEY (id),
    CONSTRAINT user_idm_info_fkey FOREIGN KEY (idm_info)
        REFERENCES dynamo.idm_info (id)
);

-- ========================
-- Organization
-- ========================
CREATE SEQUENCE IF NOT EXISTS dynamo.organization_seq START 1 INCREMENT 1;

DROP TABLE IF EXISTS dynamo.organization CASCADE;
CREATE TABLE dynamo.organization (
    id BIGINT NOT NULL DEFAULT NEXTVAL('dynamo.organization_seq'),
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    created_on TIMESTAMPTZ,
    modified_on TIMESTAMPTZ,
    CONSTRAINT organization_pkey PRIMARY KEY (id)
);

-- ========================
-- Group (reserved keyword)
-- ========================
CREATE SEQUENCE IF NOT EXISTS dynamo.group_seq START 1 INCREMENT 1;

DROP TABLE IF EXISTS dynamo."group" CASCADE;
CREATE TABLE dynamo."group" (
    id BIGINT NOT NULL DEFAULT NEXTVAL('dynamo.group_seq'),
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    created_on TIMESTAMPTZ,
    modified_on TIMESTAMPTZ,
    CONSTRAINT group_pkey PRIMARY KEY (id)
);

-- ========================
-- Role
-- ========================
CREATE SEQUENCE IF NOT EXISTS dynamo.role_seq START 1 INCREMENT 1;

DROP TABLE IF EXISTS dynamo.role CASCADE;
CREATE TABLE dynamo.role (
    id BIGINT NOT NULL DEFAULT NEXTVAL('dynamo.role_seq'),
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    created_on TIMESTAMPTZ,
    modified_on TIMESTAMPTZ,
    CONSTRAINT role_pkey PRIMARY KEY (id)
);

-- ========================
-- User-Organization Map
-- ========================
CREATE SEQUENCE IF NOT EXISTS dynamo.user_organization_map_seq START 1 INCREMENT 1;

DROP TABLE IF EXISTS dynamo.user_organization_map CASCADE;
CREATE TABLE dynamo.user_organization_map (
    id BIGINT NOT NULL DEFAULT NEXTVAL('dynamo.user_organization_map_seq'),
    user_id UUID NOT NULL,
    organization_id BIGINT NOT NULL,
    created_on TIMESTAMPTZ,
    modified_on TIMESTAMPTZ,
    CONSTRAINT user_organization_map_pkey PRIMARY KEY (id),
    CONSTRAINT user_fkey FOREIGN KEY (user_id)
        REFERENCES dynamo."user" (unique_id),
    CONSTRAINT organization_fkey FOREIGN KEY (organization_id)
        REFERENCES dynamo.organization (id)
);

-- ========================
-- User-Group Map
-- ========================
CREATE SEQUENCE IF NOT EXISTS dynamo.user_group_map_seq START 1 INCREMENT 1;

DROP TABLE IF EXISTS dynamo.user_group_map CASCADE;
CREATE TABLE dynamo.user_group_map (
    id BIGINT NOT NULL DEFAULT NEXTVAL('dynamo.user_group_map_seq'),
    user_id UUID NOT NULL,
    group_id BIGINT NOT NULL,
    created_on TIMESTAMPTZ,
    modified_on TIMESTAMPTZ,
    CONSTRAINT user_group_map_pkey PRIMARY KEY (id),
    CONSTRAINT user_fkey1 FOREIGN KEY (user_id)
        REFERENCES dynamo."user" (unique_id),
    CONSTRAINT group_fkey FOREIGN KEY (group_id)
        REFERENCES dynamo."group" (id)
);

-- ========================
-- User-Role Map
-- ========================
CREATE SEQUENCE IF NOT EXISTS dynamo.user_role_map_seq START 1 INCREMENT 1;

DROP TABLE IF EXISTS dynamo.user_role_map CASCADE;
CREATE TABLE dynamo.user_role_map (
    id BIGINT NOT NULL DEFAULT NEXTVAL('dynamo.user_role_map_seq'),
    user_id UUID NOT NULL,
    role_id BIGINT NOT NULL,
    created_on TIMESTAMPTZ,
    modified_on TIMESTAMPTZ,
    CONSTRAINT user_role_map_pkey PRIMARY KEY (id),
    CONSTRAINT user_fkey FOREIGN KEY (user_id)
        REFERENCES dynamo."user" (unique_id),
    CONSTRAINT role_fkey FOREIGN KEY (role_id)
        REFERENCES dynamo.role (id)
);

-- ========================
-- LMS Course
-- ========================
CREATE SEQUENCE IF NOT EXISTS lms_svc.course_seq START 1 INCREMENT 1;

DROP TABLE IF EXISTS lms_svc.course CASCADE;
CREATE TABLE lms_svc.course (
    id BIGINT NOT NULL DEFAULT NEXTVAL('lms_svc.course_seq'),
    name VARCHAR(255) NOT NULL,
    unique_id UUID NOT NULL,
    description TEXT,
    photo_key TEXT NOT NULL,
    author_id UUID NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_on TIMESTAMPTZ,
    modified_on TIMESTAMPTZ,
    CONSTRAINT author_fkey FOREIGN KEY (author_id)
        REFERENCES dynamo."user" (unique_id),
    CONSTRAINT course_pkey PRIMARY KEY (id)
);

SELECT setval('lms_svc.course_seq', COALESCE((SELECT MAX(id) FROM lms_svc.course), 0) + 1, false);

-- ========================
-- LMS Topic
-- ========================
CREATE SEQUENCE IF NOT EXISTS lms_svc.topic_seq START 1 INCREMENT 1;

DROP TABLE IF EXISTS lms_svc.topic CASCADE;
CREATE TABLE lms_svc.topic (
    id BIGINT NOT NULL DEFAULT NEXTVAL('lms_svc.topic_seq'),
    course_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    duration BIGINT NOT NULL,
    created_on TIMESTAMPTZ,
    modified_on TIMESTAMPTZ,
    CONSTRAINT course_fkey FOREIGN KEY (course_id)
        REFERENCES lms_svc.course (id),
    CONSTRAINT topic_pkey PRIMARY KEY (id)
);


-- ========================
-- LMS User-Course Map
-- ========================
CREATE SEQUENCE IF NOT EXISTS lms_svc.user_course_map_seq START 1 INCREMENT 1;

DROP TABLE IF EXISTS lms_svc.user_course_map CASCADE;
CREATE TABLE lms_svc.user_course_map (
    id BIGINT NOT NULL DEFAULT NEXTVAL('lms_svc.user_course_map_seq'),
    course_id BIGINT,
    user_id UUID NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_on TIMESTAMPTZ,
    modified_on TIMESTAMPTZ,
    CONSTRAINT course_fkey FOREIGN KEY (course_id)
        REFERENCES lms_svc.course (id),
    CONSTRAINT user_fkey FOREIGN KEY (user_id)
        REFERENCES dynamo."user" (unique_id),
    CONSTRAINT user_course_map_pkey PRIMARY KEY (id)
);

SELECT setval('lms_svc.user_course_map_seq', COALESCE((SELECT MAX(id) FROM lms_svc.user_course_map), 0) + 1, false);

-- ========================
-- Extensions
-- ========================
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS hstore;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE SEQUENCE lms_svc.vector_store_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1
  CACHE 1;

DROP TABLE IF EXISTS lms_svc.vector_store CASCADE;
CREATE TABLE lms_svc.vector_store (
    id BIGINT NOT NULL UNIQUE DEFAULT NEXTVAL('lms_svc.vector_store_seq'),
    unique_id UUID NOT NULL UNIQUE,
    content TEXT,
    embedding VECTOR(1536),
    reference UUID NOT NULL,
    created_on TIMESTAMPTZ,
    modified_on TIMESTAMPTZ
);

CREATE INDEX ON lms_svc.vector_store USING HNSW (embedding vector_cosine_ops);

-- Development Query
-- Add IDM Information
INSERT INTO dynamo.idm_info (id, idm_unique_id, name, description, created_on, modified_on)
VALUES
    (1, 'us-east-1_0y9BCfovn', 'cognito', 'Amazon Cognito is a fully managed identity verification and user management service', NOW(), NOW());

INSERT INTO dynamo.organization (id, name, description, created_on, modified_on)
VALUES
    (1, 'breezeware', 'Breezeware is a leading software solutions company specializing in innovative products and services.', NOW(), NOW());

INSERT INTO dynamo.role (id, name, description, created_on, modified_on)
VALUES
    (1, 'author', 'The "author" role provides Course Creation feature.', NOW(), NOW()),
    (2, 'learner', 'The "learner" role provides Learning features.', NOW(), NOW());

INSERT INTO dynamo."group" (id, name, description, created_on, modified_on)
VALUES
    (1, 'lms', 'The generic group for the Learning Management System. All roles (author, learner, etc.) belong here.', NOW(), NOW());

-- ========================
-- Update Sequences
-- ========================
SELECT setval('dynamo.idm_info_seq', COALESCE((SELECT MAX(id) FROM dynamo.idm_info), 0) + 1, true);
SELECT setval('dynamo.user_seq', COALESCE((SELECT MAX(id) FROM dynamo."user"), 0) + 1, true);
SELECT setval('dynamo.organization_seq', COALESCE((SELECT MAX(id) FROM dynamo.organization), 0) + 1, true);
SELECT setval('dynamo.role_seq', COALESCE((SELECT MAX(id) FROM dynamo.role), 0) + 1, true);
SELECT setval('dynamo.group_seq', COALESCE((SELECT MAX(id) FROM dynamo."group"), 0) + 1, true);
SELECT setval('dynamo.user_organization_map_seq', COALESCE((SELECT MAX(id) FROM dynamo.user_organization_map), 0) + 1, true);
SELECT setval('dynamo.user_group_map_seq', COALESCE((SELECT MAX(id) FROM dynamo.user_group_map), 0) + 1, true);
SELECT setval('dynamo.user_role_map_seq', COALESCE((SELECT MAX(id) FROM dynamo.user_role_map), 0) + 1, true);
