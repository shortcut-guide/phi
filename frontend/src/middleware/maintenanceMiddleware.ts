// Astro の Middleware を使用して、特定ページのみメンテナンスモードにする。
import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware((context, next) => {
  const maintenancePages = import.meta.env.PUBLIC_MAINTENANCE_PAGES?.split(',') || [];
  
  if (maintenancePages.includes(new URL(context.request.url).pathname)) {
    return new Response(null, { status: 302, headers: { Location: '/maintenance' } });
  }

  return next();
});