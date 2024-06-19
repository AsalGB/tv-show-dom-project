const apiBaseURL = 'https://api.tvmaze.com';
const searchInput = document.getElementById('searchInput');
const episodeSelector = document.getElementById('episodeSelector');
const episodesContainer = document.getElementById('episodesContainer');
const showsContainer = document.getElementById('showsContainer');
const episodeCount = document.getElementById('episodeCount');

let episodes = [];
let allShows = [];

// Fetching tv shows
function fetchShows() {
  fetch(`${apiBaseURL}/shows`)
    .then(response => response.json())
    .then(data => {
      allShows = data.slice(0, 56); 
      displayShows(allShows);
    })
    .catch(error => console.error('Error fetching shows:', error));
}

// Display TV shows
function displayShows(shows) {
  showsContainer.innerHTML = '';
  shows.forEach(show => {
    const showElement = document.createElement('div');
    showElement.className = 'show';
    showElement.innerHTML = `
      <img src="${show.image ? show.image.medium : ''}" alt="${show.name}">
      <div class="details">
        <h3>${show.name}</h3>
      </div>
    `;
    showElement.addEventListener('click', () => {
      fetchEpisodes(show.id);
    });
    showsContainer.appendChild(showElement);
  });
}


// Fetching episodes
function fetchEpisodes(showId) {
  fetch(`${apiBaseURL}/shows/${showId}/episodes`)
    .then(response => response.json())
    .then(data => {
      episodes = data;
      displayEpisodes(episodes);
      populateEpisodeSelector(episodes);
      episodeCount.textContent = `Displaying ${episodes.length} episode(s)`;
      showsContainer.style.display = 'none'; 
    })
    .catch(error => console.error('Error fetching episodes:', error));
}


// Displaying episodes
function displayEpisodes(episodes) {
  episodesContainer.innerHTML = '';
  episodes.forEach(episode => {
    const episodeElement = document.createElement('div');
    episodeElement.className = 'episode';
    episodeElement.innerHTML = `
      <img src="${episode.image ? episode.image.medium : ''}" alt="${episode.name}">
      <div class="details">
        <h3>${episode.name}</h3>
        <p>${generateEpisodeCode(episode.season, episode.number)}</p>
        <p>${episode.summary}</p>
      </div>
    `;
    episodesContainer.appendChild(episodeElement);
  });
}

// Generate episode code
function generateEpisodeCode(season, number) {
  const seasonCode = season < 10 ? `S0${season}` : `S${season}`;
  const episodeCode = number < 10 ? `E0${number}` : `E${number}`;
  return `${seasonCode}${episodeCode}`;
}

// Populate episode selector
function populateEpisodeSelector(episodes) {
  episodeSelector.innerHTML = '<option value="">Select an episode</option>';
  episodes.forEach(episode => {
    const option = document.createElement('option');
    option.value = episode.id;
    option.text = `${generateEpisodeCode(episode.season, episode.number)} - ${episode.name}`;
    episodeSelector.appendChild(option);
  });
}



// Live search functionality for both shows and episodes
searchInput.addEventListener('input', (e) => {
  const searchTerm = e.target.value.toLowerCase();
  
  const filteredShows = allShows.filter(show =>
    show.name.toLowerCase().includes(searchTerm)
  );
  displayShows(filteredShows);
  
  const filteredEpisodes = episodes.filter(episode => 
    episode.name.toLowerCase().includes(searchTerm) ||
    episode.summary.toLowerCase().includes(searchTerm)
  );
  displayEpisodes(filteredEpisodes);
  
  episodeCount.textContent = `Displaying ${filteredEpisodes.length} episode(s)`;
});


// Episode selector functionality
episodeSelector.addEventListener('change', (e) => {
  const selectedEpisodeId = parseInt(e.target.value);
  const selectedEpisode = episodes.find(episode => episode.id === selectedEpisodeId);
  
  if (selectedEpisode) {
    scrollToEpisode(selectedEpisodeId); 
    displayEpisodes([selectedEpisode]); 
  } else {
    displayEpisodes(episodes); 
  }
});

// scroll to the selected episode
function scrollToEpisode(episodeId) {
  const episodeElement = document.querySelector(`.episode[data-id="${episodeId}"]`);
  if (episodeElement) {
    episodeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    episodeElement.classList.add('selected'); 
    setTimeout(() => {
      episodeElement.classList.remove('selected'); 
    }, 3000); 
  }
}


function displayShows(shows) {
  showsContainer.innerHTML = '';
  shows.forEach(show => {
    const showElement = document.createElement('div');
    showElement.className = 'show';
    showElement.innerHTML = `
      <img src="${show.image ? show.image.medium : ''}" alt="${show.name}">
      <div class="details">
        <h3>${show.name}</h3>
      </div>
    `;
    showElement.addEventListener('click', () => {
      fetchEpisodes(show.id);
    });
    showsContainer.appendChild(showElement);
  });
}

// home button to show all shows again
const backToShowBtn = document.getElementById('backToShowBtn');

backToShowBtn.addEventListener('click', () => {
  showsContainer.style.display = 'flex'; // Show shows container
  episodesContainer.style.display = 'none'; 
  backToShowBtn.style.display = 'none'; 
});

function fetchEpisodes(showId) {
  fetch(`${apiBaseURL}/shows/${showId}/episodes`)
    .then(response => response.json())
    .then(data => {
      episodes = data;
      displayEpisodes(episodes);
      populateEpisodeSelector(episodes);
      episodeCount.textContent = `Displaying ${episodes.length} episode(s)`;
      showsContainer.style.display = 'none'; 
      episodesContainer.style.display = 'flex'; 
      backToShowBtn.style.display = 'inline'; 
    })
    .catch(error => console.error('Error fetching episodes:', error));
}


function displayEpisodes(episodes) {
  episodesContainer.innerHTML = '';
  episodes.forEach(episode => {
    const episodeElement = document.createElement('div');
    episodeElement.className = 'episode';
    episodeElement.innerHTML = `
      <img src="${episode.image ? episode.image.medium : ''}" alt="${episode.name}">
      <div class="details">
        <h3>${episode.name}</h3>
        <p>${generateEpisodeCode(episode.season, episode.number)}</p>
        <p>${episode.summary}</p>
        <a href="${episode.url}" target="_blank" class="episodeLinkBtn">Click for more information</a>
      </div>
    `;
    episodesContainer.appendChild(episodeElement);
  });
}


fetchShows();








