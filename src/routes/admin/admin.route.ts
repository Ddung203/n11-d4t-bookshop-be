import express from "express";
import asyncHandle from "../../helpers/asyncHandle.ts";
import AdminController from "../../controllers/admin/admin.controller.ts";
import { accessMiddleware } from "../../middlewares/access.middleware.ts";
import { authorizationMiddleware } from "../../middlewares/authorization.middleware.ts";

const router = express.Router();

router.get(
  "/admin/users",
  asyncHandle(accessMiddleware),
  authorizationMiddleware(["A"]),
  asyncHandle(AdminController.getListUser)
);

router.post(
  "/admin/user/remove",
  asyncHandle(accessMiddleware),
  authorizationMiddleware(["A"]),
  asyncHandle(AdminController.deleteUserByUsername)
);

router.post(
  "/admin/user/search",
  asyncHandle(accessMiddleware),
  authorizationMiddleware(["A"]),
  asyncHandle(AdminController.searchUser)
);

router.get(
  "/admin/comment/list",
  asyncHandle(accessMiddleware),
  authorizationMiddleware(["A"]),
  asyncHandle(AdminController.getListComments)
);

router.post(
  "/admin/comment/remove",
  asyncHandle(accessMiddleware),
  authorizationMiddleware(["A"]),
  asyncHandle(AdminController.deleteCommentByID)
);

router.post(
  "/admin/comment/search",
  asyncHandle(accessMiddleware),
  authorizationMiddleware(["A"]),
  asyncHandle(AdminController.searchComments)
);

router.get(
  "/admin/book/list",
  asyncHandle(accessMiddleware),
  authorizationMiddleware(["A"]),
  asyncHandle(AdminController.getAllBook)
);

router.post(
  "/admin/book/update",
  asyncHandle(accessMiddleware),
  authorizationMiddleware(["A"]),
  asyncHandle(AdminController.updateBook)
);

export default router;
