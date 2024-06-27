console.log("lets start js");
let currentsong = new Audio();
let songs;
let currFolder;
let port_val = window.location.port;

async function  getSongs(folder){
    // song list promise
    currFolder = folder;
    let response = await fetch(`http://127.0.0.1:${port_val}/spotify_clone/songs/${folder}/`);
    let data = await response.text();
    let div = document.createElement("div");
    div.innerHTML = data;
    let as = div.getElementsByTagName("a");
    // get songlist
    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split(`/${currFolder}/`)[1]);
        }
    }

    let songUl = document.querySelector(".song_list").getElementsByTagName("ul")[0];
    // inserting into  playlist
    songUl.innerHTML = "";
    for (const song of songs) {
        songUl.innerHTML = songUl.innerHTML + `<li><img src="playlist_music.svg" alt="">
            <div class="info">
              <div>${song.replaceAll("%20"," ")}</div> 
            </div>
            <div class="play_now">
              <img src="logos/play.svg" alt="">
            </div>
          </li>`;
    }

    Array.from(document.querySelector(".song_list").getElementsByTagName("li")).forEach((e)=>{
        // attach a eventlistner to each song
        e.addEventListener("click",()=>{
            playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })
    
   
}

const playmusic = (song)=>{
    currentsong.src=`/spotify_clone/songs/${currFolder}/` + song;
    currentsong.play();
    play.getElementsByTagName("button")[0].getElementsByTagName("img")[0].src = "logos/pause.svg";

    document.querySelector(".song_info").innerHTML = `${song.replaceAll("%20","").split(".")[0]}`;
    
}

async function displayAlbums(){
    let response = await fetch(`http://127.0.0.1:${port_val}/spotify_clone/songs/`);
    let data = await response.text();
    let div = document.createElement("div");
    div.innerHTML =  data;
    let cardContainer = document.querySelector(".card_container");

    let anchors  = div.getElementsByTagName("a");
    let arr = Array.from(anchors);

    for (let index = 0; index < arr.length; index++) {
        const e = arr[index];
        if(e.href.includes("/songs")){
            if(!e.href.endsWith("/songs")){
               let folder = (e.href.split("/").slice(-1)[0]);
               let response = await fetch(`http://127.0.0.1:${port_val}/spotify_clone/songs/${folder}/info.json`);
               let data = await response.json();
               cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card card-color">
                <div class="play"><img src="logos/play.svg" alt=""></div>
                <img src="/spotify_clone/songs/${folder}/cover.jpg">
                <div class="name flex justify-center">
                  <h2>${data["title"]}</h2>
                </div>
                <div class="details flex justify-center">
                  <p>${data["description"]}</p>
                </div>
              </div>`
            }
           }
    }

    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click",async (items)=>{
            let folder_name = items.currentTarget.dataset["folder"];
            await getSongs(folder_name);
        })
    })

   
}

async function main(){
    
   //display all albums
   displayAlbums();
    


    play.addEventListener("click",()=>{
        if(currentsong.paused){
            currentsong.play();
            play.getElementsByTagName("button")[0].getElementsByTagName("img")[0].src = "logos/pause.svg";
            
        }
        else{
            currentsong.pause();
            play.getElementsByTagName("button")[0].getElementsByTagName("img")[0].src = "logos/play.svg";
        }
    })

    // time update
    currentsong.addEventListener("timeupdate",  ()=>{
        
         let curr_min = Math.floor(currentsong.currentTime/60);
         let curr_sec = Math.floor(currentsong.currentTime - (curr_min*60));

         let tot_min = Math.floor(currentsong.duration/60);
         let tot_sec = Math.floor(currentsong.duration - (tot_min*60));
        document.querySelector(".song_time").innerHTML = `${curr_min}:${curr_sec}/${tot_min}:${tot_sec}`;

        document.querySelector(".circle").style.left = ((currentsong.currentTime/currentsong.duration)*100) + "%";

        // auto play part
        if(currentsong.currentTime==currentsong.duration){
            let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);

            if(index == songs.length - 1){
                playmusic(songs[0]);
            }
            else{
                playmusic(songs[index+1]);
            } 
        }
    })

    //seekbar event
    document.querySelector(".seekbar").addEventListener("click",(e)=>{   
        let percent = ((e.offsetX/e.target.getBoundingClientRect().width)*100);
        document.querySelector(".circle").style.left = percent + "%";
        currentsong.currentTime = (currentsong.duration * percent)/100;
    })

    previous.addEventListener("click",()=>{
        if(currentsong.currentTime >= ((currentsong.duration)*5)/100){
            currentsong.currentTime = 0;
        }
        else{
            console.log(currentsong.src.split("/").slice(-1)[0]);
            let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);

            if(index == 0){
            playmusic(songs[songs.length-1]);
            }
             else{
            playmusic(songs[index-1]);
            }
        }
    })


    next.addEventListener("click",()=>{
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);

        if(index == songs.length - 1){
            playmusic(songs[0]);
        }
        else{
            playmusic(songs[index+1]);
        } 
    })

   
    // volume change
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        currentsong.volume = parseInt(e.target.value)/100;
        document.querySelector(".vol_value").getElementsByTagName("p")[0].innerHTML = `${e.target.value}/100`;
        
    })

    document.getElementsByClassName("volume")[0].firstElementChild.addEventListener("click",(e)=>{
      
       if(e.target.src.split("/").slice(-1)[0] == "volume.svg"){
            e.target.src = "logos/mute.svg";
            currentsong.volume = 0/100;
            document.querySelector(".range").firstElementChild.value = 0;
            document.querySelector(".range").getElementsByTagName("p")[0].innerHTML = "0/100";
       }
       else if(e.target.src.split("/").slice(-1)[0] == "mute.svg"){
           e.target.src = "logos/volume.svg";
           currentsong.volume = 100/100;
           document.querySelector(".range").firstElementChild.value = 100;
           document.querySelector(".range").getElementsByTagName("p")[0].innerHTML = "100/100";

       }

        
    })
}
 
main();

