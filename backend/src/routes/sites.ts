import { Hono } from 'hono';
import { handleGetSites, handleGetSiteById, handleCreateSite, handleUpdateSite, handleDeleteSite } from '@/b/api/sites';

export const siteRoutes = new Hono();

siteRoutes.get('/sites', handleGetSites); // GET /sites
siteRoutes.get('/sites/:id', handleGetSiteById); // GET /sites/:id
siteRoutes.post('/sites', handleCreateSite); // POST /sites
siteRoutes.put('/sites/:id', handleUpdateSite); // PUT /sites/:id
siteRoutes.delete('/sites/:id', handleDeleteSite); // DELETE /sites/:id