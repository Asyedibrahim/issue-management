import express from "express";
import { 
    createIssue, 
    getAllIssues,
    updateIssue,
    deleteIssue,
    updateIssueStatus,
    getIssueById,
} from "../controllers/issue.controller.js";

const router = express.Router();

router.post("/create", createIssue);
router.get('/search', getAllIssues);
router.put('/:id', updateIssue);
router.patch('/issue-status/:id', updateIssueStatus);
router.get('/get/:id', getIssueById);
router.delete('/:id', deleteIssue);

export default router;