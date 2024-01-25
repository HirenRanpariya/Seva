// let environment = "UAT"
var environment = "PROD"
var apiUrl = "https://script.google.com/macros/s/AKfycbzTuLrkYlGR8yVArqWitiO483kZpgDmOoWawhsrs3kGGwQP_qPpL6Wr2ejoIfExCLbG/exec?myfunction="
if(environment == "UAT"){
    apiUrl = "https://script.google.com/macros/s/AKfycbxuPxfTXVGTfZyxucPsK0-N9PCML-zxKSBFC91xwoVk7M9MR0vWCNiaLeTs8KHK7Mw9/exec?myfunction="
}

const logapiUrl = "https://script.google.com/macros/s/AKfycbzviWk2P-gwRvEi6FC5pFZIpW_VenVH8gZ55wwR8UxhRmKkIKir60uX4L1mdRPh3h1F/exec"
const documentId = "1gT15r0CYbWEb-5L6pwa8-KcPg1QhnbrrwYJUWFVTmog"

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
    logApi(logapiUrl, documentId , "Player start." )

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
        logApi(logapiUrl, documentId ,"Video has ended ( Function OnPlayerStateChange ) : "+ controls.youtubeId )
        let res = await callAPI("getNextVideo")
        controls.youtubeId = res.data.youtubeId

        player.loadVideoById( controls.youtubeId );
    }
    else if(player?.getVideoData()?.isLive ){

        console.log(player.getVideoData().title)
        console.log("Title master = " + controls.titleMaster)
        if(controls.titleMaster){
            await setVideoTitle( player.getVideoData().title )
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
        if(controls.titleMaster){
            await setVideoTitle( player.getVideoData().title )
        }

        console.log("Video TimeOut variable value --> "+ endEarlyTimeOut)

        if(!endEarlyTimeOut){

            console.log("Timeout set for "+ controls.endEarlyInterval/1000 +" second early ")
            endEarlyTimeOut = setTimeout( videoEndEarly , player.getDuration()*1000 - controls.endEarlyInterval )
        
        }
    
    }   

    
}


async function videoEndEarly(){

    if(player?.getVideoData()?.isLive ){
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
        logApi(logapiUrl, documentId ,"Video has ended ( End Early Function ) : "+ controls.youtubeId )
        
        let res = await callAPI("getNextVideo")
        controls.youtubeId = res.data.youtubeId
        
        player.loadVideoById( controls.youtubeId );
        
    }

}

// ----------------------------- Sub master function -----------------------------
async function getSubMaster(){

    if(player?.getVideoData()?.isLive ){

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
    logApi(logapiUrl, documentId ,"SubMaster Is Playing (Function setSubMaster) : "+ controls.youtubeId )

    endEarlyTimeOut = null
    subMasterTimeOut = null

    player.stopVideo();
    player.loadVideoById( res.data.youtubeId );


}

// ---------------------- Live video check functions ------------------------
async function liveVideoCheck() {

    if(!player?.getVideoData()?.isLive){

        let res = await liveVideoAPI()

        // console.log("This is the video currently in player "+ player.getVideoData().video_id)
        // console.log("This is the live video id -- " + res.data.video_id)

        if( res.data.video_id != player.getVideoData().video_id ){

            // This returns if we should live this video or not  (if true then don't make it live)
            let isLiveTitle = skipTitleArr.some( str => res.data.title.includes(str) );
            console.log("Live video title : -- " + res.data.title + ",  \nIs Title in Skip list : -- " + isLiveTitle )

            if(!isLiveTitle){
                console.log("set Is Video Live set to false  --- ")
                logApi(logapiUrl, documentId ,"Live video will Start Playing (Function LiveVideoCheck) : "+ res.data.video_id )
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
        logApi(logapiUrl, documentId , "Player Reload." )
        setTimeout(()=>{
            location.reload(true);
        }, 2000);
    }
    // else if(player?.getVideoData()?.isLive ){

        // clearTimeout(endEarlyTimeOut) 
        // endEarlyTimeOut = null
        // subMasterTimeOut = null

        // console.log("Live video is playing")


        // var isPlayable = player.getVideoData()["backgroundable"];
        console.log(JSON.stringify(player.getVideoLoadedFraction()) + " " + "check Video count --> "+ checkVideoCount);
        if( JSON.stringify( player.getVideoLoadedFraction()) == "0"){

            checkVideoCount += 1;
            console.log("Video is not playing right now current count is --> "+ checkVideoCount)
        }
        else{
            checkVideoCount = 0
        }
        if( checkVideoCount >= 6 ){

            checkVideoCount = 0
            console.log("not playing any video  -------- video unavailable")
            logApi(logapiUrl, documentId ,"Video Not Playing (Function checkVideoPlaying) : "+ controls.youtubeId )

            let res = await callAPI("getNextVideo")
            controls.youtubeId = res.data.youtubeId
            player.loadVideoById( controls.youtubeId );
            
        }

    // }

}


function getCurrentDateTimeIST() {
    const options = {
        timeZone: 'Asia/Kolkata',  // Set the time zone to Indian Standard Time
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      };
    
      const dateTimeFormatter = new Intl.DateTimeFormat('en-IN', options);
      const formattedDateTime = dateTimeFormatter.format(new Date());
    
      return formattedDateTime;
  }

  async function logApi ( logapiUrl, documentId, newText  ) {

    // let body = {
    //     "youtubeID": youtubeID, 
    //     "Played": 1
    // }

    const body = {
        documentId: documentId,
        newText: getCurrentDateTimeIST() +" - " +  newText,
    };

    var raw = JSON.stringify(body);

    // console.log(raw)

    var requestOptions = {
        method: 'POST',
        body: raw,
        redirect: 'follow'
    };

    await fetch("https://script.google.com/macros/s/AKfycbzviWk2P-gwRvEi6FC5pFZIpW_VenVH8gZ55wwR8UxhRmKkIKir60uX4L1mdRPh3h1F/exec", requestOptions)
    .then(response => response.text())
    .then(result => {

        console.log(result)
       
    })   
    .catch(error => {

        console.log('error', error)

    });

}