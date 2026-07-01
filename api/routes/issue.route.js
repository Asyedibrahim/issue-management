import express from "express";
import { 
    createIssue, 
    getAllIssues,
    updateIssue,
    deleteIssue,
    updateIssueStatus,
    getIssueById,
} from "../controllers/issue.controller.js";
import { upload } from "../utils/multer.js";

const router = express.Router();

router.post("/create", upload.single("document"), createIssue);
router.get('/search', getAllIssues);
router.put('/:id', upload.single("document"), updateIssue);
router.patch('/issue-status/:id', updateIssueStatus);
router.get('/get/:id', getIssueById);
router.delete('/:id', deleteIssue);

export default router;