init();
function init(){
    const $ = (path) => document.querySelector(path);
    const audio = $('#MusicPlayerAudio');
    const playlist = $('#Playlist');
    const playerCurrentTrack = $('#PlayerCurrentTrack');
    var tracks = playlist.querySelectorAll('li a');
    const len = tracks.length;
    let prev = -1;
    let current = -1;
    
    const run = (link, player) => {
        // user can click the song already playing
        if (link.getAttribute("data-playing") == "true"){
            audio.play();
            return;
        }
        
        link.setAttribute("data-playing", "true")
        player.src = link.href;
        prev >= 0 && tracks[prev] && tracks[prev].setAttribute("data-playing", "false")
        playerCurrentTrack.textContent = link.getAttribute("data-song-name")
        audio.load();
        audio.play();
    }

    const playNext = function(e){
        prev = current;
        current++;
        if(current == len){
            current = 0;
        }
        run(tracks[current], audio);
    }

    audio.volume = .50;
    tracks.forEach((link, i) => link.addEventListener("click", function(e){
        e.preventDefault();
        prev = current;
        current = i
        run(link, audio);
    }));
    
    audio.addEventListener('ended',playNext);

    audio.addEventListener('error',function(e){
        // console.log("This song is not playable")
        current >= 0 && tracks[current] && tracks[current].setAttribute("data-error", "true")
        playNext(e)
    })

}