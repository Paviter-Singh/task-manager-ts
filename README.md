# Task-manager

This project is a Node.js application that demonstrates various features including image upload and retrieval using Express and Mongoose, JWT authentication, validation, instance and virtual methods in Mongoose, and Docker support.

## Implemented Features

1. **Mongoose**
    - Full TypeScript support
    - Instance methods
    - Virtual methods
    - Complex schema usage
    - Validation and various types

2. **Routes**
    - **User**
        - Add user
        - Log user
        - Logout user
        - Patch user
        - Delete user
        - Upload avatar
        - Get avatar
    - **Tasks**
        - Add task
        - Query tasks using query params

3. **Docker**
    - Support for Docker
    - Refer to the Dockerfile for more information

## Technologies and Libraries Used

- **Technologies**: Node.js, Express.js, TypeScript, Docker
- **Libraries**: Mongoose, Express, CORS, cookie-parser, jsonwebtoken, multer, dotenv

## Setting Up the Project

1. Clone the repository:

    ```bash
    git clone https://github.com/Paviter-Singh/task-manager-ts
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. For development mode, start with:

    ```bash
    npm run dev
    ```

4. For production mode, use:

    ```bash
    npm start
    ```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/my-feature`.
3. Make your changes and commit them: `git commit -am 'Add some feature'`.
4. Push to the branch: `git push origin feature/my-feature`.
5. Submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
