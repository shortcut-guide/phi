import { Hono } from 'hono';
import { handleGetPins } from '@/b/api/pins';

const pinsRoutes = new Hono();
pinsRoutes.get('/pins', handleGetPins);
export default pinsRoutes;