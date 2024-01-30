jest.mock('../public/js/signup');
jest.mock('bcrypt');
jest.mock('../config/db');

const supertest = require('supertest');
const Register = require('../public/js/signup');
const {signupController} = require('../controllers/signup-controller');
const {db} = require('../config/db');
const bcrypt = require('bcrypt');

//I need to provide a mock database for the testing. Pass the mock db into the signupController
//This testing is still in progress

const request1 = {
    body: {
        email: 'email1',
        username: 'user1',
        password: 'password0'
    }
}
const request0 = {
    body: {
        email:'email0',
        username: 'user0',
        password: 'password0'
    }
}
const request2 = {
    body: {
        email:'email1',
        username: 'user0',
        password: 'password0'
    }
}
const response = {
    status: jest.fn((x) => x)
}

describe("POST signup functions", ()=>{

    test("Should create a new user if the email and password are unique, sending a status code of 200", async ()=>{
        Register.checkDB.mockResolvedValueOnce(1);
        Register.createUser.mockResolvedValueOnce('success');
        bcrypt.hash.mockResolvedValueOnce('7dSHAHadi@sJFAJ4HAnAF18fh64gsG110hHad63');

        await signupController(request1,response,db);
        //expect(Register.createUser).toHaveBeenCalledWith();
        expect(response.status).toHaveBeenCalledWith(202);
    })

    test("Should send a status code of 405 if the email already exist in the database", async ()=>{
        Register.checkDB.mockResolvedValueOnce(-1);
        bcrypt.hash.mockResolvedValueOnce('7dSHAHadi@sJFAJ4HAnAF18fh64gsG110hHad63');

        await signupController(request0,response,db);
        //expect(Register.createUser).toHaveBeenCalledWith();
        expect(response.status).toHaveBeenCalledWith(405);
    })

    test("Should send a status code of 406 if the email is unique but the username is not unique to the database", async ()=>{
        Register.checkDB.mockResolvedValueOnce(0);
        bcrypt.hash.mockResolvedValueOnce('7dSHAHadi@sJFAJ4HAnAF18fh64gsG110hHad63');

        await signupController(request2,response,db);
        //expect(Register.createUser).toHaveBeenCalledWith();
        expect(response.status).toHaveBeenCalledWith(406);
    })
})