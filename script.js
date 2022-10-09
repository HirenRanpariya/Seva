var videos = ["pYoMiqaAvPY", "TWmxQjlRh-k", "tdSjnPCO39s", "2ODdOwrKe2k"];

let currentVideoIndex = 0;
var tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
var player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player("player", {
        height: "390",
        width: "640",
        videoId: videos[currentVideoIndex],
        playerVars: {
            autoplay: 1,
            mute: 0,
            modestbranding: 1,
            vq: "hd1080",
            playsinline: 1,
        },
        events: {
            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange,
        },
    });
}

function timeToAlert() {
    console.log("inside this function ");
    player.stopVideo();
    currentVideoIndex = currentVideoIndex + 1;
    player.loadVideoById(videos[currentVideoIndex]);
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
    event.target.playVideo();

    var timeIsBeing936 = new Date("10/09/2022 10:06:00 AM").getTime(),
        currentTime = new Date().getTime(),
        subtractMilliSecondsValue = timeIsBeing936 - currentTime;

    console.log(subtractMilliSecondsValue);

    if (subtractMilliSecondsValue > 0) {
        setTimeout(timeToAlert, subtractMilliSecondsValue);
    }

    console.log("inside onPlayerReady");

    console.log(event.target.getVideoData().video_id);
    console.log(event.target.getVideoData().title);
}
function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.ENDED) {
        //console.log(event.target); //videoTitle
        currentVideoIndex = currentVideoIndex + 1;
        if (currentVideoIndex == videos.length) {
            currentVideoIndex = 0;
        }
        player.loadVideoById(videos[currentVideoIndex]);
    }
    if (event.data == YT.PlayerState.PLAYING) {
        var videoId = player.getVideoData()["video_id"];
        console.log(videoId);

        // console.log("Before Index:"+currentVideoIndex);
        //     if(currentVideoIndex == (videos.length-1))
        //      currentVideoIndex=0;
        //     else

        //    console.log("Current Index:"+currentVideoIndex);
        // 	 var url = event.target.getVideoUrl();

        // 	 var match = url.match(/[?&]v=([^&]+)/);

        // 	 var videoId = match[1];
        // 	 console.log(videoId);
    }
    if (event.data == YT.PlayerState.CUED) {
    }
}
function stopVideo() {
    player.stopVideo();
}
