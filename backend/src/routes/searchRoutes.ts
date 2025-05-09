import { Router } from 'express';
import { handleSearch, handleClickLog, handleAnalytics, handleSuggest } from '@/b/controllers/searchController';

const router = Router();

router.get('/search', handleSearch);
router.post('/search/click', handleClickLog);
router.get('/search/analytics', handleAnalytics);
router.get('/search/suggest', handleSuggest);

export default router;