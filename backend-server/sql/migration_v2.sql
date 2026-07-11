-- =====================================================================
-- Incremental migration: run this against an existing smart_library DB
-- (e.g. the one from dump-smart_library-*.sql) to bring it up to the
-- structure the refactored backend expects. Hibernate's ddl-auto=update
-- will also apply most of this automatically on next boot, but keep this
-- for environments where auto-DDL is disabled.
-- =====================================================================
USE smart_library;

ALTER TABLE exchanges
  ADD COLUMN user_id BIGINT NULL AFTER id,
  ADD COLUMN user_name VARCHAR(255) NULL AFTER user_id,
  ADD COLUMN book_title_have VARCHAR(255) NULL AFTER user_name,
  ADD COLUMN book_title_want VARCHAR(255) NULL AFTER book_title_have,
  ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'PENDING' AFTER book_pic,
  ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP AFTER status;

-- book_title column existed before; keep old data readable by copying it over
UPDATE exchanges SET book_title_have = book_title WHERE book_title_have IS NULL;
ALTER TABLE exchanges DROP COLUMN book_title;

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

CREATE TABLE IF NOT EXISTS reading_list (
  id         BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id    BIGINT NOT NULL,
  book_id    BIGINT NOT NULL,
  status     VARCHAR(30) NOT NULL DEFAULT 'To Read',
  note       VARCHAR(1000),
  added_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_user_book (user_id, book_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS chat_messages (
  id               BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id          BIGINT NOT NULL,
  conversation_id  VARCHAR(64) NOT NULL,
  role             VARCHAR(20) NOT NULL,
  content          VARCHAR(4000) NOT NULL,
  created_at       DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_conversation (conversation_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
