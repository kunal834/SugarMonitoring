import express ,{ Router } from "express";
import { isAuthenticated } from "../middleware/auth.js";
import { fetchsugardata, filldata, SugarAnalysis , MonthAnal , contribution } from "../controllers/sugardata.js";
const router = express.Router();
 
router.post("/fill" , isAuthenticated , filldata );
router.get("/fetchdata", isAuthenticated ,  fetchsugardata)
router.get("/Analysis" , isAuthenticated  , SugarAnalysis)
router.get("/Monthly" , isAuthenticated , MonthAnal );
router.get("/contri" , isAuthenticated , contribution )
export default router;
