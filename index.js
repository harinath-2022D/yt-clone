const apiKey = 'AIzaSyBeliNXTnz9u1Jkvly3b0GH7nPec96G_2g';
const baseUrl = "https://www.googleapis.com/youtube/v3";
let searchQuery = "latest";
//window.onload = searchVideos("latest");
window.addEventListener("load",()=>{
  searchVideos(searchQuery);
})
const searchButton = document.getElementById("search-button");
const searchInput = document.getElementById("search-input");
const container = document.getElementById("videos-section");

function navigateToVideoDetails(videoId,title) {
  //document.cookie = `id=${videoId}; path=/play-video.html`;
  localStorage.setItem("id", videoId);
  window.location.href = "https://harinath-2022d.github.io/yt-clone/play-video.html";
}

function calculateTheTimeGap(publishTime) {
  let publishDate = new Date(publishTime);
  let currentDate = new Date();

  let secondsGap = (currentDate.getTime() - publishDate.getTime()) / 1000;

  const secondsPerDay = 24 * 60 * 60;
  const secondsPerWeek = 7 * secondsPerDay;
  const secondsPerMonth = 30 * secondsPerDay;
  const secondsPerYear = 365 * secondsPerDay;

  if (secondsGap < secondsPerDay) {
    return `${Math.ceil(secondsGap / (60 * 60))}hrs ago`;
  }
  if (secondsGap < secondsPerWeek) {
    return `${Math.ceil(secondsGap / secondsPerWeek)} weeks ago`;
  }
  if (secondsGap < secondsPerMonth) {
    return `${Math.ceil(secondsGap / secondsPerMonth)} months ago`;
  }
  //console.log((Number)`${Math.ceil(secondsGap / secondsPerYear)}`);
  return `${Math.ceil(secondsGap / secondsPerYear)} years ago`;
}

function loadVideos(response) {
  container.innerHTML = '';
  // console.log(response.items.length);
  for (let j = 0; j < response.items.length; j++) {
    const getItem = response.items[j];
    //console.log(getItem);
    const video = document.createElement("div");
    video.className = "video-card";
    const daysCount = parseInt(getItem.statistics.viewCount / 1000);
    video.innerHTML = `
        <div class="video-card-top">
            <img id="video-img" src="${getItem.snippet.thumbnails.high.url}"/>
        </div>
        <div class="video-card-bottom">
            <div class="video-card-bottom-left">
                <button id="channel-logo"><img id="channel-logo-img"src="${getItem.channelLogo}" alt=""></button>
            </div>
            <div class="video-card-bottom-right">
                <h5>${getItem.snippet.title}</h5>
                <p>${getItem.snippet.channelTitle}</p>
                <span>${daysCount}k views</span>
                <span>${getItem.publishDuration}</span>
            </div>
        </div>
        `;
    video.addEventListener("click", () => {
      //console.log("going to play video page",getItem.id.videoId);
      navigateToVideoDetails(getItem.id.videoId,getItem.snippet.title);
    });
    container.appendChild(video);

  }
}



async function getVideoStatistics(videoId) {
  // https://www.googleapis.com/youtube/v3/videos?key=AIzaSyDvo2p4xMEI3GC-PWH02_0OAIN1h88k4rE&part=statistics
  const endpoint = `${baseUrl}/videos?key=${apiKey}&part=statistics&id=${videoId}`
  try {
    const response = await fetch(endpoint);
    const result = await response.json();
    return result.items[0].statistics;
  } catch (error) {
    alert("Failed to fetch Statistics for ", videoId);
  }
}

async function fetchChannelLogo(channelId) {
  const endpoint = `${baseUrl}/channels?key=${apiKey}&id=${channelId}&part=snippet`;

  try {
    const response = await fetch(endpoint);
    const result = await response.json();
    return result.items[0].snippet.thumbnails.high.url;
  } catch (error) {
    alert("Failed to load channel logo for ", channelId);
  }
}

async function searchVideos(searchQuery) {
  const endpoint = `${baseUrl}/search?key=${apiKey}&q=${searchQuery}&part=snippet&type=video&maxResults=20`
  try {
    const result = await fetch(endpoint);
    const response = await result.json();
    console.log(response);
    for (let i = 0; i < response.items.length; i++) {
      let videoId = response.items[i].id.videoId;
      let channelId = response.items[i].snippet.channelId;

      let statistics = await getVideoStatistics(videoId);
      let channelLogo = await fetchChannelLogo(channelId);
      let publishDuration = calculateTheTimeGap(response.items[i].snippet.publishedAt)


      response.items[i].statistics = statistics;
      response.items[i].channelLogo = channelLogo;
      response.items[i].publishDuration = publishDuration;
      

      // console.log(response.items[i].id);
    }

    loadVideos(response);



  }
  catch (error) {
    alert("errror in search videos");
  }

}

async function searchingVideos(value) {
  const searchQuery = "latest";
  const response = await fetch(
    `${baseUrl}/search?key=${apiKey}&q=${searchQuery}&part=snippet&type=video&maxResults=2`
  );
  const result = await response.json();
  console.log(result);
}

searchButton.addEventListener('click', () => {
  searchQuery = searchInput.value;
  searchVideos(searchQuery);
});

