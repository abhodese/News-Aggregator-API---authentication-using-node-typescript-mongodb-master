import newsController from '../../controllers/news';
import express from 'express';
import _ from 'lodash';

const router = express.Router();



//use url to fetch news articles

router.get('/news', async (req, res) => { 
    const result = await newsController.fetchNews({
        userId: _.get(req, 'userId'),
    });
    const { error, data } = result;

    if (error) {
        res.status(400).json(error);
        return;
    }
    res.status(200).send(data);
    }
);




router.get('/preferences', async (req, res) => {
    const result = await newsController.getPreferences({
        userId: _.get(req, 'userId'),
    });
    const { error, data } = result;
    
    if (error) {
        res.status(400).json(error);
        return;
    }
    res.status(200).send(data);
    }
);

router.post('/preferences', async (req, res) => {
    const args = _.get(req, 'body');
    const { preferences } = args;
    if (!preferences) {
        res.status(400).json('Missing params');
        return;
    }
    const result = await newsController.updatePreferences({
        userId: _.get(req, 'userId'),
        preferences,
    });
    const { error, data } = result;
    
    if (error) {
        res.status(400).json(error);
        return;
    }
    res.status(200).send(data);
    }
);

router.get('/', async (req, res) => {
    const result = await newsController.fetchNews({
        userId: _.get(req, 'userId'),
    });
    const { error, data } = result;
    
    if (error) {
        res.status(400).json(error);
        return;
    }
    res.status(200).send(data);
    }
);


router.post('/read', async (req, res) => {
    const args = _.get(req, 'body');
    const { newsArticleId } = args;
    if (!newsArticleId) {
        res.status(400).json('Missing params');
        return;
    }
    const result = await newsController.markNewsArticleAsRead({
        userId: _.get(req, 'userId'),
        newsArticleId,
    });
    const { error, data } = result;
    
    if (error) {
        res.status(400).json(error);
        return;
    }
    res.status(200).send(data);
    }

);


router.post('/favorite', async (req, res) => {
    const args = _.get(req, 'body');
    const { newsArticleId } = args;
    if (!newsArticleId) {
        res.status(400).json('Missing params');
        return;
    }
    const result = await newsController.markNewsArticleAsFavorite({
        userId: _.get(req, 'userId'),
        newsArticleId,
    });
    const { error, data } = result;
    
    if (error) {
        res.status(400).json(error);
        return;
    }
    res.status(200).send(data);
    }

);

router.get('/search', async (req, res) => { 
    const userId = _.get(req, 'userId');
    const keywords = _.get(req, 'query.keywords', []);
  
    const result = await newsController.fetchNewsByKeywords({
      userId,
      keywords: Array.isArray(keywords) ? keywords : [keywords], // Ensure keywords is an array
    });
  
    const { error, data } = result;
  
    if (error) {
      res.status(400).json(error);
      return;
    }
  
    res.status(200).send(data);
  });
  

export default router;



