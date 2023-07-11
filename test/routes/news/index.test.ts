//write unit tests for news route here

import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import express from 'express';
import _ from 'lodash';
import mongoose from 'mongoose';

import NewsController from '../../../controllers/news';

chai.use(chaiHttp);
const { expect } = chai;

describe('News Routes', () => {

    let app: express.Express;

    before(() => {
        app = express();
        app.use(express.json());

        app.post('/news', NewsController.fetchNews);
        app.post('/news/read', NewsController.markNewsArticleAsRead);
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('/news', () => {
        it('should return an error message when missing userId', async () => {
            const args = {};

            const res = await chai.request(app).post('/news').send(args);

            expect(res).to.have.status(400);
            expect(res.body).to.equal('Missing params');
        });

        it('should return an error message when userId is empty', async () => {
            const args = {
                userId: '',
            };

            const res = await chai.request(app).post('/news').send(args);

            expect(res).to.have.status(400);
            expect(res.body).to.equal('Missing params');
        });

        it('should return an error message when user does not exist', async () => {
            const args = {
                userId: '123',
            };

            const fetchNewsStub = sinon.stub(NewsController, 'fetchNews').resolves({
                error: 'user_does_not_exist',
                data: null,
            });

            const res = await chai.request(app).post('/news').send(args);

            expect(fetchNewsStub.calledOnceWithExactly(args)).to.be.true;
            expect(res).to.have.status(400);
            expect(res.body).to.deep.equal({ error: 'user_does_not_exist', data: null });
        });

        it('should return an error message when user does not have preferences', async () => {
            const args = {
                userId: '123',
            };

            const fetchNewsStub = sinon.stub(NewsController, 'fetchNews').resolves({
                error: 'user_does_not_have_preferences',
                data: null,
            });

            const res = await chai.request(app).post('/news').send(args);

            expect(fetchNewsStub.calledOnceWithExactly(args)).to.be.true;
            expect(res).to.have.status(400);
            expect(res.body).to.deep.equal({ error: 'user_does_not_have_preferences', data: null });
        });

        it('should return news articles when user exists and has preferences', async () => {
            const args = {
                userId: '123',
            };

            const fetchNewsStub = sinon.stub(NewsController, 'fetchNews').resolves({
                error: null,
                data: {
                    news: [],
                },
            });

            const res = await chai.request(app).post('/news').send(args);

            expect(fetchNewsStub.calledOnceWithExactly(args)).to.be.true;
            expect(res).to.have.status(200);
            expect(res.body).to.deep.equal({ news: [] });
        }
        );
    });

    describe('/news/read', () => {
        it('should return an error message when missing userId', async () => {
            const args = {};

            const res = await chai.request(app).post('/news/read').send(args);

            expect(res).to.have.status(400);
            expect(res.body).to.equal('Missing params');
        });

        it('should return an error message when userId is empty', async () => {
            const args = {
                userId: '',
            };

            const res = await chai.request(app).post('/news/read').send(args);

            expect(res).to.have.status(400);
            expect(res.body).to.equal('Missing params');
        });

        it('should return an error message when missing articleId', async () => {
            const args = {
                userId: '123',
            };

            const res = await chai.request(app).post('/news/read').send(args);

            expect(res).to.have.status(400);
            expect(res.body).to.equal('Missing params');
        });

        it('should return an error message when articleId is empty', async () => {
            const args = {
                userId: '123',
                articleId: '',
            };

            const res = await chai.request(app).post('/news/read').send(args);

            expect(res).to.have.status(400);
            expect(res.body).to.equal('Missing params');
        });

        it('should return an error message when user does not exist', async () => {
            const args = {
                userId: '123',
                articleId: '456',
            };

            const markNewsArticleAsReadStub = sinon.stub(NewsController, 'markNewsArticleAsRead').resolves({
                error: 'user_does_not_exist',
                data: null,
            });

            const res = await chai.request(app).post('/news/read').send(args);
            //@ts-ignore
            expect(markNewsArticleAsReadStub.calledOnceWithExactly(args)).to.be.true;
            expect(res).to.have.status(400);
            expect(res.body).to.deep.equal({ error: 'user_does_not_exist', data: null });
        });

        it('should return an error message when article does not exist', async () => {
            const args = {
                userId: '123',
                articleId: '456',
            };

            const markNewsArticleAsReadStub = sinon.stub(NewsController, 'markNewsArticleAsRead').resolves({
                error: 'article_does_not_exist',
                data: null,
            });

            const res = await chai.request(app).post('/news/read').send(args);
           //@ts-ignore
            expect(markNewsArticleAsReadStub.calledOnceWithExactly(args)).to.be.true;
            expect(res).to.have.status(400);
            expect(res.body).to.deep.equal({ error: 'article_does_not_exist', data: null });
        });

        it('should return an error message when article is already read', async () => {

            const args = {
                userId: '123',
                articleId: '456',
            };

            const markNewsArticleAsReadStub = sinon.stub(NewsController, 'markNewsArticleAsRead').resolves({
                error: 'article_already_read',
                data: null,
            });

            const res = await chai.request(app).post('/news/read').send(args);
           //@ts-ignore
            expect(markNewsArticleAsReadStub.calledOnceWithExactly(args)).to.be.true;
            expect(res).to.have.status(400);
            expect(res.body).to.deep.equal({ error: 'article_already_read', data: null });
        });

        it('should return an error message when article is not read', async () => {

            const args = {
                userId: '123',
                articleId: '456',
            };

            const markNewsArticleAsReadStub = sinon.stub(NewsController, 'markNewsArticleAsRead').resolves({
                error: null,
                data: {
                    article: {
                        id: '456',
                    },
                },
            });

            const res = await chai.request(app).post('/news/read').send(args);
           //@ts-ignore
            expect(markNewsArticleAsReadStub.calledOnceWithExactly(args)).to.be.true;
            expect(res).to.have.status(200);
            expect(res.body).to.deep.equal({ article: { id: '456' } });
        }
        );
    });
});





