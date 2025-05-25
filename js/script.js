const API_KEY = 'AIzaSyBYrhmLhFrzJkDZ3lkezfoJDPaf8536X_o';

const defaultVideos = [
  { id: 'JJx0Akfy4Ag', platform: 'windows', category: 'general', title: 'Windows Intro', description: '...' },
  { id: 'Ag3NWYr5CD8', platform: 'mac', category: 'general', title: 'Mac Short', description: '...' },
  { id: 'nbAzi-F5v6E', platform: 'linux', category: 'general', title: 'Linux Basics', description: '...' }
];

// Initialize if missing
if (!localStorage.getItem('adminVideos')) {
  localStorage.setItem('adminVideos', JSON.stringify(defaultVideos));
}
if (!localStorage.getItem('videoPlatforms')) {
  localStorage.setItem('videoPlatforms', JSON.stringify(['windows', 'mac', 'linux']));
}
if (!localStorage.getItem('videoCategories')) {
  localStorage.setItem('videoCategories', JSON.stringify(['general']));
}

const videoData = JSON.parse(localStorage.getItem('adminVideos')) || [];
const platforms = JSON.parse(localStorage.getItem('videoPlatforms')) || [];
const categories = JSON.parse(localStorage.getItem('videoCategories')) || [];

const videoContainer = document.getElementById('videoGrid');
const platformFilter = document.getElementById('platformFilter');
const categoryFilter = document.getElementById('categoryFilter');
const searchInput = document.getElementById('searchInput');

const paginationContainer = document.createElement('div');
paginationContainer.className = 'pagination my-4 d-flex justify-content-center';
videoContainer.parentElement.appendChild(paginationContainer);

let filteredVideos = [];
let currentPage = 1;
const videosPerPage = 8;

async function fetchVideosByIds(ids) {
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${ids.join(',')}&key=${API_KEY}`
  );
  const data = await response.json();
  return data.items;
}

function updateDropdowns() {
  if (platformFilter) {
    platformFilter.innerHTML = '<option value="">All Platforms</option>';
    platforms.forEach(p => {
      const opt = document.createElement('option');
      opt.value = p;
      opt.textContent = p.charAt(0).toUpperCase() + p.slice(1);
      platformFilter.appendChild(opt);
    });
  }

  if (categoryFilter) {
    categoryFilter.innerHTML = '<option value="">All Categories</option>';
    categories.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c;
      opt.textContent = c.charAt(0).toUpperCase() + c.slice(1);
      categoryFilter.appendChild(opt);
    });
  }
}

function paginateVideos(videos) {
  const start = (currentPage - 1) * videosPerPage;
  const end = start + videosPerPage;
  return videos.slice(start, end);
}

function renderPagination(totalPages) {
  paginationContainer.innerHTML = '';

  if (totalPages <= 1) return;

  const prevBtn = document.createElement('button');
  prevBtn.textContent = 'Previous';
  prevBtn.className = 'btn btn-secondary me-2';
  prevBtn.disabled = currentPage === 1;
  prevBtn.onclick = () => {
    currentPage--;
    renderVideos(filteredVideos);
  };
  paginationContainer.appendChild(prevBtn);

  const nextBtn = document.createElement('button');
  nextBtn.textContent = 'Next';
  nextBtn.className = 'btn btn-secondary';
  nextBtn.disabled = currentPage >= totalPages;
  nextBtn.onclick = () => {
    currentPage++;
    renderVideos(filteredVideos);
  };
  paginationContainer.appendChild(nextBtn);
}
function renderVideos(videos) {
  videoContainer.innerHTML = '';
  const paginated = paginateVideos(videos);

  paginated.forEach(video => {
    const match = videoData.find(v => v.id === video.id);
    const platformTag = match?.platform || 'unspecified';
    const categoryTag = match?.category || 'uncategorized';

    const col = document.createElement('div');
    col.className = 'video-card';

    col.innerHTML = `
      <iframe width="100%" height="200" src="https://www.youtube.com/embed/${video.id}" allowfullscreen></iframe>
      <div class="p-3">
        <div class="video-title">${video.snippet.title}</div>
        <div class="video-desc">${video.snippet.description.slice(0, 100)}...</div>
        <span class="badge bg-secondary mt-2 text-uppercase">${platformTag}</span>
        <span class="badge bg-dark mt-2 text-uppercase">${categoryTag}</span>
      </div>
    `;
    videoContainer.appendChild(col);
  });

  const totalPages = Math.ceil(videos.length / videosPerPage);
  renderPagination(totalPages);
}

async function loadVideos() {
  const ids = videoData.map(v => v.id);
  const videos = await fetchVideosByIds(ids);

  const platform = platformFilter?.value;
  const category = categoryFilter?.value;
  const query = searchInput?.value.toLowerCase() || '';

  filteredVideos = videos.filter(video => {
    const match = videoData.find(v => v.id === video.id);
    const matchesPlatform = !platform || match?.platform === platform;
    const matchesCategory = !category || match?.category === category;
    const matchesSearch =
      video.snippet.title.toLowerCase().includes(query) ||
      video.snippet.description.toLowerCase().includes(query);
    return matchesPlatform && matchesCategory && matchesSearch;
  });

  renderVideos(filteredVideos);
}

// Dropdown and search event listeners
if (platformFilter) platformFilter.addEventListener('change', () => {
  currentPage = 1;
  loadVideos();
});
if (categoryFilter) categoryFilter.addEventListener('change', () => {
  currentPage = 1;
  loadVideos();
});
if (searchInput) searchInput.addEventListener('input', () => {
  currentPage = 1;
  loadVideos();
});

// Initial setup
updateDropdowns();
loadVideos();
