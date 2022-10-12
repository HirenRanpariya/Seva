var videosJson = {
    Master: [
        "pYoMiqaAvPY",
        "4WxIuynk6QY",
        "2ODdOwrKe2k",
        "tdSjnPCO39s",
        "pYoMiqaAvPY",
        "4WxIuynk6QY",
        "2ODdOwrKe2k",
        "tdSjnPCO39s",
        "pYoMiqaAvPY",
        "4WxIuynk6QY",
        "2ODdOwrKe2k",
        "tdSjnPCO39s",
        "pYoMiqaAvPY",
        "4WxIuynk6QY",
        "2ODdOwrKe2k",
        "tdSjnPCO39s",
    ],

    Sunday: [
        {
            time: "11:00",
            period: "AM",
            title: "afterNoonMansi",
            id: "2ODdOwrKe2k",
        },
        {
            time: "8:00",
            period: "PM",
            title: "Chestha",
            id: "KRh7nhhLjpk",
        },
        {
            time: "10:30",
            period: "PM",
            title: "podhaniyu",
            id: "tdSjnPCO39s",
        },
    ],

    Monday: [
        {
            time: "11:00",
            period: "AM",
            title: "afterNoonMansi",
            id: "2ODdOwrKe2k",
        },
        {
            time: "5:59",
            period: "PM",
            title: "Chestha",
            id: "DV_YrGlRscg",
        },
        {
            time: "6:01",
            period: "PM",
            title: "podhaniyu",
            id: "2ODdOwrKe2k",
        },
        {
            time: "6:02",
            period: "PM",
            title: "podhaniyu",
            id: "4WxIuynk6QY",
        },
        {
            time: "6:04",
            period: "PM",
            title: "podhaniyu",
            id: "pYoMiqaAvPY",
        },
    ],
    Tuesday: [
        {
            time: "11:00",
            period: "AM",
            title: "afterNoonMansi",
            id: "2ODdOwrKe2k",
        },
        {
            time: "8:00",
            period: "PM",
            title: "Chestha",
            id: "KRh7nhhLjpk",
        },
        {
            time: "10:30",
            period: "PM",
            title: "podhaniyu",
            id: "tdSjnPCO39s",
        },
    ],
    Wednesday: [
        {
            time: "11:00",
            period: "AM",
            title: "afterNoonMansi",
            id: "2ODdOwrKe2k",
        },
        {
            time: "8:00",
            period: "PM",
            title: "Chestha",
            id: "KRh7nhhLjpk",
        },
        {
            time: "10:30",
            period: "PM",
            title: "podhaniyu",
            id: "tdSjnPCO39s",
        },
    ],
    Thursday: [
        {
            time: "11:00",
            period: "AM",
            title: "afterNoonMansi",
            id: "2ODdOwrKe2k",
        },
        {
            time: "8:00",
            period: "PM",
            title: "Chestha",
            id: "KRh7nhhLjpk",
        },
        {
            time: "10:30",
            period: "PM",
            title: "podhaniyu",
            id: "tdSjnPCO39s",
        },
    ],
    Friday: [
        {
            time: "11:00",
            period: "AM",
            title: "afterNoonMansi",
            id: "2ODdOwrKe2k",
        },
        {
            time: "8:00",
            period: "PM",
            title: "Chestha",
            id: "KRh7nhhLjpk",
        },
        {
            time: "10:30",
            period: "PM",
            title: "podhaniyu",
            id: "tdSjnPCO39s",
        },
    ],
    Saturday: [
        {
            time: "11:00",
            period: "AM",
            title: "afterNoonMansi",
            id: "2ODdOwrKe2k",
        },
        {
            time: "8:00",
            period: "PM",
            title: "Chestha",
            id: "KRh7nhhLjpk",
        },
        {
            time: "10:30",
            period: "PM",
            title: "podhaniyu",
            id: "tdSjnPCO39s",
        },
    ],
};

setInterval(liveVideoCheck, 10000);

var TimeoutID = "";
let videos = videosJson["Master"];
var video = {};
let currentVideoIndex = 0;
var currentLiveVideoId = ""

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

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
    event.target.playVideo();

    liveVideoCheck()

    video = getCurrentVideo(videosJson[getDayName()]);
    console.log("video current function " + video);
    let subtractMilliSecondsValue = -1;
    if (video) {
        subtractMilliSecondsValue = getTimeMiliseconds(video);
    }

    if (subtractMilliSecondsValue > 0) {
        setTimeout(TimeTableAlert, subtractMilliSecondsValue);
    }

    // let length = player.getDuration()
    // console.log("video length in seconds --- "+ length)

    // console.log("inside onPlayerReady");

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

function getDayName() {
    const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const d = new Date();
    let day = weekday[d.getDay()];
    // console.log(day);
    return day;
}

function TimeTableAlert() {
    console.log("Inside Time Table Alert ");
    // video = getCurrentVideo( videosJson[ getDayName() ] )
    console.log(video);

    player.stopVideo();
    currentVideoIndex = currentVideoIndex + 1;
    player.loadVideoById(video.id);

    video = getCurrentVideo(videosJson[getDayName()]);
    console.log(video);

    let subtractMilliSecondsValue = -1;
    if (video) {
        subtractMilliSecondsValue = getTimeMiliseconds(video);
    }

    if (subtractMilliSecondsValue > 0) {
        setTimeout(TimeTableAlert, subtractMilliSecondsValue);
    }
}

function getCurrentVideo(videoData) {
    console.log(videoData);
    let video = [];
    videoData.forEach((element) => {
        if (compareTime(element)) {
            video.push(element);
        }
    });
    console.log(video);
    return video[0];
}

function compareTime(element) {
    let time = element.time.split(":");
    let hour = parseInt(time[0]);
    let minute = parseInt(time[1]);
    if (element.period == "PM") {
        hour = parseInt(time[0]) + 12;
    }

    var current = new Date();
    let currentHour = current.getHours();
    let currentMinute = current.getMinutes();

    console.log(hour, minute);
    console.log(currentHour, currentMinute);

    if (hour > currentHour || hour == currentHour) {
        if ((hour == currentHour && currentMinute > minute) || currentMinute == minute) {
            console.log(false);
            return false;
        } else {
            console.log(true);
            return true;
        }
    } else {
        console.log(false);
        return false;
    }
}

function getTimeMiliseconds(videoElement) {
    console.log(videoElement);

    let date = new Date();
    let dateString = "" + (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear() + " " + videoElement.time + ":00 " + videoElement.period + "";
    var timeIsBeing936 = new Date(dateString).getTime(),
        currentTime = new Date().getTime();
    return timeIsBeing936 - currentTime;
}

async function liveVideoCheck() {

    await checkLiveVideo( ( res ) => {
        
        console.log(res);
        console.log("Live video Check ....... ");
        let title = JSON.parse(res).data.title
        console.log(title)
        console.log(!title.includes("Live Swaminarayan TV"))
        console.log(currentLiveVideoId != JSON.parse(res).data.video_id)
        if( !title.includes("Live Swaminarayan TV") && currentLiveVideoId != JSON.parse(res).data.video_id ){

            console.log("Live video is playing Now -------------")
            player.stopVideo();
            player.loadVideoById(JSON.parse(res).data.video_id);

            currentLiveVideoId = JSON.parse(res).data.video_id

        }
        else{

            player.stopVideo();
            currentVideoIndex = currentVideoIndex + 1;
            player.loadVideoById(video.id);

        }
    
    });

}

var checkLiveVideo = async ( callback ) => {
    
    try {
  
        var myHeaders = new Headers();
        myHeaders.append("Cookie", "PHPSESSID=tcmg05iinnnho5e6ap9nv4f9v6");
    
        var requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow",
        };
    
        await fetch("https://cms.swaminarayanbhagwan.org/wp-json/sb/v1/video/live", requestOptions)
            .then((response) => response.text())
            .then((result) => {
                
                // console.log("this is result")
                // console.log(result)
                return callback(result)
            
            })        
            .catch((error) => {

                console.log("error", error)
                return callback(false)
                
            });
            
            // return res
            
        } catch (err) {
            console.log(err);
            return callback(false)
    }
}
