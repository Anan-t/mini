const express = require("express");
const multer = require("multer");
const axios = require("axios");

const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 15 * 1024 * 1024
    }
});

router.post("/", upload.single("audio"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Audio file is required"
            });
        }

        console.log("Voice message received:");
        console.log({
            filename: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size
        });

        if (!process.env.N8N_WEBHOOK_URL) {
            return res.status(500).json({
                success: false,
                message: "N8N_WEBHOOK_URL is not configured"
            });
        }

        const audioBase64 = req.file.buffer.toString("base64");

        const n8nResponse = await axios.post(
            process.env.N8N_WEBHOOK_URL,
            {
                mode: "voice",
                audio: audioBase64,
                mimeType: req.file.mimetype,
                filename: req.file.originalname,
                source: "veritas"
            },
            {
                timeout: 120000,
                maxContentLength: Infinity,
                maxBodyLength: Infinity
            }
        );

        const result =
            n8nResponse.data?.body ||
            n8nResponse.data;

        return res.json({
            success: true,
            transcript: result.transcript || "",
            response: result.response || "",
            verdict: result.verdict || null,
            confidence: result.confidence || null,
            explanation: result.explanation || "",
            evidence: result.evidence || []
        });

    } catch (error) {
        console.error("Voice processing error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Voice processing failed",
            error: error.message
        });
    }
});

module.exports = router;