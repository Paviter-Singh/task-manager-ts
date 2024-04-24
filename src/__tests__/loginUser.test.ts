
import request from 'supertest';
import app from "../app"
import mongoose from "mongoose"
import { MongoMemoryServer } from 'mongodb-memory-server';

beforeAll(async () => {
    const mongoSever = await MongoMemoryServer.create()
    await mongoose.connect(mongoSever.getUri())
})

afterAll(async ()=>{
    await mongoose.disconnect()
    await mongoose.connection.close()
})

describe('POST /user', () => {
    
    const userData = {
        "name":"paviter Singh",
        "password":"12341234",
        "email": "paviterssidngh4266@gmail.codms",
        "age":24
     }
    test('creates a new user', async () => {
        const response = await request(app)
            .post('/user')
            .send(userData);

        expect(response.status).toBe(201);
        // Add more assertions as needed
    });
    test('returns error if email already exists', async () => {
        const response = await request(app)
            .post('/user')
            .send(userData);

        expect(response.status).toBe(400);
        expect(response.text).toBe('email exists');
    });
});

describe('POST /users/login', () => {
    test('logs in a user with valid credentials', async () => {
        const userData = {
            email: 'paviterssidngh4266@gmail.codms',
            password: '12341234',
        };

        const response = await request(app)
            .post('/users/login')
            .send(userData);

        expect(response.status).toBe(200);
        // Add more assertions as needed
    });

    test('returns error with invalid credentials', async () => {
        const userData = {
            email: 'paviterssidngh4266@gmail.codms',
            password: '123412f34',
        };

        const response = await request(app)
            .post('/users/login')
            .send(userData);

        expect(response.status).toBe(400);
        // Add more assertions as needed
    });
});