import { expect } from 'chai';
import sinon from 'sinon';
import axios from 'axios';
import newsController from '../../../controllers/news';


//test to see if fetchNews works
describe('News Controller', () => {
    describe('Fetch News', () => {
        it('should return error if user does not exist', async () => {
            const res = await newsController.fetchNews({
                userId: '',
            });

            expect(res.error).to.equal('user_does_not_exist');
            expect(res.data).to.equal(null);
        });

        it('should return error if user does not have preferences', async () => {
            const res = await newsController.fetchNews({
                userId: '123',
            });

            expect(res.error).to.equal('user_does_not_have_preferences');
            expect(res.data).to.equal(null);
        }

        );
    });

});

//test to see if markNewsArticleAsRead works

describe('News Controller', () => {
    describe('Mark News Article As Read', () => {
        it('should return error if user does not exist', async () => {
            const res = await newsController.markNewsArticleAsRead({
                userId: '',
                newsArticleId: '',
            });

            expect(res.error).to.equal('user_does_not_exist');
            expect(res.data).to.equal(null);

        });

        it('should return error if news article does not exist', async () => {
            const res = await newsController.markNewsArticleAsRead({
                userId: '123',
                newsArticleId: '',
            });

            expect(res.error).to.equal('news_article_does_not_exist');
            expect(res.data).to.equal(null);

        });

        it('should return error if news article is already read', async () => {
            const res = await newsController.markNewsArticleAsRead({
                userId: '123',
                newsArticleId: '123',
            });

            expect(res.error).to.equal('news_article_already_read');
            expect(res.data).to.equal(null);

        });

    });

});



//close bracket

//test to see if markNewsArticleAsRead works






