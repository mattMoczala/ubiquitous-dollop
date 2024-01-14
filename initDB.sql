-- Tabela games
CREATE TABLE games (
    id SERIAL PRIMARY KEY,
    title TEXT,
    description TEXT,
    image_link TEXT,
    created_at DATE default CURRENT_DATE
);

-- Tabela users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    login TEXT,
    passwd TEXT,
    displayName TEXT,
    role TEXT,
    created_at DATE default CURRENT_DATE
);

-- Tabela reviews
CREATE TABLE reviews (
    reviewer_user_id INTEGER REFERENCES users(id),
    reviewed_game_id INTEGER REFERENCES games(id),
    review INTEGER,
    created_at DATE default CURRENT_DATE
);

-- Tabele audit_log
CREATE TABLE audit_log (
        id SERIAL,
        login VARCHAR(255) NOT NULL,
        event_type VARCHAR(50) NOT NULL,
        event_date DATE default CURRENT_DATE,
        PRIMARY KEY ("id")
);

-- Wstawianie przykładowych danych do tabeli games
INSERT INTO games (title, description, image_link, created_at) VALUES
    ('The Witcher 3: Wild Hunt', 'Action RPG with a rich storyline', 'https://example.com/witcher3.jpg', '2023-01-01'),
    ('FIFA 22', 'Football simulation game', 'https://example.com/fifa22.jpg', '2023-01-02'),
    ('Among Us', 'Multiplayer party game of teamwork and betrayal', 'https://example.com/amongus.jpg', '2023-01-03');

-- Wstawianie przykładowych danych do tabeli users
INSERT INTO users (login, passwd, displayName, role, created_at) VALUES
    ('john_doe', 'hashed_password1', 'John Doe', 'user', '2023-01-01'),
    ('alice_smith', 'hashed_password2', 'Alice Smith', 'user', '2023-01-02'),
    ('admin_user', 'hashed_password3', 'Admin User', 'admin', '2023-01-03');

-- Wstawianie przykładowych danych do tabeli reviews
INSERT INTO reviews (id, reviewer_user_id, reviewed_game_id, review, created_at) VALUES
    (1, 1, 1, 5, '2023-01-05'),
    (2, 2, 1, 4, '2023-01-06'),
    (3, 3, 2, 5, '2023-01-07');

    -- Przykładowe polecenie aktualizujące image_link dla trzech gier
UPDATE games
SET image_link = CASE
    WHEN title = 'The Witcher 3: Wild Hunt' THEN 'https://gaming-cdn.com/images/products/268/orig/the-witcher-3-wild-hunt-pc-game-gog-com-cover.jpg?v=1698413872'
    WHEN title = 'FIFA 22' THEN 'https://bi.im-g.pl/im/54/0b/1a/z27311700IER,FIFA-22.jpg'
    WHEN title = 'Among Us' THEN 'https://img.redbull.com/images/c_limit,w_1500,h_1000,f_auto,q_auto/redbullcom/2020/9/5/hsllandhvzrnmgjd9fw7/among-us'
    ELSE image_link
END
WHERE title IN ('The Witcher 3: Wild Hunt', 'FIFA 22', 'Among Us');