import express from 'express';

import UserRoutes from './user';
import NewsRoutes from './news';

const router = express.Router();

router.use('/user', UserRoutes);
router.use('/news', NewsRoutes);

export default router;
