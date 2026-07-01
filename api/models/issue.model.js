import mongoose from "mongoose";

const issueSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },

        category: {
            type: String,
            required: true,
        },

        description: {
            type: String,
        },

        priority: {
            type: String,
            enum: ["Low", "Medium", "High"],
            required: true,
        },

        machineName: {
            type: String,
        },

        reportedBy: {
            type: String,
        },

        status: {
            type: String,
            enum: ["Open", "In Progress", "Resolved"],
            default: "Open",
        },

        document: {
            url: String,
            public_id: String,
        }
    },
    { timestamps: true }
);

export default mongoose.model("Issue", issueSchema);