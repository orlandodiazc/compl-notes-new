# Compl Notes <a name="about-project"></a>

**Compl Notes** is a full-stack application designed for tracking your notes and those of your friends.

[Live Site](https://compl-notes.odiaz.com.co/)
[API Documentaion](https://compl-notes.odiaz.com.co/api/docs/swagger-ui/index.html)

## Key Features <a name="key-features"></a>

- User registration and login capabilities
- Admin functionality (username: `admin`, password: `123456`)
- Public access to read notes
- Users can create, update, and delete their own notes
- Admins have full CRUD access to all users' notes
- Supports image uploading and management for all notes
- Includes swagger docs built with `springdoc`

## Built With <a name="built-with"></a>

This project was created using:

### Backend

#### Server

- Spring Boot
- Spring Security
- Spring Data
- Java Bean Validation
- Springdoc

#### Database

- PostgreSQL

### Frontend

- TypeScript
- React
- React Router
- Tanstack Query
- TailwindCSS
- Conform: form validation

## Screenshots

### Desktop

<img src="frontend/public/opengraph-image.webp" height=500/>

### Mobile

<img src="frontend/public/mobile_screenshot.webp" height=500/>

## Getting Started <a name="getting-started"></a>

Clone the repository into your machine (Or download the .zip file and extract).

```shell
git clone https://github.com/orlandodiazc/compl-notes
```

To get a local copy up and running:

#### Prerequisites

- [Docker](https://docs.docker.com/desktop/)
- Java 17 JDK ([Temurin](https://adoptium.net/temurin/releases/?version=17&package=jdk) and [SDKMAN](https://sdkman.io/install) are recommended)
- [PostgreSQL](https://www.postgresql.org/) (included in docker compose)
- [Node.js](https://nodejs.org/en/) ([Volta](https://volta.sh/) is recommended)
- [pnpm](https://pnpm.io/installation) or npm

#### Setup

You'll need to configure the user and password for the database in the [application properties](backend/src/main/resources/application.properties) and [docker-compose.yml](backend/docker-compose.yml).

#### Usage

```shell
cd compl-notes/backend
docker compose up -d
./mvnw spring-boot:run
cd ../frontend
pnpm install
pnpm dev
```

## Authors <a name="authors"></a>

👤 **Orlando Diaz**

- GitHub: [@orlandodiazc](https://github.com/orlandodiazc)
- LinkedIn: [Orlando Diaz Conde](www.linkedin.com/in/orlando-diaz-conde)

## ⭐️ Show your support <a name="support"></a>

Give a star if you like this project!

<!-- LICENSE -->

## 📝 License <a name="license"></a>

This project is [MIT](./LICENSE) licensed.
