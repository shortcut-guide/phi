import { Hono } from 'hono';
import { handleGetSites, handleGetSiteById, handleCreateSite, handleUpdateSite, handleDeleteSite } from '@/b/api/sites';

export const siteRoutes = new Hono();

siteRoutes.get('/', handleGetSites); // GET /sites
siteRoutes.get('/:id', handleGetSiteById); // GET /sites/:id
siteRoutes.post('/', handleCreateSite); // POST /sites
siteRoutes.put('/:id', handleUpdateSite); // PUT /sites/:id
siteRoutes.delete('/:id', handleDeleteSite); // DELETE /sites/:id