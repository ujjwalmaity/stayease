# stayease
StayEase - Book your hotel now

# Frontend Setup

```
cd stayease-app
npm install
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

# Backend Setup

- Java 17, Spring Boot 3.3.4 (Web, Data JPA, Security, Validation), JWT (jjwt 0.12), BCrypt, H2 (dev) / PostgreSQL (prod), Springdoc OpenAPI/Swagger.
---

## Roles & Seed Users (password: `password123`)

| Email | Role |
|---|---|
| `admin@stayease.com`  | ADMIN   |
| `mgr1@stayease.com`   | MANAGER |
| `guest1@stayease.com` | GUEST   |

Role is stored as `enum Role { GUEST, MANAGER, ADMIN }` on the `users` table, mapped to a JWT claim and Spring Security `ROLE_*` authorities. New registrations always default to GUEST. MANAGER/ADMIN accounts are seeded by Admin.

---

## Project Layout

```
stayease/
├── backend/           # Spring Boot API
│   ├── pom.xml
│   └── src/main/java/com/stayease/
│       ├── config, security, exception, common
│       ├── user/      (controller, service, repository, entity, dto)
│       ├── hotel/
│       ├── room/
│       └── booking/
```

---

## Run

### Backend

```bash
cd backend
mvn spring-boot:run
# Dev profile uses in-memory H2 (auto seeded). Profile: dev (default)
# Swagger UI: http://localhost:8080/swagger-ui.html
# H2 console: http://localhost:8080/h2-console (jdbc:h2:mem:stayease)
```

To run with PostgreSQL:

```bash
SPRING_PROFILES_ACTIVE=prod \
DB_URL=jdbc:postgresql://localhost:5432/stayease \
DB_USER=postgres DB_PASS=postgres \
JWT_SECRET=<base64-encoded-256-bit-secret> \
mvn spring-boot:run
```

Tests:

```bash
cd backend && mvn test
```

---
