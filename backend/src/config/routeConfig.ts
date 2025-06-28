import { productRoutes } from "@/b/routes/products";
import { searchRoutes } from "@/b/routes/searchlogs";
import { profileRoutes } from "@/b/routes/profile";
import { pinsRoutes } from "@/b/routes/pins";
import type { Hono } from 'hono';

export type ServiceName = "products" | "searchlogs" | "profile" | "pins";

type ServiceRouteConfig = {
  [K in ServiceName]: () => Hono<any>;
};

const serviceRouteMap: ServiceRouteConfig = {
  products: productRoutes,
  searchlogs: searchRoutes,
  profile: profileRoutes,
  pins: pinsRoutes
};

export function getServiceConfig(service: string) {
  if (service in serviceRouteMap) {
    const key = service as ServiceName;
    return { routes: serviceRouteMap[key]() };
  }
  return null;
}
