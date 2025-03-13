import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles.css";

const VideoGrid = ({ onSelectVideo }) => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/videos").then((response) => {
      setVideos(response.data);
    });
  }, []);

  return (
    <div className="video-grid">
      {videos.map((video) => (
        <div key={video._id} className="video-card" onClick={() => onSelectVideo(video)}>
          <img src={video.thumbnail} alt={video.title} />
          <p>{video.title}</p>
        </div>
      ))}
    </div>
  );
};

export default VideoGrid;
