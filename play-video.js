const apiKey = 'AIzaSyBeliNXTnz9u1Jkvly3b0GH7nPec96G_2g';
const url = "https://www.googleapis.com/youtube/v3/commentThreads";
const commentsContainer = document.getElementById("comments-container");
//console.log(document.cookie.split("="));
//console.log(document.cookie.split("=")[1].split(";")[0]);
window.addEventListener("load", () => {
  let videoId = localStorage.getItem("id");
  //let videoId = document.cookie.split("=")[1].split(";")[0];
  console.log(videoId);
  if (YT) {
    new YT.Player("video-placeholder", {
      height: "500",
      width: "800",
      videoId,
    });
    //addDetails();
    loadComments(videoId);
  }
});

function addDetails(){
  const videoBox = document.getElementById("video-info");
  const videoDetails = document.createElement("div");
  videoDetails.className = 'video-info-bottom-left';
  videoDetails.innerHTML  = `
      <h4>Lorem ipsum dolor sit amet.</h4>
      <span>1k views</span>
      <span>10 days ago</span>
  `;

}
async function loadComments(videoId) {
  let endpoint = `${url}?key=${apiKey}&videoId=${videoId}&maxResults=10&part=snippet`;

  const response = await fetch(endpoint);
  const result = await response.json();

  result.items.forEach((item) => {
    const repliesCount = item.snippet.totalReplyCount;
    const {
      authorDisplayName,
      textDisplay,
      //likeCount,
      authorProfileImageUrl: profileUrl,
     // publishedAt,
    } = item.snippet.topLevelComment.snippet;

    const div = document.createElement("div");
    div.className = "comment";
    div.innerHTML = `
    <img src="${profileUrl}" class="author-profile" alt="author profile" />
    <div><b class="author-name">${authorDisplayName}</b>
    <p class="author-comment">${textDisplay}</p>
    <span class="item"><i class="fa-solid fa-thumbs-up"></i></span>
    <span class="item"><i class="fa-solid fa-thumbs-down"></i></span>
    <span class="item">Reply</span>
    </div>`;

    commentsContainer.appendChild(div);
  });
}