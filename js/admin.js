const videoList = document.getElementById('videoList');
const addVideoForm = document.getElementById('addVideoForm');
const videoUrl = document.getElementById('videoUrl');
const videoTitle = document.getElementById('videoTitle');
const videoDesc = document.getElementById('videoDesc');
const platformSelect = document.getElementById('platformSelect');
const newPlatform = document.getElementById('newPlatform');
const categorySelect = document.getElementById('categorySelect');
const newCategory = document.getElementById('newCategory');
const categoryList = document.getElementById('categoryList');
const platformList = document.getElementById('platformList');

let adminVideos = JSON.parse(localStorage.getItem('adminVideos')) || [];
let platforms = JSON.parse(localStorage.getItem('videoPlatforms')) || ['windows', 'mac', 'linux'];
let categories = JSON.parse(localStorage.getItem('videoCategories')) || ['general'];

function getYouTubeVideoId(url) {
  const regex = /(?:youtube\.com.*[?&]v=|youtu\.be\/)([^&#]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

function updateDropdowns() {
  platformSelect.innerHTML = '<option value="">Select Platform</option>';
  platforms.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p;
    opt.textContent = p.charAt(0).toUpperCase() + p.slice(1);
    platformSelect.appendChild(opt);
  });

  categorySelect.innerHTML = '<option value="">Select Existing Category</option>';
  categories.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c;
    opt.textContent = c.charAt(0).toUpperCase() + c.slice(1);
    categorySelect.appendChild(opt);
  });
}

function updateLists() {
  categoryList.innerHTML = '';
  categories.forEach((cat, index) => {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';
    li.innerHTML = `
      ${cat}
      <button class="btn btn-sm btn-danger" onclick="removeCategory(${index})">Remove</button>`;
    categoryList.appendChild(li);
  });

  platformList.innerHTML = '';
  platforms.forEach((plat, index) => {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';
    li.innerHTML = `
      ${plat}
      <button class="btn btn-sm btn-danger" onclick="removePlatform(${index})">Remove</button>`;
    platformList.appendChild(li);
  });
}

function removeCategory(index) {
  categories.splice(index, 1);
  localStorage.setItem('videoCategories', JSON.stringify(categories));
  updateDropdowns();
  updateLists();
}

function removePlatform(index) {
  platforms.splice(index, 1);
  localStorage.setItem('videoPlatforms', JSON.stringify(platforms));
  updateDropdowns();
  updateLists();
}

function updateVideoList() {
  videoList.innerHTML = '';
  adminVideos.forEach((vid, i) => {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';
    li.innerHTML = `
      <span><strong>${vid.title}</strong> — ${vid.platform} / ${vid.category}</span>
      <button class="btn btn-sm btn-danger" onclick="removeVideo(${i})">Remove</button>`;
    videoList.appendChild(li);
  });
  localStorage.setItem('adminVideos', JSON.stringify(adminVideos));
}

function removeVideo(index) {
  adminVideos.splice(index, 1);
  updateVideoList();
}

addVideoForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const id = getYouTubeVideoId(videoUrl.value.trim());
  let platform = platformSelect.value.trim();
  const newPlat = newPlatform.value.trim();
  const newCat = newCategory.value.trim();
  let category = categorySelect.value.trim();

  if (newPlat) {
    platform = newPlat.toLowerCase();
    if (!platforms.includes(platform)) {
      platforms.push(platform);
      localStorage.setItem('videoPlatforms', JSON.stringify(platforms));
    }
  }

  if (newCat) {
    category = newCat.toLowerCase();
    if (!categories.includes(category)) {
      categories.push(category);
      localStorage.setItem('videoCategories', JSON.stringify(categories));
    }
  }

  if (!id || !platform || !category || !videoTitle.value.trim() || !videoDesc.value.trim()) {
    alert('Please fill in all fields.');
    return;
  }

  if (adminVideos.some(video => video.id === id)) {
    alert('Video already exists.');
    return;
  }

  adminVideos.push({
    id,
    platform,
    category,
    title: videoTitle.value.trim(),
    description: videoDesc.value.trim()
  });
  updateVideoList();
  updateDropdowns();
  updateLists();

  videoUrl.value = '';
  videoTitle.value = '';
  videoDesc.value = '';
  platformSelect.value = '';
  newPlatform.value = '';
  categorySelect.value = '';
  newCategory.value = '';
});

videoUrl.addEventListener('change', async () => {
  const id = getYouTubeVideoId(videoUrl.value.trim());
  if (id) {
    const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${id}&key=AIzaSyBYrhmLhFrzJkDZ3lkezfoJDPaf8536X_o`);
    const data = await response.json();
    const snippet = data.items?.[0]?.snippet;
    if (snippet) {
      videoTitle.value = snippet.title;
      videoDesc.value = snippet.description;
    }
  }
});

function logout() {
  localStorage.removeItem('loggedInUser');
  localStorage.removeItem('userRole');
  window.location.href = '../index.html';
}

// Initialize
updateDropdowns();
updateLists();
updateVideoList();
