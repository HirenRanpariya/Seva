// let environment = "Dev";
let environment = "Prod"
let ApiUrl = "https://script.google.com/macros/s/AKfycbwuoP_nBP7fV5ol3fdvtuarlwfEj-LEwGmf3nCCeLeTJWgGXUtBqUPGo0BlElHMa2sr/exec";

if (environment == "Dev") {
    ApiUrl = "https://script.google.com/macros/s/AKfycbwZtdlGdaJO78exGG6rB5jBmcM9iB_9SP_vKxE98nOI_OsUdEVaixSWSybsFTfi5Cyg3g/exec";
}

let VideoLength = ""
var timer = null


var timeoutVideoID = "";
var timeoutVideoIDRaw = "";
var timeoutVideoIDArr = [];
var subtractMilliSecondsValue = "";
var timeoutVideoPlay = false

const intervalTime = 300000

// setInterval( gsheetSubMaster , intervalTime );
setInterval( checkVideoPlaying, 5000 )
// setInterval(liveVideoCheck, 12000000);


var video = {};

var currentLiveVideoId = "";

var tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
var player;

let videoData = gsheetMaster("", "1");
let videoDataRaw = "";
let videoDataArr = [];

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

// The API will call this function when the video player is ready. ----- on start or page refresh
async function onPlayerReady(event) {
    event.target.playVideo();

    VideoLength = player.getDuration()
    console.log("video length in seconds --- "+ VideoLength)
    // Check for Live video if any ..
    // liveVideoCheck()

    // API call to get time in milisecond and video id to play next timed video ----------------------------------------------------
    // await gsheetSubMaster()

    // console.log(event.target.getVideoData().video_id);
    // console.log(event.target.getVideoData().title);
}

async function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.ENDED) {
        // API call for master with old ID passed and response will be passed below -----------------------------------??

        timer = null

        console.log("Player finction after End video ----- ")

        console.log( "timeout video data raw -- " + timeoutVideoIDRaw)
        console.log( "timeout video data array -- " + timeoutVideoIDArr)
        console.log( "timeout video data array length -- " + timeoutVideoIDArr.length)
        console.log("timeout play flag ----- "+ timeoutVideoPlay)
        console.log( "Wait Time in miliseconds -- " + subtractMilliSecondsValue)
        
        console.log( "video data raw -- " + videoDataRaw)
        console.log( "video data array -- " + videoDataArr)
        console.log( "video data -- " + videoData)
        console.log( "video data array length -- " + videoDataArr.length)

        if (timeoutVideoIDArr.length > 0 && timeoutVideoPlay == true ){
            
            timeoutVideoID = timeoutVideoIDArr.shift().trim()
            player.loadVideoById( timeoutVideoID );
            
        }
        else if(videoDataArr.length > 0 ){

            let videoPlay = videoDataArr.shift().trim()
            player.loadVideoById( videoPlay );
        
        }
        else{

            await gsheetMaster( videoDataRaw , "1" )
            console.log("next video start after current video end  -- "+ videoData)
            player.loadVideoById( videoData );

        }
    }
    if (event.data == YT.PlayerState.PLAYING) {
        var videoId = player.getVideoData()["video_id"];
        console.log("currently Playing videoId --- " + videoId);

        VideoLength = player.getDuration()
        console.log("video length in seconds --- "+ VideoLength)
        if(!timer){
            console.log("Timeout set for 7 second early ----- ")
            timer = setTimeout( videoEndEarly , (VideoLength-7)*1000  )
        }

    }
    if (event.data == YT.PlayerState.CUED) {
        // var videoId = player.getVideoData()["video_id"];
        // console.log(videoId);
    }
}
function stopVideo() {
    player.stopVideo();
}


async function videoEndEarly(){
    timer = null

    console.log("Inside Video End Early Function ----- ");

    console.log("timeout video data raw -- " + timeoutVideoIDRaw);
    console.log("timeout video data array -- " + timeoutVideoIDArr);
    // console.log( "timeout video data -- " + timeoutVideoID)
    console.log("timeout video data array length -- " + timeoutVideoIDArr.length);

    console.log("video data raw -- " + videoDataRaw);
    console.log("video data array -- " + videoDataArr);
    console.log("video data -- " + videoData);
    console.log("video data array length -- " + videoDataArr.length);

    if (timeoutVideoIDArr.length > 0  && timeoutVideoPlay == true ) {
    
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
        await gsheetMaster(videoDataRaw, "1");
        console.log("next video start after current video end  -- " + videoData);
        player.loadVideoById(videoData);
    
    }
    
}

async function TimeTableAlert() {

    player.stopVideo();
    
    console.log("Inside Time Table Alert ");
    console.log( "timeout video data raw -- " + timeoutVideoIDRaw)
    console.log( "timeout video data array -- " + timeoutVideoIDArr)
    // console.log( "timeout video data -- " + timeoutVideoID)
    console.log( "timeout video data array length -- " + timeoutVideoIDArr.length)

    timeoutVideoPlay = true

    if (timeoutVideoIDArr.length > 0 ){
        
        timeoutVideoID = timeoutVideoIDArr.shift().trim()
        player.loadVideoById( timeoutVideoID );
        
    }
    else{
        
        player.loadVideoById( timeoutVideoID );
        // await gsheetSubMaster( )
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

async function gsheetMaster ( youtubeID , status ) {

    let body = {
        "youtubeID": youtubeID, 
        "Played": status
    }
    var raw = JSON.stringify(body);

    console.log(raw)

    var requestOptions = {
        method: 'POST',
        body: raw,
        redirect: 'follow'
    };

    await fetch( ApiUrl +"?sheet=kirtanMaster&method=master", requestOptions)
    .then(response => response.text())
    .then(result => {

        console.log(result)
        console.log("Master API call -----")

        videoDataRaw = JSON.parse( result ).data.youtubeID
        videoDataArr = videoDataRaw.split(",")
        if(videoDataArr == ""){

            videoData = videoDataRaw
        }
        else{

            videoData = videoDataArr.shift()
        }

        console.log( "video data raw -- " + videoDataRaw)
        console.log( "video data array -- " + videoDataArr)
        console.log( "video data -- " + videoData)


        player.stopVideo();            
        player.loadVideoById( videoData ); 
        player.playVideo();

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

    await fetch( ApiUrl + "?sheet=kirtanSubMaster&method=subMaster", requestOptions)
    .then(response => response.text())
    .then(result => {

        console.log(result)
        console.log("Sub master API call -----")

        timeoutVideoIDRaw = JSON.parse( result ).data.youtubeID
        timeoutVideoIDArr = timeoutVideoIDRaw.split(",")
        timeoutVideoID = ""
        // timeoutVideoPlay = false

        
        console.log( "timeout video data raw -- " + timeoutVideoIDRaw)
        console.log( "timeout video data array -- " + timeoutVideoIDArr)
        console.log( "timeout video data -- " + timeoutVideoID)

        subtractMilliSecondsValue = JSON.parse( result ).data.waitTime ;

        console.log("wait time in miliseconds ----- "+ subtractMilliSecondsValue )


        if(subtractMilliSecondsValue <= intervalTime){
            console.log("Timeout set")
            setTimeout(TimeTableAlert, subtractMilliSecondsValue);
        }
        else{
            console.log("Timeout not set -- wait time is higher")
        }

    })   
    .catch(error => {

        console.log('error', error)

    });

}



async function checkVideoPlaying(){

    var video_Title = player.getVideoData()["title"];
    // console.log("This is video title inside the check video function " +  video_Title );
    if(video_Title == ""){
        console.log("not playing any video  -------- video unavailable")
        await gsheetMaster( videoDataRaw , "fail" )
    }

}