import express from "express";
import {
  addData,
  getData,
  getAllData,
  changeData,
  deleteData,
  filterData,
} from "../controllers/DataController.js";

import { authenticate, restrict } from "../auth/verifyToken.js";

const router = express.Router();
router.post("/", authenticate, restrict(["admin"]), addData);
router.get("/:id", authenticate, getData);
router.get("/", authenticate, getAllData);
router.put("/:id", authenticate, restrict(["admin"]), changeData);
router.delete("/:id", authenticate, restrict(["admin"]), deleteData);

router.get("/filter", authenticate, filterData);

export default router;
