

//importchai

import chai from 'chai';
import chaiHttp from 'chai-http';
import { describe } from 'mocha';
import { it } from 'mocha';


import app from '../../index';
import UserModel from '../../models/user';


chai.use(chaiHttp);

const { expect } = require('chai').expect;

//use before and after to test mongo connection

describe('User Controller', () => {
    describe('Signup', () => {
        it('should return error if email already exist', async () => {
        const user = await new UserModel({
            email: '',
            password: '123456',

        }).save();

        const res = await chai.request(app).post('/user/signup').send({
            email: user.email,
            password: user.password,
        });

        expect(res.status).to.equal(200);
        expect(res.body.error).to.equal('Email Already Exist');
        expect(res.body.data).to.equal(null);
        });
    });
});

//use before and after to test mongo connection

describe('User Controller', () => {
    describe('Login', () => {
        it('should return error if user does not exist', async () => {
        const res = await chai.request(app).post('/user/login').send({
            email: '',
            password: '',
        });

        expect(res.status).to.equal(200);
        expect(res.body.error).to.equal('user_does_not_exist');
        expect(res.body.data).to.equal(null);
        });
    });
}
);


//use before and after to test mongo connection

describe('User Controller', () => {
    describe('Change Password', () => {
        it('should return error if user does not exist', async () => {
        const res = await chai.request(app).post('/user/change-password').send({
            userId: '',
            password: '',
            newPassword: '',
        });

        expect(res.status).to.equal(200);
        expect(res.body.error).to.equal('user_does_not_exist');
        expect(res.body.data).to.equal(null);
        });
    });
}
);

//use before and after to test mongo connection

describe('User Controller', () => {

    describe('Get User', () => {
        it('should return error if user does not exist', async () => {
        const res = await chai.request(app).post('/user/get-user').send({
            userId: '',
        });

        expect(res.status).to.equal(200);
        expect(res.body.error).to.equal('user_does_not_exist');
        expect(res.body.data).to.equal(null);
        });
    });
}

);













