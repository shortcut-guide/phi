import { Router } from "express";
import { logClick, logSearchInput, logSearchResultClick } from "@/b/controllers/logging";

const router = Router();
function asyncHandler(fn: any) {
  return (req: any, res: any, next: any) => Promise.resolve(fn(req, res, next)).catch(next);
}

router.post("/click", asyncHandler(logClick));
router.post("/search-input", asyncHandler(logSearchInput));
router.post("/search-result-click", asyncHandler(logSearchResultClick));

export const LogRoutes = router;