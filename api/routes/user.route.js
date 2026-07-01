import express from 'express';
import { login, signout, register, getAllUsers, deleteUser, getRecentUsers } from '../controllers/user.controller.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/search', getAllUsers);
router.delete('/delete/:id', deleteUser);
router.get("/recent-users", getRecentUsers);
router.post('/signout', signout);

export default router;