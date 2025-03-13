const express = require("express");
const Video = require("../models/Video");
const router = express.Router();

router.get("/", async (req, res) => {
  const videos = await Video.find();
  res.json(videos);
});

router.post("/", async (req, res) => {
  const { title, youtubeId, description, subject } = req.body;
  const thumbnail = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;

  const newVideo = new Video({ title, youtubeId, description, subject, thumbnail });
  await newVideo.save();
  res.status(201).json(newVideo);
});

module.exports = router;
