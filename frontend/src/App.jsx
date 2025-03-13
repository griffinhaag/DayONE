import React, { useState } from "react";
import VideoGrid from "./components/VideoGrid.jsx";
import VideoPlayer from "./components/VideoPlayer.jsx";
import FilterBar from "./components/FilterBar.jsx";

const App = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);

  return (
    <div className="app">
      <h1>Dunwoody Media</h1>
      <FilterBar onFilter={() => {}} />
      <VideoGrid onSelectVideo={setSelectedVideo} />
      <VideoPlayer video={selectedVideo} onClose={() => setSelectedVideo(null)} />
    </div>
  );
};

export default App;
