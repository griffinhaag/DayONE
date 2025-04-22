const videoList = document.getElementById('videoList');
const addVideoForm = document.getElementById('addVideoForm');
const videoUrl = document.getElementById('videoUrl');
const videoTitle = document.getElementById('videoTitle');
const videoDesc = document.getElementById('videoDesc');
const categorySelect = document.getElementById('categorySelect');
const newCategoryInput = document.getElementById('newCategory');

let adminVideos = JSON.parse(localStorage.getItem('adminVideos')) || [];

function getYouTubeVideoId(url) {
  const regex = /(?:youtube\.com.*[?&]v=|youtu\.be\/)([^&#]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

function updateVideoList() {
  videoList.innerHTML = '';
  adminVideos.forEach((vid, i) => {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';
    li.innerHTML = `
      <span><strong>${vid.id}</strong> — ${vid.platform}</span>
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
  let platform = categorySelect.value.trim();
  const newPlatform = newCategoryInput.value.trim();

  if (newPlatform) {
    platform = newPlatform.toLowerCase();
    // Optionally add new category to dropdown dynamically
    const newOption = document.createElement('option');
    newOption.value = platform;
    newOption.textContent = platform.charAt(0).toUpperCase() + platform.slice(1);
    categorySelect.appendChild(newOption);
  }

  const title = videoTitle.value.trim();
  const desc = videoDesc.value.trim();

  if (!id || !platform || !title || !desc) {
    alert('Please fill in all fields.');
    return;
  }

  if (adminVideos.some(video => video.id === id)) {
    alert('Video already exists.');
    return;
  }

  adminVideos.push({ id, platform, title, description: desc });
  updateVideoList();

  videoUrl.value = '';
  videoTitle.value = '';
  videoDesc.value = '';
  categorySelect.value = '';
  newCategoryInput.value = '';
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

// Initial render
updateVideoList();
