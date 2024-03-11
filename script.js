let Songul=document.getElementsByClassName("song_ul")[0]
async function getsong() {
    let a = await fetch('http://127.0.0.1:5500/songs/')
    let response = await a.text();
    // console.log(response);
    let songs = []
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    for (let i = 0; i < as.length; i++) {
        const element = as[i];
        if (element.href.endsWith('.mp3')) {
            songs.push(element.href.split("/songs/")[1])
        }


    }

    return songs;



}
async function main() {
    let songs = await getsong();
    // console.log(song);
    var audio1 =  new Audio(songs[0]);
    audio1.play();
    // let duration;
    // function loaddata(){
    //     audio1.addEventListener("loadeddata",()=>{
        
    //         duration=audio1.duration;
    //         console.log(duration);
            
          
           
    //    }
    //    )
    // }
    // setInterval(loaddata(), 1000);
    // for (const song of songs) {
    //     Songul.innerHTML=Songul.innerHTML+`<li>${song.replaceAll("%20", " ")}</li>`;
       
    // }
}


// setInterval(main, 1000);
main();

