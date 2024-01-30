jest.mock('../public/js/login');
jest.mock('..config/db'); 
jest.mock('bcrypt');

const supertest = require('supertest');
const {db} = require('../config/db');
const Auth = require('../public/js/login');
const {loginController} = require('../controllers/login-controller');

//This testing is still in progress

const request1 = {
    body: {
        username: 'user1',
        password: 'password1'
    }
}
const request0 = {
    body: {
        username: 'user0',
        password: 'password0'
    }
}
const response = {
    status: jest.fn((x) => x)
}

describe("POST login functions", () =>{

    test("Should send status code of 201 if credentials are correct", async () =>{
        await Auth.existingUser.mockReturnValueOnce(5);
        await Auth.passwordHashed.mockReturnValueOnce('$2b$10$HqAswU87m/ep2WSdCDPYDOGGiT1m1VHJ/1UjU/CTxU118h9terjP.');
        
        await loginController(request1, response,db);   //Because the database is mocked, it can be passed into the controller
        expect(response.status).toHaveBeenCalledWith(201);
        
     })
    
    test("Should send a status code of 400 if credentials are incorrect", async () => {
        await Auth.existingUser.mockReturnValueOnce(-1);
        await Auth.passwordHashed.mockReturnValueOnce('$2b$10$HqAswU87m/ep2WSdCDPYDOGGiT1m1VHJ/1UjU/CTxU118h9terjP.');
        
        await loginController(request0,response,db);
        expect(response.status).toHaveBeenCalledWith(400);
    })
})

