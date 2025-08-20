import { Router } from 'express';
import {
  loginUser,
  registerUser,
  refreshToken,
} from '../controller/auth-controller';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/refresh', refreshToken);

// router.get("/me", authenticateToken, (req, res) => {
//   res.json({ message: "Hello, this is a protected route", user: req.user });
// });

export default router;
