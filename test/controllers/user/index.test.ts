import chai from 'chai';
import sinon from 'sinon';
import UserModel, { UserType } from '../../../models/user';
import * as authUtils from '../../../utils/auth';
import userController from '../../../controllers/user';

const { expect } = chai;

describe('userController', () => {
    describe('signupUser', () => {
        it('should create a new user when the email does not already exist', async () => {
            const args = {
                email: 'test@example.com',
                password: 'password123',
            };

            const user: UserType = { _id: '123', email: args.email, password: args.password } as any;
            const findOneStub = sinon.stub(UserModel, 'findOne').returns({ exec: sinon.stub().resolves(null) } as any);
            const saveStub = sinon.stub(UserModel.prototype, 'save').resolves(user);

            const result = await userController.signupUser(args);

            expect(findOneStub.calledOnceWithExactly({ email: args.email })).to.be.true;
            expect(saveStub.calledOnceWithExactly()).to.be.true;
            expect(result.error).to.be.null;
            expect(result.data).to.deep.equal(user);

            findOneStub.restore();
            saveStub.restore();
        });

        it('should return an error when the email already exists', async () => {
            const args = {
                email: 'test@example.com',
                password: 'password123',
            };

            const existingUser: UserType = { email: args.email } as any;
            const findOneStub = sinon.stub(UserModel, 'findOne').returns({ exec: sinon.stub().resolves(existingUser) } as any);

            const result = await userController.signupUser(args);

            expect(findOneStub.calledOnceWithExactly({ email: args.email })).to.be.true;
            expect(result.error).to.equal('Email Already Exist');
            expect(result.data).to.be.null;

            findOneStub.restore();
        });
    });

    describe('loginUser', () => {
        // ...

        it('should authenticate and return a token when the user exists and the password is correct', async () => {
            const args = {
                email: 'test@example.com',
                password: 'password123',
            };

            const user: UserType = { _id: '123', email: args.email } as any;
            const findOneStub = sinon.stub(UserModel, 'findOne').resolves(user);
            const authenticateStub = sinon.stub().returns(true);
            const authenticateStubWrapper = sinon.stub(user, 'authenticate' as any).returns(authenticateStub);
            const createTokenStub = sinon.stub(authUtils, 'createToken').returns('token123');

            const result = await userController.loginUser(args);

            expect(findOneStub.calledOnceWithExactly({ email: args.email })).to.be.true;
            expect(authenticateStubWrapper.calledOnceWithExactly(args.password)).to.be.true;
            // @ts-ignore
            expect(createTokenStub.calledOnceWithExactly(user)).to.be.true;
            expect((result.data as UserType)?.token).to.equal('token123');

            findOneStub.restore();
            (authenticateStubWrapper as any).restore();
            createTokenStub.restore();
        });


        it('should return an error when the user does not exist', async () => {
            const args = {
                email: 'test@example.com',
                password: 'password123',
            };

            const findOneStub = sinon.stub(UserModel, 'findOne').returns({ exec: sinon.stub().resolves(null) } as any);

            const result = await userController.loginUser(args);

            expect(findOneStub.calledOnceWithExactly({ email: args.email })).to.be.true;
            expect(result.error).to.equal('user_does_not_exist');
            expect(result.data).to.be.null;

            findOneStub.restore();
        });

        it('should return an error when the password is incorrect', async () => {
            const args = {
                email: 'test@example.com',
                password: 'password123',
            };

            const user: UserType = { _id: '123', email: args.email } as any;
            const findOneStub = sinon.stub(UserModel, 'findOne').returns({ exec: sinon.stub().resolves(user) } as any);
            const authenticateStub = sinon.stub().returns(false);
            const authenticateStubWrapper = sinon.stub(user, 'authenticate' as any).returns(authenticateStub);

            const result = await userController.loginUser(args);

            expect(findOneStub.calledOnceWithExactly({ email: args.email })).to.be.true;
            expect(authenticateStubWrapper.calledOnceWithExactly(args.password)).to.be.true;
            expect(result.error).to.equal('password_is_incorrect');
            expect(result.data).to.be.null;

            findOneStub.restore();
            (authenticateStubWrapper as any).restore();
        });
    });

    describe('updatePassword', () => {
        it('should update the user password when the current password is correct', async () => {
            const args = {
                userId: '123',
                password: 'current123',
                newPassword: 'new123',
            };

            const user: UserType = { _id: args.userId } as any;
            const findOneStub = sinon.stub(UserModel, 'findOne').returns({ exec: sinon.stub().resolves(user) } as any);
            const authenticateStub = sinon.stub().returns(true);
            const authenticateStubWrapper = sinon.stub(user, 'authenticate' as any).returns(authenticateStub);
            const updateOneStub = sinon.stub(UserModel, 'updateOne');

            const result = await userController.updatePassword(args);

            expect(findOneStub.calledOnceWithExactly({ _id: args.userId })).to.be.true;
            expect(authenticateStubWrapper.calledOnceWithExactly(args.password)).to.be.true;
            expect(updateOneStub.calledOnceWithExactly({ _id: args.userId }, { password: args.newPassword })).to.be.true;
            expect(result.error).to.be.null;
            expect(result.data).to.deep.equal(user);

            findOneStub.restore();
            (authenticateStubWrapper as any).restore();
            updateOneStub.restore();
        });

        it('should return an error when the current password is incorrect', async () => {
            const args = {
                userId: '123',
                password: 'current123',
                newPassword: 'new123',
            };

            const user: UserType = { _id: args.userId } as any;
            const findOneStub = sinon.stub(UserModel, 'findOne').returns({ exec: sinon.stub().resolves(user) } as any);
            const authenticateStub = sinon.stub().returns(false);
            const authenticateStubWrapper = sinon.stub(user, 'authenticate' as any).returns(authenticateStub);

            const result = await userController.updatePassword(args);

            expect(findOneStub.calledOnceWithExactly({ _id: args.userId })).to.be.true;
            expect(authenticateStubWrapper.calledOnceWithExactly(args.password)).to.be.true;
            expect(result.error).to.equal('password_is_incorrect');
            expect(result.data).to.be.null;

            findOneStub.restore();
            (authenticateStubWrapper as any).restore();
        });
    });

    describe('user', () => {
        it('should return data by userID', async () => {
            const args = {
                userId: '123',
            };

            const user: UserType = { _id: args.userId } as any;
            const findOneStub = sinon.stub(UserModel, 'findOne').returns({ exec: sinon.stub().resolves(user) } as any);

            const result = await userController.user(args);

            expect(findOneStub.calledOnceWithExactly({ _id: args.userId })).to.be.true;
            expect(result.error).to.be.null;
            expect(result.data).to.deep.equal(user);

            findOneStub.restore();
        });
    });

});

