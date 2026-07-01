import express from 'express';
import { login, signout, register, getAllUsers, deleteUser } from '../controllers/user.controller.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/search', getAllUsers);
router.delete('/delete/:id', deleteUser);
router.post('/signout', signout);

export default router;