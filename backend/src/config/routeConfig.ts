import { productRoutes } from "@/b/routes/products";
import { searchRoutes } from "@/b/routes/searchlogs";
import { profileRoutes } from "@/b/routes/profile";
import type { Hono } from 'hono';

export type ServiceName = "products" | "searchlogs" | "profile";

type ServiceRouteConfig = {
  [K in ServiceName]: () => Hono<any>;
};

const serviceRouteMap: ServiceRouteConfig = {
  products: productRoutes,
  searchlogs: searchRoutes,
  profile: profileRoutes,
};

export function getServiceConfig(service: string) {
  if (service in serviceRouteMap) {
    const key = service as ServiceName;
    return { routes: serviceRouteMap[key]() };
  }
  return null;
}
