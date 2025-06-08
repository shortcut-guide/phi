import { Router } from 'express';
import { Search, ClickLog, Analytics, Suggest } from '@/b/controllers/searchController';
const router = Router();
router.get('/search', Search);
router.post('/search/click', ClickLog);
router.get('/search/analytics', Analytics);
router.get('/search/suggest', Suggest);
export default router;
