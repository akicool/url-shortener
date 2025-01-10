const express = require("express");
const crypto = require("crypto");
const Url = require("../models/urlModel");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "URL Shortener API" });
});

// POST /shorten
router.post("/shorten", async (req, res) => {
  const { originalUrl } = req.body;
  if (!originalUrl) {
    return res.status(400).json({ error: "Original URL is required" });
  }

  try {
    let url = await Url.findOne({ originalUrl });
    if (url) {
      return res.json(url.shortUrl);
    }

    const shortUrl = crypto.randomUUID().slice(0, 6);
    url = new Url({
      originalUrl,
      shortUrl,
    });

    await url.save();
    res.json(shortUrl);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /{shortUrl}
router.get("/:shortUrl", async (req, res) => {
  try {
    const url = await Url.findOne({ shortUrl: req.params.shortUrl });
    if (!url) {
      return res.status(404).json({ error: "URL not found" });
    }

    url.clickCount++;
    await url.save();

    res.redirect(url.originalUrl);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /info/{shortUrl}
router.get("/info/:shortUrl", async (req, res) => {
  try {
    const url = await Url.findOne({ shortUrl: req.params.shortUrl });
    if (!url) {
      return res.status(404).json({ error: "URL not found" });
    }

    res.json({
      originalUrl: url.originalUrl,
      createdAt: url.createdAt,
      clickCount: url.clickCount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE /delete/{shortUrl}
router.delete("/delete/:shortUrl", async (req, res) => {
  try {
    const url = await Url.findOneAndDelete({ shortUrl: req.params.shortUrl });
    if (!url) {
      return res.status(404).json({ error: "URL not found" });
    }

    res.json({ message: "URL deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
