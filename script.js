let Songul = document.getElementsByClassName("song_ul")[0];
let play = document.querySelector("#play");
let prev = document.querySelector("#previous");
let next = document.querySelector("#next");
let playbar = document.querySelector(".playbar");
let currSong = new Audio();
let time = document.querySelector(".time");
let information = document.querySelector(".information")
let seekbar = document.querySelector(".seekbar");
let close = document.querySelector(".close")
let volimg = document.querySelector(".volimg")
let songs1;
let currFolder;
let count = 0;
let nextsong;
let nextid;
let previd;
let prevsong;
let hamburger = document.querySelector(".hamburger");
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getsong(folder) {
    let a = await fetch(`http://127.0.0.1:5500/${folder}`)
    currFolder = folder;
    let response = await a.text();
    // console.log(response);
    songs1 = []
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    for (let i = 0; i < as.length; i++) {
        const element = as[i];
        if (element.href.endsWith('.mp3')) {
         
            songs1.push(element.href.split(`${folder}`)[1].replace("/",""))
        }



    }
    Songul.innerHTML = "";
    // console.log(songs1);

    for (const song of songs1) {

        Songul.innerHTML = Songul.innerHTML + `<li >
        <img src="svgs/music.svg" class="invert" alt="">
        <div class="songinfo ">
        
        <div class="songname">${song.replaceAll("%20", " ")}</div>
            <span>Artist Name- Arijit Singh</span>
            
        </div>
        <div class="play ">
            <span>Play Now</span>
            <img src="svgs/play.svg" class="invert" alt="">
        </div>
    </li>`;



    }

    let songlist = document.querySelector(".song_ul").getElementsByTagName("li");



    Array.from(songlist).forEach(element => {


        element.addEventListener("click", () => {


            playmusic(element.querySelector(".songinfo").firstElementChild.innerHTML.trim())
            // console.log(element.querySelector(".songinfo").firstElementChild.innerHTML.trim());




        })

    });




    return songs1;



}
function playmusic(songname) {
    
    play.src = "svgs/pause.svg"
    playbar.style.backgroundColor = "green";
    currSong.src = `${currFolder}` +"/"+ songname
    console.log("song name is ",currSong.src);
    information.innerHTML = decodeURI(songname);
    // audio1.pause();
    currSong.play();


}
// Main Function---------------------------------------------------------------------------------------------------
async function main() {
    let count = 0;

    await getsong("songs/Easy_songs")



    // Time Update
    currSong.addEventListener("timeupdate", () => {
        time.innerHTML = `${secondsToMinutesSeconds(currSong.currentTime)}/${secondsToMinutesSeconds(currSong.duration)}`


        document.querySelector(".circle").style.left = (currSong.currentTime / currSong.duration) * 100 + "%"
        if (currSong.currentTime == currSong.duration) {
            nextid = ++id;
            nextid = Number(nextid);
            if (nextid < count) {
                nextsong = songs1[`${nextid}`]
                {
                    playmusic(nextsong);
                    playbar.style.backgroundColor = "green";
                    play.src = "svgs/pause.svg"
                }
            }

            else if (nextid == count) {
                id = -1;
                playmusic(songs1[0]);
            }




        }

    })
    seekbar.addEventListener("click", (e) => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currSong.currentTime = ((currSong.duration) * percent) / 100;
    })

    // play next and previous
    play.addEventListener("click", () => {
        if (currSong.src == "") {
            id = 0;
            playbar.style.backgroundColor = "green";
            play.src = "svgs/pause.svg"
            playmusic(songs1[0]);


        }


        else if (currSong.paused) {

            currSong.play();
            playbar.style.backgroundColor = "green";
            play.src = "svgs/pause.svg"

        }
        else {
            currSong.pause();
            playbar.style.backgroundColor = "red";
            play.src = "svgs/play.svg"

        }
    })

    next.addEventListener("click", () => {
        currSong.pause();

        //  console.log(currSong.src.split("/").slice(-2)[1]);



        let index = songs1.indexOf(`${currSong.src.split("/").slice(-2)[1]}`)



        if ((index + 1) < songs1.length) {
            playmusic(songs1[index + 1])
        }
        else if (index == songs1.length - 1) {
            playmusic(songs1[0]);
        }
    })
    prev.addEventListener("click",()=>{
        currSong.pause();
        let index = songs1.indexOf(`${currSong.src.split("/").slice(-2)[1]}`)
        if(index>0)
        {
            playmusic(songs1[index-1])
        }
        else playmusic(songs1[songs1.length-1])
        
    })
    // For Responsiveness

    hamburger.addEventListener("click", () => {
        document.querySelector(".right").classList.add("hidden")
        document.querySelector(".left").style.left = 0;


    })

    close.addEventListener("click", () => {
        document.querySelector(".left").style.left = "-100%"
        document.querySelector(".right").classList.remove("hidden")


    })
    // Volume
    document.querySelector("#volrange").addEventListener("change", (e) => {
        currSong.volume = e.target.value / 100;
        if (e.target.value > 50) {
            volimg.innerHTML = `<img src="svgs/volume.svg" alt="" />`
        }
        else if (e.target.value < 2) {
            volimg.innerHTML = `<img src="svgs/mute.svg" alt="" />`
        }
        else volimg.innerHTML = `<img src="svgs/volumelow.svg" alt="" />`


    })
    // load data

    Array.from(document.getElementsByClassName("card")).forEach(card => {

        card.addEventListener("click", async (e) => {

            songs1 = await getsong(`songs/${e.currentTarget.dataset.folder}/`)


        })
    });


}



main();

