!(function(){
    const $ = (path) => document.querySelector(path);
    const board = $(".board");
    const audio = $('#MusicPlayerAudio');
    const playlist = $('#MusicPlaylist');
    const playerCurrentTrack = $('#PlayerCurrentTrack');
    const playerStatus = $('#PlayerStatus');

    if (!playlist) {
        return;
    }

    const tracks = playlist.querySelectorAll('li a');
    const len = tracks.length;
    
    let prev = -1;
    let current = -1;
    let isPaused = true;

    const initPlayController = () => {
        $("#MusicPlayerController").setAttribute("inited", true)
    }

    const runTrack = (link) => {
        // user can click the song already playing
        if (link.getAttribute("data-playing") == "true"){
            audio.play();
            return;
        }
        
        // Updating <audio> `src` will eat event.
        // `audio.pause()` won't fire a successful `pause` event so do it manually
        isPaused = true
        vinylSpinChange()
        vinylArmChange()

        link.setAttribute("data-playing", "true")
        audio.src = link.href;
        prev >= 0 && tracks[prev] && tracks[prev].setAttribute("data-playing", "false")
        playerCurrentTrack.textContent = link.getAttribute("data-song-name")

        audio.load();
        audio.play();
    }

    const runNextTrack = function(e){
        prev = current;
        current++;
        if(current == len){
            current = 0;
        }
        runTrack(tracks[current]);
    }

    tracks.forEach((link, i) => link.addEventListener("click", function(e){
        e.preventDefault();
        prev = current;
        current = i
        runTrack(link);
    }));
    
    /**
     * init VinylRecordPlayer
     */ 
    board.addEventListener("click", (e) => {
        // if no item, play the first one
        if (current < 0) {
            runNextTrack()
        }
        else {
            // if on pause, resume it; if on play, pause it.
            if (isPaused) {
                audio.play()
            } else {
                audio.pause()
            }
        }
    });

    /**
     * init Audio Tag
     */
    $("#MusicPlayerController").addEventListener("click", (e) => {
        if (current < 0) { 
            runNextTrack();
        }
    })

    /**
     * The Arm animation
     */
    const vinylArmChange = () => {
        if (isPaused) {
            board.removeAttribute("data-tonearm-on");
        }
        else {
            board.setAttribute("data-tonearm-on", "");
        }
    }

    /**
     * The Spin turns on after 0.3s against the Arm turns on
     * and off exactly when the Arm turns off. 
     */
    const vinylSpinChange = () => {
        const delay = isPaused ? 0 : 300;
        setTimeout(() => {
            if (isPaused) {
                board.setAttribute("data-paused", "");
            }
            else {
                board.removeAttribute("data-paused");
            }
        }, delay);
    }
     

    /**
     * Bind events and default settings
     */
    audio.volume = .50;
    audio.addEventListener("canplaythrough", (e) => {
        // console.debug('Event canplaythrough');
        // When the song is loaded, move the arm first while the vinyl recond is not rotating
        vinylArmChange()
    });
    audio.addEventListener("play", (e) => {
        // console.debug('Event play');
        playerStatus.textContent = "Playing"
        if (!audio.src) {
            runNextTrack()
        }
        isPaused = false;
        vinylSpinChange();
        vinylArmChange()
        initPlayController();
        
    });
    audio.addEventListener("pause", (e) => {
        // console.debug('Event pause');
        playerStatus.textContent = "On Pause"
        isPaused = true;
        vinylArmChange();
        vinylSpinChange();
    });
    audio.addEventListener('ended', runNextTrack);
    audio.addEventListener('error', (e) => {
        // console.debug("This song is not playable")
        playerStatus.textContent = "Unable to load this file"
        current >= 0 && tracks[current] && tracks[current].setAttribute("data-error", "true")
        runNextTrack()
    })


    /**
     * By setting the sticky bar minus top margin to detect intersection so that we can add more styles
     */
    const observer = new IntersectionObserver( 
        ([e]) => e.target.toggleAttribute('stuck', e.intersectionRatio < 1),
        {threshold: [1]}
    );
    observer.observe($('#MusicPlayerBar')); 
})();