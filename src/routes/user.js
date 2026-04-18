import express ,{ Router } from "express";
import { login , verify , logout} from "../src/controllers/user.js";
import { isAuthenticated } from "../src/middleware/auth.js";
import { mydetails } from "../src/controllers/user.js";

const router = express.Router();

router.post("/login"  , login);
router.get("/verify" , verify);
router.get("/logout" , logout);
router.get("/me" , isAuthenticated , mydetails)

export default router;
