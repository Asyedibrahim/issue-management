import Issue from "../models/issue.model.js";
import User from "../models/user.model.js";

export const getDashboard = async (req, res) => {
    try {
        const [totalIssues, openIssues, progressIssues, resolvedIssues, recentIssues, recentUsers] = await Promise.all([
            Issue.countDocuments(),
            Issue.countDocuments({ status: 'Open' }),
            Issue.countDocuments({ status: 'In Progress' }),
            Issue.countDocuments({ status: 'Resolved' }),
            Issue.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .select('title machineName status category createdAt'),
            User.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .select('email role createdAt')
        ]);

        res.status(200).json({
            totalIssues,
            openIssues,
            progressIssues,
            resolvedIssues,
            recentIssues,
            recentUsers
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};