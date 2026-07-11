-- =====================================================================
-- Smart Library Management System - full reference schema (MariaDB)
-- Matches the JPA entities under com.smartlibrary.model.
-- Spring Boot's spring.jpa.hibernate.ddl-auto=update will create/alter
-- these automatically on boot - this file is for manual setup, review,
-- and production migrations where auto-DDL is turned off.
-- =====================================================================

CREATE DATABASE IF NOT EXISTS smart_library CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE smart_library;

-- ---------------------------------------------------------------- users
CREATE TABLE IF NOT EXISTS users (
  id                  BIGINT AUTO_INCREMENT PRIMARY KEY,
  name                VARCHAR(255),
  email               VARCHAR(255) NOT NULL UNIQUE,
  password            VARCHAR(255) NOT NULL, -- TODO: BCrypt hash, currently plain text
  role                VARCHAR(20)  NOT NULL DEFAULT 'USER', -- USER | ADMIN
  preferred_category  VARCHAR(255),
  profile_pic         VARCHAR(5000)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- element collection for User.favoriteBookIds
CREATE TABLE IF NOT EXISTS user_favorite_book_ids (
  user_id           BIGINT NOT NULL,
  favorite_book_ids BIGINT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------------- books
CREATE TABLE IF NOT EXISTS books (
  id           BIGINT AUTO_INCREMENT PRIMARY KEY,
  title        VARCHAR(255),
  author       VARCHAR(255),
  category     VARCHAR(255),
  cover_image  VARCHAR(5000),
  new_release  TINYINT(1) DEFAULT 0,
  pdf_url      VARCHAR(10000),
  summary      TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------- categories
CREATE TABLE IF NOT EXISTS categories (
  id    BIGINT AUTO_INCREMENT PRIMARY KEY,
  name  VARCHAR(255) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------ exchanges
CREATE TABLE IF NOT EXISTS exchanges (
  id               BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id          BIGINT,
  user_name        VARCHAR(255),
  book_title_have  VARCHAR(255),
  book_title_want  VARCHAR(255),
  message          VARCHAR(2000),
  contact_email    VARCHAR(255),
  location         VARCHAR(255),   -- legacy, kept for older rows
  book_pic         VARCHAR(5000),  -- legacy, kept for older rows
  status           VARCHAR(20) NOT NULL DEFAULT 'PENDING', -- PENDING | APPROVED | COMPLETED | REJECTED
  created_at       DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------- exchange_messages
-- Chat thread attached to a single exchange listing (the "Book Exchange
-- messaging system" requirement).
CREATE TABLE IF NOT EXISTS exchange_messages (
  id           BIGINT AUTO_INCREMENT PRIMARY KEY,
  exchange_id  BIGINT NOT NULL,
  sender_id    BIGINT NOT NULL,
  sender_name  VARCHAR(255),
  content      VARCHAR(2000) NOT NULL,
  sent_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (exchange_id) REFERENCES exchanges(id) ON DELETE CASCADE,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -------------------------------------------------------- reading_list
-- A user's personal shelf ("wishlist"): saved books + reading status + note.
CREATE TABLE IF NOT EXISTS reading_list (
  id         BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id    BIGINT NOT NULL,
  book_id    BIGINT NOT NULL,
  status     VARCHAR(30) NOT NULL DEFAULT 'To Read', -- To Read | Currently Reading | Finished
  note       VARCHAR(1000),
  added_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_user_book (user_id, book_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------- chat_messages
-- AI chatbot conversation history, grouped by conversation_id (a UUID the
-- frontend generates per chat session).
CREATE TABLE IF NOT EXISTS chat_messages (
  id               BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id          BIGINT NOT NULL,
  conversation_id  VARCHAR(64) NOT NULL,
  role             VARCHAR(20) NOT NULL, -- user | assistant
  content          VARCHAR(4000) NOT NULL,
  created_at       DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_conversation (conversation_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
