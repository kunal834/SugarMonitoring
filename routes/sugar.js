import express ,{ Router } from "express";
import { isAuthenticated } from "../middleware/auth.js";
import { fetchsugardata, filldata } from "../controllers/sugardata.js";
const router = express.Router();
 
router.post("/fill" , isAuthenticated , filldata );
router.get("/fetchdata", isAuthenticated ,  fetchsugardata)
export default router;
