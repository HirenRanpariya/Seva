// let environment = "UAT"
var environment = "PROD"
var apiUrl = "https://script.google.com/macros/s/AKfycbyDhZKQVPMODVgzieBryM96HVpMPfG7buvKR6ycv6_NwmhYtjSSqQcZ0N2kXGedmt91/exec?myfunction="
if(environment == "UAT"){
    apiUrl = "https://script.google.com/macros/s/AKfycbxuPxfTXVGTfZyxucPsK0-N9PCML-zxKSBFC91xwoVk7M9MR0vWCNiaLeTs8KHK7Mw9/exec?myfunction="
}

console.log("Jay swaminarayan")


var tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// global variable
var player;
var skipTitleArr = []
var controls = {}
var endEarlyTimeOut = null
var subMasterTimeOut = null
var checkVideoCount = 0

async function onYouTubeIframeAPIReady() {

    controls = await callAPI( "getControlData" );
    controls = controls.data
    console.log('Get Controls API data:', controls);
   
    player = new YT.Player('player', {
        videoId: controls.youtubeId,
        playerVars: {
            'autoplay': 1,
            controls: 1 ,            // 0 disables the controls on video
            disablekb: 1,           // disable the keyboard
            fs: 0,                  // removes the full screen button
            modestbranding: 1,       // removes the youtube logo in right corner
            rel: 0,                 // 0 gives recomonded video only from the same channel at the end

        },
        events: {
            'onReady': onPlayerReady,
            "onStateChange": onPlayerStateChange,

        }
    });
    
   


}

async function onPlayerReady(event){

    console.log("Player is Ready to play Video")
    setInterval( checkVideoPlaying, controls.checkVideoInterval )
    
    if( controls.liveVideo ){
        
        setInterval( liveVideoCheck , controls.liveVideoInterval );

        skipTitleArr = controls.skipTitles.split(',').map(item => item.trim());
        await liveVideoCheck()

    }
    if( controls.subMaster ){

        setInterval( getSubMaster , controls.subMasterInterval );
        await getSubMaster()
    }
    
}

async function onPlayerStateChange(event){

    if(event.data == YT.PlayerState.ENDED)
    {
        endEarlyTimeOut = null
        checkVideoCount = 0

        console.log("Video has ended (No End Early), New video should play now")
        let res = await callAPI("getNextVideo")

        console.log(res)

        controls.youtubeId = res.data.youtubeId

        player.loadVideoById( controls.youtubeId );
    }
    else if(player.getVideoData().isLive ){

        // console.log(player.getVideoData().title)
        // console.log("Title master = " + controls.titleMaster)
        console.log("Title is set to Gsheet and check title master api call")
        await setVideoTitle( player.getVideoData().title )
        if(controls.titleMaster){
            // call a api call to set the title match variable
            console.log(await callAPI("checkTitleWithTitleMaster"))
        }
        // clearTimeout(endEarlyTimeOut) 
        endEarlyTimeOut = null
        subMasterTimeOut = null

        console.log("Live video is playing")

    }
    else if (event.data == YT.PlayerState.PLAYING) {

        // as soon as video starts playing we get this event called
        console.log("event check")

        // console.log(player.getVideoData().title)
        // console.log("Title master = " + controls.titleMaster)
        // if(controls.titleMaster){

        //     console.log("Title is set to Gsheet and check title master api call")
        //     await setVideoTitle( player.getVideoData().title )
        //     // call a api call to set the title match variable
        //     console.log(await callAPI("checkTitleWithTitleMaster"))
        // }

        console.log("Video TimeOut variable value --> "+ endEarlyTimeOut)

        if(!endEarlyTimeOut){

            console.log("Timeout set for "+ controls.endEarlyInterval/1000 +" second early ")
            endEarlyTimeOut = setTimeout( videoEndEarly , player.getDuration()*1000 - controls.endEarlyInterval )
        
        }
    
    }   

    
}

async function videoEndEarly(){

    if(player.getVideoData().isLive ){
        // clearTimeout(endEarlyTimeOut) 
        endEarlyTimeOut = null
        subMasterTimeOut = null
        console.log("Live video is playing")

    }
    else {

        // clearTimeout(endEarlyTimeOut) 
        endEarlyTimeOut = null
        checkVideoCount = 0

        console.log("Video has ended ( End Early Function ), New video should play now")
        
        let res = await callAPI("getNextVideo")
        controls.youtubeId = res.data.youtubeId
        
        player.loadVideoById( controls.youtubeId );
        
    }

}

// ----------------------------- Sub master function -----------------------------
async function getSubMaster(){

    if(player.getVideoData().isLive ){

        // clearTimeout(endEarlyTimeOut) 
        endEarlyTimeOut = null
        subMasterTimeOut = null

        console.log("Live video is playing")

    }
    else {

        console.log("Sub master")
        let res = await callAPI( "getSubMaster" );
        if(res.data.waitTime && res.data.waitTime < controls.subMasterInterval )
        {   
            console.log("wait time is less - " + res.data.waitTime )
            setTimeout( setSubMaster , res.data.waitTime );
        }
        else{
            console.log("-- subMaster API call - wait time is higher -- ")
        }
        
    }
}

async function setSubMaster(){

    console.log("Set Sub master api call -- ")
    let res = await callAPI( "setSubMaster" );
    controls.youtubeId = res.data.youtubeId
    console.log( "youtube id from submaster - "+controls.youtubeId )

    endEarlyTimeOut = null
    subMasterTimeOut = null

    player.stopVideo();
    player.loadVideoById( res.data.youtubeId );


}

// ---------------------- Live video check functions ------------------------
async function liveVideoCheck() {

    if(!player.getVideoData().isLive){

        let res = await liveVideoAPI()

        // console.log("This is the video currently in player "+ player.getVideoData().video_id)
        // console.log("This is the live video id -- " + res.data.video_id)

        if( res.data.video_id != player.getVideoData().video_id ){

            // This returns if we should live this video or not  (if true then don't make it live)
            let isLiveTitle = skipTitleArr.some( str => res.data.title.includes(str) );
            console.log("Live video title : -- " + res.data.title + ",  \nIs Title in Skip list : -- " + isLiveTitle )

            if(!isLiveTitle){
                console.log("set Is Video Live set to false  --- ")
                await callAPI("setVideoLive")
                player.stopVideo();
                player.loadVideoById( res.data.video_id );
            }
        }
        else{
            console.log("Live Video is Alredy Playing")
        }
    }   
    else{
        console.log("Live Video is Alredy Playing")
    }


}

// This function calls an SMK api to check the current live video on youtube
function liveVideoAPI() {
    return new Promise((resolve, reject) => {

        fetch("https://cms.swaminarayanbhagwan.org/wp-json/sb/v1/video/live")
            .then(response => response.json())
            .then(data => {
                resolve(data);
            })
            .catch(error => {
                reject(error);
            });
    });
}

// function to call Sheet APIs 
function callAPI( functionName ) {
    return new Promise((resolve, reject) => {

        fetch( apiUrl + functionName )
            .then(response => response.json())
            .then(data => {
                resolve(data);
            })
            .catch(error => {
                reject(error);
            });
    });
}

//-------- this function will check video is playing or not every 5 seconds ----------
async function checkVideoPlaying(){

    var res = await callAPI("getRefreshValue")
    console.log("get refresh value -- ")
    console.log(res)
    if( res.data.refreshValue ){
        await callAPI("setRefreshValue")
        console.log("set refresh value to false")
        setTimeout(()=>{
            location.reload(true);
        }, 2000);
    }
    else if(player.getVideoData().isLive ){

        // clearTimeout(endEarlyTimeOut) 
        endEarlyTimeOut = null
        subMasterTimeOut = null

        console.log("Live video is playing")


        // var isPlayable = player.getVideoData()["backgroundable"];
        console.log( JSON.stringify( player.getVideoLoadedFraction() ) )
        if( JSON.stringify( player.getVideoLoadedFraction()) == "0"){

            checkVideoCount += 1;
            console.log("Video is not playing right now current count is --> "+ checkVideoCount)
        }
        if( checkVideoCount >= 3 ){

            checkVideoCount = 0
            console.log("not playing any video  -------- video unavailable")

            let res = await callAPI("getNextVideo")
            controls.youtubeId = res.data.youtubeId
            player.loadVideoById( controls.youtubeId );
            
        }

    }

}

async function setVideoTitle ( videoTitle ) {

    let body = {
        "videoTitle": videoTitle
    }
    var raw = JSON.stringify(body);
    var requestOptions = {
        method: 'POST',
        body: raw,
        redirect: 'follow'
    };

    await fetch( apiUrl +"setVideoTitle", requestOptions)
    .then(response => response.text())
    .then(result => {
        console.log(result)
    })   
    .catch(error => {
        console.log('error', error)
    });

}
