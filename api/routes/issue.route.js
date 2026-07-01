import express from "express";
import { 
    createIssue, 
    getAllIssues,
    updateIssue,
    deleteIssue,
} from "../controllers/issue.controller.js";

const router = express.Router();

router.post("/create", createIssue);
router.get('/search', getAllIssues);
router.put('/:id', updateIssue);
router.delete('/:id', deleteIssue);

export default router;