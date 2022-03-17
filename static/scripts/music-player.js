var audio;
var playlist;
var tracks;
var current;

init();
function init(){
    var $ = (path) => document.querySelector(path);
    current = 0;
    audio = $('#MusicPlayerAudio');
    playlist = $('#playlist');
    tracks = playlist.querySelectorAll('li a');
    len = tracks.length;
    audio.volume = .50;
    // const songs = Array.from(playlist.querySelectorAll('a'))
    tracks.forEach((link, i) => link.addEventListener("click", function(e){
        e.preventDefault();
        // console.log(a)
        //current = link.parent().index();
        current = i
        run(link, audio);
    }));
    const playNext = function(e){
        current++;
        if(current == len){
            current = 0;
        }
        run(tracks[current],audio);
    }
    audio.addEventListener('ended',playNext);
    audio.addEventListener('error',function(e){
        console.log("This song is not playable")
        playNext(e)
    })
    run(tracks[0], audio)
}

function run(link, player){
        player.src = link.href;
        // par = link.parent();
        // par.addClass('active').siblings().removeClass('active');
        audio.load();
        audio.play();
}