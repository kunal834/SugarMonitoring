import express ,{ Router } from "express";
import { login , verify , logout} from "../controllers/user.js";
import { isAuthenticated } from "../middleware/auth.js";
import { mydetails } from "../controllers/user.js";

const router = express.Router();

router.post("/login"  , login);
router.get("/verify" , verify);
router.get("/logout" , logout);
router.get("/me" , isAuthenticated , mydetails)

export default router;
