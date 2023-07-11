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

// sub master variables and calling interval
var timeoutVideoID = "";
var timeoutVideoIDRaw = "";
var timeoutVideoIDArr = []
var subtractMilliSecondsValue = "";
var timeoutVideoPlay = false

const intervalTime = 300000   // 5 min
// const intervalTime = 60000   // 60 sec
setInterval( gsheetSubMaster , intervalTime );


var tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
var player;

console.log("at very start of the code on refresh ---")
let videoData = gsheetMaster("")
let videoDataRaw = "";
let videoDataArr = [];

// ------------ This function will create the player object --------------
function onYouTubeIframeAPIReady() {
    player = new YT.Player("player", {
        height: '100%',
        width: '100%',
        videoId: "icjawl8nI3U" ,
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
    
    // API call to get time in milisecond and video id to play next timed video ----------------------------------------
    await gsheetSubMaster()

}

// ------------- function call on every player state change ---------------
async function onPlayerStateChange(event) {

    if (event.data == YT.PlayerState.ENDED) {

       
        timer = clearTimeout(timer);
        console.log( "Timer state ----------- " + timer)

        console.log( "timeout video data raw ------------ " + timeoutVideoIDRaw)
        console.log( "timeout video data array ---------- " + timeoutVideoIDArr)
        console.log( "timeout play flag ----------------- " + timeoutVideoPlay)
        console.log( "Wait Time in miliseconds ---------- " + subtractMilliSecondsValue)
        
        console.log( "video data raw --------------- " + videoDataRaw)
        console.log( "video data array ------------- " + videoDataArr)
        console.log( "video data ------------------- " + videoData)

        if (timeoutVideoIDArr.length > 0 && timeoutVideoPlay == true ){
            
            // Player will play videos till the timeoutVideoIDArr is empty --- if multiple video id in same cell
            timeoutVideoID = timeoutVideoIDArr.shift().trim()
            player.loadVideoById( timeoutVideoID );
            
        }
        else if(videoDataArr.length > 0 ){

            // Player will play videos till the videoDataArr is empty --- if multiple video id in same cell
            timeoutVideoPlay = false
            let videoPlay = videoDataArr.shift().trim()
            player.loadVideoById( videoPlay );
        
        }
        else{

            console.log("---- player state change video end early ---")
            timeoutVideoPlay = false
            await gsheetMaster( videoDataRaw )
            console.log("next video start after current video end  -- "+ videoData)
            player.loadVideoById( videoData );

        }

    }
    if (event.data == YT.PlayerState.PLAYING) {
       
        // this condition will be called on every event change as well as new video playing ---
        var videoId = player.getVideoData()["video_id"];
        console.log("currently Playing videoId --- " + videoId);
        VideoLength = player.getDuration()
        console.log("video length in seconds --- "+ VideoLength)
        console.log("Timer value before ------ " + timer)
        if(!timer){
            console.log("Timeout set for 7 second early ")
            timer = setTimeout( videoEndEarly , (VideoLength-7)*1000  )
            console.log("Timer value After ------ " + timer)
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

    console.log("Inside Video End Early Function ----- ");

    console.log( "timeout video data raw --------- " + timeoutVideoIDRaw)
    console.log( "timeout video data array ------- " + timeoutVideoIDArr)
    console.log( "timeout play flag -------------- " + timeoutVideoPlay)
    console.log( "Wait Time in miliseconds ------- " + subtractMilliSecondsValue)
    
    console.log( "video data raw ------------ " + videoDataRaw)
    console.log( "video data array ---------- " + videoDataArr)
    console.log( "video data ---------------- " + videoData)


    if (timeoutVideoIDArr.length > 0 && timeoutVideoPlay == true ) {
    
        timeoutVideoID = timeoutVideoIDArr.shift().trim();
        player.loadVideoById(timeoutVideoID);

    } 
    else if (videoDataArr.length > 0) {
        
        timeoutVideoPlay = false
        let videoPlay = videoDataArr.shift().trim();
        player.loadVideoById(videoPlay);
    
    } 
    else {
        
        timeoutVideoPlay = false
        await gsheetMaster(videoDataRaw);
        console.log("next video start after current video end  -- " + videoData);
        player.loadVideoById(videoData);
    
    }
    
}



// ---------------- master api call to get youtube id -----------------------
async function gsheetMaster( youtubeID ) {

    let body = {
        "youtubeID": youtubeID
    }
    var raw = JSON.stringify(body);

    console.log(raw)    
    timer = clearTimeout(timer);
    console.log( "Timer state ----------- " + timer)


    var requestOptions = {
        method: 'POST',
        body: raw,
        redirect: 'follow'
    };

    await fetch( ApiUrl +"?sheet=kirtanMaster&method=master", requestOptions)
    .then(response => response.text())
    .then(result => {

        console.log("Master API call -----")
        console.log(result)

        videoDataRaw = JSON.parse( result ).data.youtubeID
        videoDataArr = videoDataRaw.split(",")
        if(videoDataArr == ""){

            videoData = videoDataRaw.trim()
        }
        else{

            videoData = videoDataArr.shift().trim()
        }

        // console.log( "video data raw -- " + videoDataRaw)
        // console.log( "video data array -- " + videoDataArr)
        // console.log( "video data -- " + videoData)

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
    if( checkVideoCount >= 3 ){

        checkVideoCount = 0
        console.log("not playing any video  -------- video unavailable")
        await gsheetMaster( videoDataRaw )
    
    }

}




// ---------------- sub master api call to get time and youtube id -----------------------
async function gsheetSubMaster() {

    var requestOptions = {
        method: 'POST',
        redirect: 'follow'
    };

    await fetch( ApiUrl +"?sheet=kirtanSubMaster&method=subMaster", requestOptions)
    .then(response => response.text())
    .then(result => {

        console.log("Sub master API call -----")
        console.log(result)
        subtractMilliSecondsValue = JSON.parse( result ).data.waitTime ;
        console.log("wait time in miliseconds ----- "+ subtractMilliSecondsValue )


        if(subtractMilliSecondsValue <= intervalTime){
            console.log("Timeout set")
            setTimeout(TimeTableAlert, subtractMilliSecondsValue);
             
            timeoutVideoIDRaw = JSON.parse( result ).data.youtubeID
            timeoutVideoIDArr = timeoutVideoIDRaw.split(",")
            timeoutVideoID = ""
            // timeoutVideoPlay = false

            console.log( "timeout video data raw -- " + timeoutVideoIDRaw)
            console.log( "timeout video data array -- " + timeoutVideoIDArr)
            console.log( "timeout video data -- " + timeoutVideoID)

        }
        else{
            console.log("Timeout not set -- wait time is higher")
        }

    })   
    .catch(error => {

        console.log('error', error)

    });

}


async function TimeTableAlert() {
    
    console.log("Inside Time Table Alert ");
    console.log( "timeout video data raw --------- " + timeoutVideoIDRaw)
    console.log( "timeout video data array ------- " + timeoutVideoIDArr)

    timeoutVideoPlay = true

    timer = clearTimeout(timer);
    console.log( "Timer state ----------- " + timer)


    if (timeoutVideoIDArr.length > 0 ){
        
        timeoutVideoID = timeoutVideoIDArr.shift().trim()
        player.stopVideo();            
        player.loadVideoById( timeoutVideoID ); 
        player.playVideo();
        
    }
    else{
        
        player.stopVideo();            
        player.loadVideoById( timeoutVideoID ); 
        player.playVideo();

    }
 
}
