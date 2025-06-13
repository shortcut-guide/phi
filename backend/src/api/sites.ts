import { handleGetFilteredSites, handleGetSiteByIdFromController, handleCreateSiteInController, handleUpdateSiteInController, handleDeleteSiteInController } from "@/b/controllers/sitesController";
import type { Context } from "hono";

export async function handleGetSites(c: Context): Promise<Response> {
  return await handleGetFilteredSites(c);
}

export async function handleGetSiteById(c: Context): Promise<Response> {
  return await handleGetSiteByIdFromController(c);
}

export async function handleCreateSite(c: Context): Promise<Response> {
  return await handleCreateSiteInController(c);
}

export async function handleUpdateSite(c: Context): Promise<Response> {
  return await handleUpdateSiteInController(c);
}

export async function handleDeleteSite(c: Context): Promise<Response> {
  return await handleDeleteSiteInController(c);
}