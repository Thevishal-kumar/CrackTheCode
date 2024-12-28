import {Router} from 'express';
import { registerUser,loginUser,logoutUser } from '../controllers/user.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';
import { refreshAccessToken } from '../controllers/user.controller.js';

const router = Router();

router.route("/register").post(registerUser); 
router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT,  logoutUser)
router.route("/refresh-token").post(refreshAccessToken)

export default router;  
 
