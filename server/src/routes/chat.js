const express = require("express");
const axios = require("axios");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const {
      message,
      conversation,
      image,
      imageDataUrl,
      mode = "chat",
      source = "veritas",
    } = req.body;

    if (!message?.trim() && !image && !imageDataUrl) {
      return res.status(400).json({
        success: false,
        message: "Message or image is required",
      });
    }

    if (!process.env.N8N_WEBHOOK_URL) {
      return res.status(500).json({
        success: false,
        message: "N8N_WEBHOOK_URL is not configured",
      });
    }

    console.log("=================================");
    console.log("CHAT REQUEST");
    console.log("Message:", message || "");
    console.log("Has image:", !!(image || imageDataUrl));

    let responseText = "";
    let sources = [];

    try {
      const payload = {
        mode,
        message: message || "",
        conversation: conversation || [],
        source,
      };

      // Send actual image to n8n if present
      if (imageDataUrl || image) {
        payload.imageDataUrl = imageDataUrl || image;
        payload.image = imageDataUrl || image;
      }

      const n8nResponse = await axios.post(
        process.env.N8N_WEBHOOK_URL,
        payload,
        {
          timeout: 120000,
        }
      );

      console.log("RAW N8N RESPONSE:");
      console.log(JSON.stringify(n8nResponse.data, null, 2));

      let result = n8nResponse.data;

      // Handle n8n body wrapper
      if (result?.body) {
        result = result.body;
      }

      // Handle stringified JSON
      if (typeof result === "string") {
        try {
          result = JSON.parse(result);
        } catch {
          result = {
            response: result,
          };
        }
      }

      console.log("PARSED CHAT RESULT:");
      console.log(JSON.stringify(result, null, 2));

      /*
       * n8n can return:
       * reply
       * response
       * message
       * output
       * text
       * answer
       *
       * IMPORTANT:
       * "reply" is what your current Intent & Claim Agent returns.
       */
      responseText =
        result?.reply ||
        result?.response ||
        result?.message ||
        result?.output ||
        result?.text ||
        result?.answer ||
        "";

      sources = Array.isArray(result?.sources)
        ? result.sources
        : [];

      console.log("EXTRACTED RESPONSE:", responseText);
    } catch (n8nError) {
      console.error("=================================");
      console.error("CHAT N8N ERROR:");

      if (n8nError.response) {
        console.error(
          "Status:",
          n8nError.response.status
        );

        console.error(
          "n8n response:",
          JSON.stringify(
            n8nError.response.data,
            null,
            2
          )
        );
      } else {
        console.error(n8nError.message);
      }

      const n8nDetail =
        n8nError.response?.data?.message ||
        n8nError.message;

      responseText =
        `I received your message: "${message || ""}". ` +
        `The connected n8n workflow returned: "${n8nDetail}".`;
    }

    if (!responseText) {
      responseText =
        "I received your message, but no response text was generated.";
    }

    console.log("FINAL RESPONSE:", responseText);

    return res.json({
      success: true,
      response: responseText,
      sources,
    });
  } catch (error) {
    console.error("=================================");
    console.error("CHAT SERVER ERROR");
    console.error(error.message);

    return res.status(500).json({
      success: false,
      message: "Chat request failed",
      error: error.message,
    });
  }
});

module.exports = router;