CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS shopping_list (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_at DATE DEFAULT SYSDATE,
    modified_at DATE DEFAULT SYSDATE,
    modified_by_user_id INT REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS shopping_list_users (
    id SERIAL PRIMARY KEY,
    shopping_list_id INT REFERENCES shopping_list(id),
    user_id INT REFERENCES users(id),
    is_owner BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS itens (
    id SERIAL PRIMARY KEY,
    shopping_list_id INT REFERENCES shopping_list(id),
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2),
    category VARCHAR(50),
    is_checked BOOLEAN DEFAULT FALSE,
    created_at DATE DEFAULT SYSDATE,
    modified_at DATE DEFAULT SYSDATE,
    modified_by_user_id INT REFERENCES users(id)
);