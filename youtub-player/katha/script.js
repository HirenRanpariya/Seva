// let environment = "Dev";
let environment = "Prod"
let ApiUrl = "https://script.google.com/macros/s/AKfycbx-P28nEvQiP18eIkCPxJJA_veVux_JQ1XqvaOMN-FpTlp6Cd_xnThd_DFTmJ_fH3fG/exec";

if (environment == "Dev") {
    ApiUrl = "https://script.google.com/macros/s/AKfycbxxNn1KiffO9psTj7BFbje7_L6BkWR6x5bw7R55bg3aQWkoUFVWhwD9AOGQb6iWRXAezQ/exec";
}

let VideoLength = ""
var timer = null

var checkVideoCount = 0
setInterval( checkVideoPlaying, 5000 )
setInterval(liveVideoCheck, 12000);  // 2 min
// setInterval(liveVideoCheck, 1200000);  // 20 min


var currentLiveVideoId = "";

var tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
var player;

console.log("at very start of the code on refresh ---")
let videoData = gsheetMaster( "" );
let videoDataRaw = "";
let videoDataArr = [];

// ------------ This function will create the player object --------------
function onYouTubeIframeAPIReady() {
    player = new YT.Player("player", {
        height: "100%",
        width: "100%",
        videoId: "yHApAxNHCVs",
        //host: 'https://www.youtube-nocookie.com',
        playerVars: {
            autoplay: 1,
            mute: 0,
            // controls: 0,
            // showinfo: 0,
            // autohide: 0,
            modestbranding: 0,
            vq: "hd1080",
            playsinline: 1,
        },
        events: {
            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange,
        },
    });
}

// --------- This funciton will be called on start of the video ----------
async function onPlayerReady(event) {
    
    event.target.playVideo();
    VideoLength = player.getDuration()
    console.log("video length in seconds --- "+ VideoLength)
    
    // Check for Live video if any ..
    // liveVideoCheck()

}

// ------------- function call on every player state change ---------------
async function onPlayerStateChange(event) {

    if (event.data == YT.PlayerState.ENDED) {

        timer = clearTimeout(timer);
        console.log( "Timer state ----------- " + timer)

        console.log( "video data raw -- " + videoDataRaw)
        console.log( "video data array -- " + videoDataArr)
        console.log( "video data -- " + videoData)
        console.log( "video data array length -- " + videoDataArr.length)

        if(videoDataArr.length > 0 ){
            // Player will play videos till the videoDataArr is empty --- if multiple video id in same cell
            let videoPlay = videoDataArr.shift().trim()
            player.loadVideoById( videoPlay );
        
        }
        else{

            console.log("---- player state change video end early ---")
            await gsheetMaster( "" )
            console.log("next video start after current video end  -- "+ videoData)
            player.loadVideoById( videoData );

        }
    }
    if (event.data == YT.PlayerState.PLAYING) {

        // this condition will be called on every event change as well as new video playing ---
        var videoId = player.getVideoData()["video_id"];
        console.log("currently Playing videoId --- " + videoId);
        console.log("is video Live ---- " + player.getVideoData().isLive)
        VideoLength = player.getDuration()
        console.log("video length in seconds -------- "+ VideoLength)
        console.log("Timer value before ------------- " + timer)
        if(!timer && !player.getVideoData().isLive  ){
            console.log("Timeout set for 7 second early ")
            timer = setTimeout( videoEndEarly , (VideoLength-7)*1000  )
            console.log("Timer value After ---------- " + timer)
        }

    }
 
}

// ---------- video will end early and will change to the next video -------
async function videoEndEarly(){
    
    // because of new feature this function will be called before the end of the video 
    // 7 seconds before the video ends
    // this will act similar to the onPlayerStateChange() function

    timer = clearTimeout(timer);
    console.log( "Timer state ----------- " + timer)

    console.log("video data raw -- " + videoDataRaw);
    console.log("video data array -- " + videoDataArr);
    console.log("video data -- " + videoData);
    console.log("video data array length -- " + videoDataArr.length);

    if (videoDataArr.length > 0) {
        
        let videoPlay = videoDataArr.shift().trim();
        player.loadVideoById(videoPlay);
    
    } 
    else {
    
        console.log("---- gshet call in side video end early ---")
        await gsheetMaster("");
        console.log("next video start after current video end  -- " + videoData);
        player.loadVideoById(videoData);
    
    }
    
}



// ---------------------- Live video check functions ------------------------
async function liveVideoCheck() {

    await checkLiveVideo( ( res ) => {
        
        console.log(res);
        console.log("Live video Check ....... ");


        let title = JSON.parse(res).data.title
        console.log(title)
        console.log(!title.includes("Live Swaminarayan TV"))
        console.log( player.getVideoData().video_id != JSON.parse(res).data.video_id )
        console.log(player.getVideoData().video_id , JSON.parse(res).data.video_id )

        if( !title.includes("Live Swaminarayan TV") && !title.includes("Bhajamrutam Dhun Parayan") && player.getVideoData().video_id != JSON.parse(res).data.video_id ){

            
            timer = clearTimeout(timer);
            console.log( "Timer state ----------- " + timer)

            console.log("Live video is playing Now -------------")
            if(player.getVideoData().video_id != JSON.parse(res).data.video_id){
                player.stopVideo();
                player.loadVideoById(JSON.parse(res).data.video_id);
            }
            currentLiveVideoId = JSON.parse(res).data.video_id
  
        }
        else if( title.includes("Live Swaminarayan TV") && currentLiveVideoId != "Noid" ){

            player.stopVideo();
            
            // youtubeId needs to be updated here check this later ------------------------------------------------------ ??????? 

            player.loadVideoById( videoData );          
            currentLiveVideoId = "Noid"

        }
    })
}


var checkLiveVideo = async ( callback ) => {
    
    try {

        var requestOptions = {
            method: "GET",
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


// ---------------- master api call to get youtube id -----------------------
async function gsheetMaster ( youtubeID ) {

    let body = {
        "youtubeID": youtubeID
    }
    var raw = JSON.stringify(body);

    console.log(raw)

    var requestOptions = {
        method: 'POST',
        body: raw,
        redirect: 'follow'
    };

    await fetch( ApiUrl +"?sheet=kathaMaster&method=master", requestOptions)
    .then(response => response.text())
    .then(result => {

        console.log(result)
        console.log("Master API call -----")

        videoDataRaw = JSON.parse( result ).data.youtubeID
        videoDataArr = videoDataRaw.split(",")
        if(videoDataArr == ""){

            videoData = videoDataRaw.trim()
        }
        else{

            videoData = videoDataArr.shift().trim()
        }

        console.log( "video data raw -- " + videoDataRaw)
        console.log( "video data array -- " + videoDataArr)
        console.log( "video data -- " + videoData)

        checkVideoCount = 0

        player.stopVideo();            
        player.loadVideoById( videoData ); 
        player.playVideo();

    })   
    .catch(error => {

        console.log('error', error)

    });

}


//-------- this function will check video is playing or not every 5 seconds ----------
async function checkVideoPlaying(){

    // var isPlayable = player.getVideoData()["backgroundable"];
    console.log( JSON.stringify( player.getVideoLoadedFraction() ) )
    if( JSON.stringify( player.getVideoLoadedFraction()) == "0"){
        checkVideoCount += 1;
        console.log("Video is not playing right now current count is --> "+ checkVideoCount)
    }
    else{
        checkVideoCount = 0;
    }
    if( checkVideoCount >= 3 ){

        checkVideoCount = 0
        console.log("not playing any video  -------- video unavailable")
        await gsheetMaster( "" )
    
    }

}