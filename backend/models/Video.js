const mongoose = require("mongoose");

const VideoSchema = new mongoose.Schema({
  title: String,
  youtubeId: String,
  description: String,
  subject: String,
  thumbnail: String,
});

module.exports = mongoose.model("Video", VideoSchema);
