const express = require("express");
const axios = require("axios");

const Verification = require("../models/verification");

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const { type, content } = req.body;

        // Validate request
        if (!type) {
            return res.status(400).json({
                success: false,
                message: "Verification type is required"
            });
        }

        if (!content || !content.trim()) {
            return res.status(400).json({
                success: false,
                message: "Content is required"
            });
        }

        console.log("Verification request received:");
        console.log({
            type,
            content
        });

        /*
         * Send request to n8n
         */

        if (!process.env.N8N_WEBHOOK_URL) {
            return res.status(500).json({
                success: false,
                message: "N8N_WEBHOOK_URL is not configured"
            });
        }

        const n8nResponse = await axios.post(
            process.env.N8N_WEBHOOK_URL,
            {
                type,
                content,
                source: "veritas"
            },
            {
                timeout: 120000
            }
        );

        const result = n8nResponse.data;

        console.log("n8n response:");
        console.log(result);

        /*
         * Save result to MongoDB
         */

        let savedVerification = null;

        try {
            savedVerification = await Verification.create({
                type,
                content,
                verdict: result.verdict || "UNVERIFIED",
                confidence: result.confidence || 0,
                explanation: result.explanation || "",
                claims: result.claims || [],
                evidence: result.evidence || []
            });
        } catch (dbError) {
            console.error(
                "Could not save to MongoDB:",
                dbError.message
            );
        }

        /*
         * Send result to frontend
         */

                return res.status(200).json({
            success: true,
            id: savedVerification?._id || null,
            ...result,
        });

    } catch (error) {

        console.error("Verification error:");

        if (error.response) {
            console.error(
                "n8n returned:",
                error.response.status,
                error.response.data
            );
        } else {
            console.error(error.message);
        }

        return res.status(500).json({
            success: false,
            message: "Verification failed",
            error: error.message
        });
    }
});

module.exports = router;