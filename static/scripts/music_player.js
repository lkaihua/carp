!(function() {
    const $ = (path) => document.querySelector(path)
    const $a = (path) => document.querySelectorAll(path)

    const musicPlayerInit = () => {

        const playlistTracks = $a('#MusicPlaylist li a')
        const playItems = $a('a.music-play-item')

        // if playlist is not empty then we only load songs from it
        const tracks = (playlistTracks.length > 0 && playlistTracks) || (playItems.length > 0 && playItems)
        if (!tracks) {
            return
        }

        let prev = -1
        let current = -1
        let isPlaying = false
        let autoStartStatus = tracks[0] && tracks[0].getAttribute("data-auto-start") // todo: get the first item with auto start attribute
        let autoStartClock
        let errorTrackCount = 0

        const board = $(".board")
        const audio = $('#MusicPlayerAudio')
        const playerCurrentTrack = $('#PlayerCurrentTrack')
        const playerStatus = $('#PlayerStatus')
        const musicPlayerController = $("#MusicPlayerController")


        const runTrack = (link) => {
            if (!link) {
                return
            }

            // When lots of track errors occur, stop running. Maybe the page requires refresh.
            if (errorTrackCount >= 2 * tracks.length) {
                return
            }

            // Allow the user to click a track that is currently playing to force a play action
            if (link && link.getAttribute("data-playing") == "true") {
                try {
                    if (audio.src) audio.play()
                } catch (e) {
                    console.debug('[runTrack] audio play has error', e)
                }
                return
            }

            // Updating <audio> `src` will eat events. `audio.pause()` won't fire a successful `pause` event. trigger animation manually.
            isPlaying = true
            vinylSpinChange()
            tonearmChange()

            const musicUrl = link.getAttribute("data-music-url")
            if (musicUrl) {
                try {
                    audio.src = musicUrl
                    audio.load()
                    audio.play()
                } catch (e) {
                    console.debug('[runTrack] audio play has error', e)
                }
            }
        }

        const runNextTrack = function(e) {
            prev = current
            current++
            if (current == tracks.length) {
                current = 0
            }
            runTrack(tracks[current])
        }

        /**
         * Bind click to each track link.
         */
        tracks.forEach((link, i) => link.addEventListener("click", function(e) {
            e.preventDefault()
            prev = current
            current = i
            runTrack(tracks[current])
        }))

        /**
         * Bind click to player controller. When no track is loaded, play the first track.
         */
        const playerControllerOnClick = (e) => {
            if (current < 0) {
                runNextTrack();
                musicPlayerController.removeEventListener("click", playerControllerOnClick)
            }
        }
        musicPlayerController.addEventListener("click", playerControllerOnClick)

        /**
         * init VinylRecordPlayer
         */
        board.addEventListener("click", (e) => {
            // if no item, play the first one
            if (current < 0) {
                runNextTrack()
            } else {
                if (isPlaying) {
                    audio.pause()
                } else {
                    audio.play()
                }
            }
        })

        /**
         * The Arm animation
         */
        const tonearmChange = () => {
            if (isPlaying) {
                board.setAttribute("data-tonearm-on", "true")
            } else {
                board.removeAttribute("data-tonearm-on")
            }
        }

        /**
         * The vinyl record starts spinning, after the tonearm has been put on the record.
         * It stops spinning exactly when the tonearm put off. 
         */
        const vinylSpinChange = () => {
            setTimeout(() => {
                if (isPlaying) {
                    board.removeAttribute("data-paused") // Use `data-` attribute to freeze CSS animation
                } else {
                    board.setAttribute("data-paused", "true")
                }
            }, isPlaying ? 300 : 0)
        }


        /**
         * Bind events and default settings
         */
        audio.volume = .50
        audio.addEventListener("canplaythrough", (e) => {
            // console.debug('Event canplaythrough')

            // When the song is loaded, move the tonearm first
            tonearmChange()
        })

        audio.addEventListener("play", (e) => {
            // console.debug('Event play')

            if (!audio.src) {
                return runNextTrack()
            }

            prev >= 0 && tracks[prev] && tracks[prev].setAttribute("data-playing", "false")
            if (current >= 0 && tracks[current]) {
                tracks[current].setAttribute("data-playing", "true")
                playerCurrentTrack.textContent = tracks[current].getAttribute("data-music-name")
            }

            playerStatus.textContent = "Playing"
            isPlaying = true
            vinylSpinChange()
            tonearmChange()

            // If audio plays successfully for the first time, mark auto start as done and player controller inited.
            autoStartStatus = "done"
            $("#MusicPlayerController").setAttribute("inited", "true")
        })

        audio.addEventListener("pause", (e) => {
            // console.debug('Event pause')

            playerStatus.textContent = "Not Playing"
            isPlaying = false
            tonearmChange()
            vinylSpinChange()
        })

        audio.addEventListener('ended', runNextTrack)

        audio.addEventListener('error', (e) => {
            // console.debug('[audio error] audio play has error', e)
            playerStatus.textContent = "Unable to load this file."
            current >= 0 && tracks[current] && tracks[current].setAttribute("data-error", "true")
            errorTrackCount += 1
            runNextTrack()
        })

        // todo: use event to replace timeout loop detect
        const watchStartClock = () => {
            if (autoStartStatus == "true") {
                autoStartClock = setTimeout(() => {
                    if (autoStartStatus == "done") {
                        clearTimeout(autoStartClock)
                    } else {
                        // runTrack(tracks[0])
                        runNextTrack()
                        watchStartClock()
                    }
                }, 500)
            }
        }
        watchStartClock()
    }

    const musicPlayerBarInit = () => {
        /**
         * By setting the sticky bar minus top margin to detect intersection so that we can add more styles
         */
        const musicPlayerBar = $('#MusicPlayerBar')
        const observer = new IntersectionObserver(
            ([e]) => e.target.toggleAttribute('stuck', e.intersectionRatio < 1), { threshold: [1] }
        )
        if (musicPlayerBar && musicPlayerBar.getAttribute("data-is-sticky") == "true") {
            observer.observe(musicPlayerBar)
        }
    }

    window.addEventListener("load", (e) => {
        musicPlayerInit()
        musicPlayerBarInit()
    })

    window.musicPlayerInit = musicPlayerInit
})()