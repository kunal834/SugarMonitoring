import express ,{ Router } from "express";
import { isAuthenticated } from "../middleware/auth.js";
import { filldata } from "../controllers/sugardata.js";
const router = express.Router();
 
router.post("/fill" , isAuthenticated , filldata )
export default router;
