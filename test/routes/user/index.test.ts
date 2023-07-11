import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import express from 'express';
import _ from 'lodash';
import mongoose from 'mongoose';

import UserController, { ChangePasswordType } from '../../../controllers/user';
import { verifyToken } from '../../../utils/auth';

chai.use(chaiHttp);
const { expect } = chai;

describe('User Routes', () => {
    let app: express.Express;

    before(() => {
        app = express();
        app.use(express.json());

        app.post('/login', UserController.loginUser);
        app.post('/signup', UserController.signupUser);
        app.post('/', verifyToken, UserController.user);
        app.post('/changepassword', verifyToken, UserController.updatePassword);
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('/login', () => {
        it('should return token on successful login', async () => {
            const args = {
                email: 'test@example.com',
                password: 'password123',
            };

            const loginStub = sinon.stub(UserController, 'loginUser').resolves({
                error: null,
                data: {
                    token: 'token123',
                },
            });

            const res = await chai.request(app).post('/login').send(args);

            expect(loginStub.calledOnceWithExactly(args)).to.be.true;
            expect(res).to.have.status(200);
            expect(res.body).to.deep.equal({ token: 'token123' });
        });

        it('should return an error message when missing email or password', async () => {
            const args = {};

            const res = await chai.request(app).post('/login').send(args);

            expect(res).to.have.status(400);
            expect(res.body).to.equal('Missing params');
        });

        it('should return an error message on failed login', async () => {
            const args = {
                email: 'test@example.com',
                password: 'password123',
            };

            const loginStub = sinon.stub(UserController, 'loginUser').resolves({
                error: 'Invalid credentials',
                data: null,
            });

            const res = await chai.request(app).post('/login').send(args);

            expect(loginStub.calledOnceWithExactly(args)).to.be.true;
            expect(res).to.have.status(400);
            expect(res.body).to.equal('Invalid credentials');
        });
    });

    describe('/signup', () => {
        it('should return true on successful signup', async () => {
            const args = {
                email: 'test@example.com',
                password: 'password123',
            };

            const signupStub = sinon.stub(UserController, 'signupUser').resolves({
                error: null,
                data: true,
            });

            const res = await chai.request(app).post('/signup').send(args);

            expect(signupStub.calledOnceWithExactly(args)).to.be.true;
            expect(res).to.have.status(200);
            expect(res.body).to.be.true;
        });

        it('should return an error message when missing email or password', async () => {
            const args = {};

            const res = await chai.request(app).post('/signup').send(args);

            expect(res).to.have.status(400);
            expect(res.body).to.equal('Missing params');
        });

        it('should return an error message on failed signup', async () => {
            const args = {
                email: 'test@example.com',
                password: 'password123',
            };

            const signupStub = sinon.stub(UserController, 'signupUser').resolves({
                error: 'Email already exists',
                data: null,
            });

            const res = await chai.request(app).post('/signup').send(args);

            expect(signupStub.calledOnceWithExactly(args)).to.be.true;
            expect(res).to.have.status(400);
            expect(res.body).to.equal('Email already exists');
        });
    });

    describe('/', () => {
        it('should return user data on successful request', async () => {
            const userId = '123';

            const userStub = sinon.stub(UserController, 'user').resolves({
                error: null,
                data: { _id: userId, email: 'test@example.com' },
            });

            const res = await chai.request(app).post('/').send({ userId });

            expect(userStub.calledOnceWithExactly({ userId })).to.be.true;
            expect(res).to.have.status(200);
            expect(res.body).to.deep.equal({ _id: userId, email: 'test@example.com' });
        });

        it('should return an error message when missing userId', async () => {
            const res = await chai.request(app).post('/').send({});

            expect(res).to.have.status(400);
            expect(res.body).to.equal('Missing params');
        });

        it('should return an error message on failed request', async () => {
            const userId = '123';

            const userStub = sinon.stub(UserController, 'user').resolves({
                error: 'User not found',
                data: null,
            });

            const res = await chai.request(app).post('/').send({ userId });

            expect(userStub.calledOnceWithExactly({ userId })).to.be.true;
            expect(res).to.have.status(400);
            expect(res.body).to.equal('User not found');
        });
    });

    describe('/changepassword', () => {
        it('should return true on successful password change', async () => {
            const args = {
                password: 'current123',
                newPassword: 'new123',
            };

            const updatePasswordStub = sinon.stub(UserController, 'updatePassword').resolves({
                error: null,
                data: true,
            });

            const res = await chai.request(app).post('/changepassword').send(args);
            //@ts-ignore
            expect(updatePasswordStub.calledOnceWithExactly(args)).to.be.true;
            expect(res).to.have.status(200);
            expect(res.body).to.be.true;
        });

        it('should return an error message when missing password or newPassword', async () => {
            const args = {};

            const res = await chai.request(app).post('/changepassword').send(args);

            expect(res).to.have.status(400);
            expect(res.body).to.equal('Missing params');
        });

        it('should return an error message on failed password change', async () => {
            const updatePasswordStub =
                sinon.stub(UserController, 'updatePassword').resolves({
                    error: 'Failed to update password',
                    data: null,
                });
            const args: ChangePasswordType = {
                userId: '123',
                password: 'current123',
                newPassword: 'new123',
            };
            const res = await chai.request(app).post('/changepassword').send(args);

            expect(updatePasswordStub.calledOnceWithExactly(args)).to.be.true;
            expect(res).to.have.status(400);
            expect(res.body).to.equal('Failed to update password');
        });
    });
});

afterEach(() => {
    sinon.restore();
}
);

after(() => {
    mongoose.connection.close();
}
);


