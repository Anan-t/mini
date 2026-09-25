const mongoose = require("mongoose");

const evidenceSchema = new mongoose.Schema(
    {
        title: String,
        source: String,
        url: String,
        supportsClaim: Boolean
    },
    { _id: false }
);

const verificationSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            enum: ["text", "image", "screenshot", "audio", "video"],
            required: true
        },

        content: {
            type: String,
            required: true
        },

        verdict: {
            type: String,
            enum: [
                "True",
                "False",
                "Partially True",
                "Misleading",
                "Unverified"
            ],
            default: "Unverified"
        },
        confidence: {
            type: String,
            enum: ["high", "medium", "low"],
            default: "low"
        },

        explanation: {
            type: String,
            default: ""
        },

        claims: {
            type: [String],
            default: []
        },

        evidence: {
            type: [evidenceSchema],
            default: []
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Verification",
    verificationSchema
);