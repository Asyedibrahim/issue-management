import Issue from "../models/issue.model.js";

export const createIssue = async (req, res) => {
    try {
        const issue = await Issue.create(req.body);

        res.status(201).json({
            success: true,
            message: "Issue Created Successfully",
            issue,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getAllIssues = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 30;
        const skip = (page - 1) * limit;

        const searchQuery = req.query.search || '';
        const categoryQuery = req.query.category || '';
        const statusQuery = req.query.status || '';

        const query = {};

        if (searchQuery) {
            query.$or = [
                { title: { $regex: searchQuery, $options: 'i' } },
                { machineName: { $regex: searchQuery, $options: 'i' } },
            ];
        }

        if (categoryQuery) {
            query.category = categoryQuery;
        }

        if (statusQuery) {
            query.status = statusQuery;
        }

        const [issues, total] = await Promise.all([
            Issue.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Issue.countDocuments(query)
        ]);

        const totalPages = Math.ceil(total / limit);

        res.json({
            issues,
            currentPage: page,
            totalPages,
            totalIssues: total
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

export const updateIssue = async (req, res) => {
    try {
        const { id } = req.params;

        const existingIssue = await Issue.findById(id);
        if (!existingIssue) {
            return res.status(404).json({ error: 'Issue not found' });
        }

        const updatedIssue = await Issue.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedIssue) {
            return res.status(404).json({ error: 'Issue not found' });
        }

        res.json(updatedIssue);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

export const deleteIssue = async (req, res) => {
    try {
        const issue = await Issue.findByIdAndDelete(req.params.id);
        if (!issue) {
            return res.status(404).json({ success: false, message: "Issue not found" });
        }
        res.json({ success: true, message: "Issue deleted successfully" });
    } catch (err) {
        console.error("Delete error:", err);
        res.status(500).json({ success: false, message: 'Failed to delete issue' });
    }
};