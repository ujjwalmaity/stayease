-- Seed users: passwords are BCrypt for "password123"
INSERT INTO users (id, email, password_hash, name, role, created_at) VALUES
 (1, 'admin@stayease.com',  '$2b$10$J8CidE4EwjL1zUwXTGyVB.bE8EfYMAUnhj1kLrHbRRdpWgBQ1IZUC', 'Admin User',  'ADMIN',   CURRENT_TIMESTAMP),
 (2, 'mgr1@stayease.com',   '$2b$10$J8CidE4EwjL1zUwXTGyVB.bE8EfYMAUnhj1kLrHbRRdpWgBQ1IZUC', 'Hotel Mgr',   'MANAGER', CURRENT_TIMESTAMP),
 (3, 'guest1@stayease.com', '$2b$10$J8CidE4EwjL1zUwXTGyVB.bE8EfYMAUnhj1kLrHbRRdpWgBQ1IZUC', 'Rohit Verma', 'GUEST',   CURRENT_TIMESTAMP);

INSERT INTO hotels (id, name, city, star_rating, description, cover_image_url, manager_id, created_at) VALUES
 (1, 'Sunset Palms', 'Goa', 4, 'Beachfront resort with pool', 'https://picsum.photos/seed/hotel1/400', 2, CURRENT_TIMESTAMP),
 (2, 'City Inn',     'Goa', 3, 'Budget-friendly city centre hotel', 'https://picsum.photos/seed/hotel2/400', 2, CURRENT_TIMESTAMP),
 (3, 'Mountain View','Manali', 5, 'Luxury suites with mountain view','https://picsum.photos/seed/hotel3/400', 2, CURRENT_TIMESTAMP);

INSERT INTO rooms (id, hotel_id, room_number, room_type, price_per_night, max_occupancy, description, image_url, is_active, created_at) VALUES
 (1, 1, '101', 'DOUBLE', 3500.00, 2, 'Cozy double room', 'https://picsum.photos/seed/r1/400', true, CURRENT_TIMESTAMP),
 (2, 1, '201', 'SUITE',  7000.00, 3, 'Spacious suite',  'https://picsum.photos/seed/r2/400', true, CURRENT_TIMESTAMP),
 (3, 2, '101', 'SINGLE', 1500.00, 1, 'Single room',     'https://picsum.photos/seed/r3/400', true, CURRENT_TIMESTAMP),
 (4, 3, '301', 'SUITE',  9500.00, 4, 'Mountain suite',  'https://picsum.photos/seed/r4/400', true, CURRENT_TIMESTAMP);

ALTER TABLE users  ALTER COLUMN id RESTART WITH 100;
ALTER TABLE hotels ALTER COLUMN id RESTART WITH 100;
ALTER TABLE rooms  ALTER COLUMN id RESTART WITH 100;
