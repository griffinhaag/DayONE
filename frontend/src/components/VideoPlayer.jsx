import React from "react";

const VideoPlayer = ({ video, onClose }) => {
  if (!video) return null;

  return (
    <div className="video-player">
      <button className="close-btn" onClick={onClose}>X</button>
      <iframe
        src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1`}
        title={video.title}
        allowFullScreen
      ></iframe>
      <p>{video.description}</p>
    </div>
  );
};

export default VideoPlayer;
