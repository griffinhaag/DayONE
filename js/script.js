const API_KEY = 'AIzaSyBYrhmLhFrzJkDZ3lkezfoJDPaf8536X_o';

const defaultVideos = [
  { id: 'JJx0Akfy4Ag', platform: 'windows' },
  { id: 'Ag3NWYr5CD8', platform: 'mac' },
  { id: 'nbAzi-F5v6E', platform: 'linux' }
];

if (!localStorage.getItem('adminVideos')) {
  localStorage.setItem('adminVideos', JSON.stringify(defaultVideos));
}

const videoData = JSON.parse(localStorage.getItem('adminVideos')) || [];

const videoContainer = document.getElementById('videoContainer');
const platformFilter = document.getElementById('platformFilter');
const searchInput = document.getElementById('searchInput');

async function fetchVideosByIds(ids) {
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${ids.join(',')}&key=${API_KEY}`
  );
  const data = await response.json();
  return data.items;
}

function renderVideos(videos, filter = '', query = '') {
  videoContainer.innerHTML = '';

  videos.forEach(video => {
    const match = videoData.find(v => v.id === video.id);
    const platform = match?.platform || '';
    const title = video.snippet.title.toLowerCase();
    const desc = video.snippet.description.toLowerCase();
    if ((filter === '' || platform === filter) &&
        (title.includes(query) || desc.includes(query))) {
      const col = document.createElement('div');
      col.className = 'col-md-4';
      col.innerHTML = `
        <div class="card h-100 shadow-sm">
          <iframe height="200" src="https://www.youtube.com/embed/${video.id}" allowfullscreen></iframe>
          <div class="card-body">
            <div class="video-title">${video.snippet.title}</div>
            <div class="video-desc">${video.snippet.description.slice(0, 100)}...</div>
            <span class="badge bg-secondary mt-2 text-uppercase">${platform}</span>
          </div>
        </div>`;
      videoContainer.appendChild(col);
    }
  });
}

async function loadVideos() {
  const ids = videoData.map(v => v.id);
  const videos = await fetchVideosByIds(ids);
  const filter = platformFilter.value;
  const query = searchInput.value.toLowerCase();
  renderVideos(videos, filter, query);
}

platformFilter.addEventListener('change', loadVideos);
searchInput.addEventListener('input', loadVideos);
loadVideos();
