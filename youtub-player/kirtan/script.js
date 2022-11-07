// setInterval(liveVideoCheck, 120000);
// setInterval(liveVideoCheck, 12000000);

const clear = (() => {
    const defined = v => v !== null && v !== undefined;
    const timeout = setInterval(() => {
        const ad = [...document.querySelectorAll('.ad-showing')][0];
        if (defined(ad)) {
            const video = document.querySelector('video');
            if (defined(video)) {
                video.currentTime = video.duration;
            }
        }
    }, 500);
    return function() {
        clearTimeout(timeout);
    }
})();
// clear();
var timeoutVideoID = "";
var timeoutVideoIDRaw = "";
var timeoutVideoIDArr = []
var subtractMilliSecondsValue = "";

// setInterval(liveVideoCheck, 10000);

var video = {};

var currentLiveVideoId = ""

var tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
var player;

let videoData = gsheetMaster("")
let videoDataRaw = "";
let videoDataArr = [];

function onYouTubeIframeAPIReady() {
    player = new YT.Player("player", {
        height: '100%',
        width: '100%',
        videoId: "TxBSVqof-7o" ,
        host: 'https://www.youtube-nocookie.com',
        playerVars: {
            autoplay: 1,
            mute: 0,
            // controls: 0,
            // showinfo: 0,
            // autohide: 0,
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

// The API will call this function when the video player is ready. ----- on start or page refresh  
async function onPlayerReady(event) {z

    event.target.playVideo();
    
    // Check for Live video if any ..
    // liveVideoCheck()

    // API call to get time in milisecond and video id to play next timed video ----------------------------------------------------
     await gsheetSubMaster()

    // console.log(event.target.getVideoData().video_id);
    // console.log(event.target.getVideoData().title);

}

async function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.ENDED) {

        // API call for master with old ID passed and response will be passed below -----------------------------------?? 

        console.log("Player finction after End video ----- ")

        console.log( "timeout video data raw -- " + timeoutVideoIDRaw)
        console.log( "timeout video data array -- " + timeoutVideoIDArr)
        // console.log( "timeout video data -- " + timeoutVideoID)
        console.log( "timeout video data array length -- " + timeoutVideoIDArr.length)


        console.log( "video data raw -- " + videoDataRaw)
        console.log( "video data array -- " + videoDataArr)
        console.log( "video data -- " + videoData)
        console.log( "video data array length -- " + videoDataArr.length)

        if (timeoutVideoIDArr.length > 0 ){
            
            timeoutVideoID = timeoutVideoIDArr.shift().trim()
            player.loadVideoById( timeoutVideoID );
            
        }
        else if(videoDataArr.length > 0 ){

            let videoPlay = videoDataArr.shift().trim()
            player.loadVideoById( videoPlay );
        
        }
        else{

            await gsheetMaster( videoDataRaw )
            console.log("next video start after current video end  -- "+ videoData)
            player.loadVideoById( videoData );

        }

    }
    if (event.data == YT.PlayerState.PLAYING) {
        
        var videoId = player.getVideoData()["video_id"];
        console.log("currently Playing videoId --- " + videoId);

    }
    if (event.data == YT.PlayerState.CUED) {

        // var videoId = player.getVideoData()["video_id"];
        // console.log(videoId);

    }
}
function stopVideo() {
    player.stopVideo();
}

async function TimeTableAlert() {

    player.stopVideo();
    
    console.log("Inside Time Table Alert ");
    console.log( "timeout video data raw -- " + timeoutVideoIDRaw)
    console.log( "timeout video data array -- " + timeoutVideoIDArr)
    // console.log( "timeout video data -- " + timeoutVideoID)
    console.log( "timeout video data array length -- " + timeoutVideoIDArr.length)


    if (timeoutVideoIDArr.length > 0 ){
        
        timeoutVideoID = timeoutVideoIDArr.shift().trim()
        player.loadVideoById( timeoutVideoID );
        
    }
    else{
        
        player.loadVideoById( timeoutVideoID );
        await gsheetSubMaster( )
    }
    // API call to get time in milisecond and video id to play  ----------------------------------------------------
 
    
}


async function liveVideoCheck() {

    await checkLiveVideo( ( res ) => {
        
        console.log(res);
        console.log("Live video Check ....... ");
        let title = JSON.parse(res).data.title
        console.log(title)
        console.log(!title.includes("Live Swaminarayan TV"))
        console.log(currentLiveVideoId != JSON.parse(res).data.video_id)
        console.log(currentLiveVideoId , JSON.parse(res).data.video_id )
        if( !title.includes("Live Swaminarayan TV") && currentLiveVideoId != JSON.parse(res).data.video_id ){

            console.log("Live video is playing Now -------------")
            player.stopVideo();
            player.loadVideoById(JSON.parse(res).data.video_id);
            currentLiveVideoId = JSON.parse(res).data.video_id
  
        }
        else if( title.includes("Live Swaminarayan TV") && currentLiveVideoId != "Noid" ){

            player.stopVideo();
            
            // youtubeId needs to be updated here check this later ------------------------------------------------------ ??????? 

            player.loadVideoById( videoData.data.youtubeID );          
            currentLiveVideoId = "Noid"

        }
    })
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
            
    }
    catch (err) {
        console.log(err);
        return callback(false)
    }
}


async function gsheetMaster ( youtubeID  ) {

    let body = {
        "youtubeID": youtubeID, 
        "Played": 1
    }
    var raw = JSON.stringify(body);

    console.log(raw)

    var requestOptions = {
        method: 'POST',
        body: raw,
        redirect: 'follow'
    };

    await fetch("https://script.google.com/macros/s/AKfycbwuoP_nBP7fV5ol3fdvtuarlwfEj-LEwGmf3nCCeLeTJWgGXUtBqUPGo0BlElHMa2sr/exec?sheet=kirtanMaster&method=master", requestOptions)
    .then(response => response.text())
    .then(result => {

        console.log(result)
        console.log("Master API call -----")

        videoDataRaw = JSON.parse( result ).data.youtubeID
        videoDataArr = videoDataRaw.split(",")
        videoData = videoDataArr.shift()

        console.log( "video data raw -- " + videoDataRaw)
        console.log( "video data array -- " + videoDataArr)
        console.log( "video data -- " + videoData)


        player.stopVideo();            
        player.loadVideoById( videoData ); 

    })   
    .catch(error => {

        console.log('error', error)

    });

}

async function gsheetSubMaster ( ) {

    var requestOptions = {
        method: 'POST',
        redirect: 'follow'
    };

    await fetch("https://script.google.com/macros/s/AKfycbwuoP_nBP7fV5ol3fdvtuarlwfEj-LEwGmf3nCCeLeTJWgGXUtBqUPGo0BlElHMa2sr/exec?sheet=kirtanSubMaster&method=subMaster", requestOptions)
    .then(response => response.text())
    .then(result => {

        console.log(result)
        console.log("Sub master API call -----")

        timeoutVideoIDRaw = JSON.parse( result ).data.youtubeID
        timeoutVideoIDArr = timeoutVideoIDRaw.split(",")
        timeoutVideoID = ""

        
        console.log( "timeout video data raw -- " + timeoutVideoIDRaw)
        console.log( "timeout video data array -- " + timeoutVideoIDArr)
        console.log( "timeout video data -- " + timeoutVideoID)

        subtractMilliSecondsValue = JSON.parse( result ).data.waitTime ;

        setTimeout(TimeTableAlert, subtractMilliSecondsValue);

    })   
    .catch(error => {

        console.log('error', error)

    });

}



