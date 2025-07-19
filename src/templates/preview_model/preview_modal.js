!(function() {
    const $ = (path) => document.querySelector(path)
    const $a = (path) => document.querySelectorAll(path)
    const videojs = window.videojs
    const previewModal = $('#PreviewModal')
    const previewModelPreviewVideo = previewModal.querySelector('#ModelPreviewVideoContainer').innerHTML

    previewModal.addEventListener('show.bs.modal', function(event) {
        // Init video js
        // Add back <video> element since videojs.dispose() will remove it
        if (!previewModal.querySelector('#ModalPreviewVideo')) {
            previewModal.querySelector('#ModelPreviewVideoContainer').innerHTML = previewModelPreviewVideo
        }
        previewModal.videoPlayer = previewModal.videoPlayer || videojs('ModalPreviewVideo', {})
        // console.log('previewModal.videoPlayer', previewModal.videoPlayer)

        // Button that triggered the modal
        const button = event.relatedTarget

        // Extract info from data-bs-* attributes
        const urlString = button.getAttribute('data-bs-url-string')
        const name = button.getAttribute('data-bs-name')
        const lastName = button.getAttribute('data-bs-lastName').toLowerCase()
        const entryType = button.getAttribute('data-bs-entry-type')

        // Find prev and next button
        const previewTriggerButtons = Array.from($a('.btn-preview'))
        const buttonIndex = previewTriggerButtons.indexOf(button)
        const [prevButton, nextButton] = [previewTriggerButtons[buttonIndex - 1], previewTriggerButtons[buttonIndex + 1]]

        // const modalPreviewVideo = $('#ModalPreviewVideo')
        const modalPreviewAudio = $('#ModalPreviewMusic audio')
        const modalPreviewImage = $('#ModalPreviewImage')
        const modalPrevButton = $('#ModalButtonPrev')
        const modalNextButton = $('#ModalButtonNext')

        modalPrevButton.onclick = (e) => {
            prevButton && prevButton.click()
            modalPrevButton.setAttribute("data-active", "true")
            setTimeout(() => {
                modalPrevButton.setAttribute("data-active", "false")
            }, 250)
            e.preventDefault()
        }
        modalNextButton.onclick = (e) => {
            nextButton && nextButton.click()
            modalNextButton.setAttribute("data-active", "true")
            setTimeout(() => {
                modalNextButton.setAttribute("data-active", "false")
            }, 250)
            e.preventDefault()
        }


        const modalTitle = previewModal.querySelector('.modal-title')
        modalTitle.textContent = name

        // TODO: hide the file description toast
        //
        // const modalPreviewDefault = $('#ModalPreviewDefault')
        // const attrs = [lastName, name, entryType, urlString]
        // attrs.forEach(attr => {
        //     const newNode = document.createElement('li')
        //     newNode.classList.add("list-group-item")
        //     newNode.textContent = attr
        //     modalPreviewDefault.appendChild(newNode)
        // })

        switch (entryType) {
            case 'image':
                const img = new Image()
                img.onload = function() {
                    $("#ModalPreviewImageSize").textContent = this.naturalWidth + ' x ' + this.naturalHeight;
                }
                img.src = urlString
                img.classList.add("checker-background")
                modalPreviewImage.appendChild(img)

                previewModal.querySelector(".image-container").classList.remove('hidden')
                break
            case 'video':
                previewModal.videoPlayer.src({ src: urlString, type: 'video/mp4' })
                previewModal.videoPlayer.ready(function(){
                    // previewModal.videoPlayer.play()
                    previewModal.videoPlayer.currentTime(3);
                    previewModal.videoPlayer.pause()
                })
                
                previewModal.querySelector(".video-container").classList.remove('hidden')
                break
            case 'music':
                const playItem = previewModal.querySelector('#ModalPreviewMusicPlayItem')
                playItem.setAttribute("data-music-name", name)
                playItem.setAttribute("data-music-url", urlString)
                playItem.setAttribute("data-playing", false)
                playItem.setAttribute("data-auto-start", true)

                window.musicPlayerInit && window.musicPlayerInit()
                previewModal.querySelector(".music-container").classList.remove('hidden')
                break

            case 'default':
            default:
                break
        }
    })

    // To disable double-tap on <Video> on iOS. This is ugly but useful.
    // previewModal.addEventListener("click", () => {}); // does not work

    previewModal.addEventListener('hide.bs.modal', function(event) {
        previewModal.querySelectorAll('.preview-content-container').forEach(c => c.classList.add('hidden'))

        // This is relevant to use cases such as displaying a player in a modal/overlay. 
        // Rather than keeping a hidden Video.js player in a DOM element, 
        // it's recommended that you create the player when the modal opens and dispose it when the modal closes.
        // https://videojs.com/guides/player-workflows/#checking-if-a-player-is-disposed
        if (previewModal.videoPlayer && !previewModal.videoPlayer.isDisposed()) {
            previewModal.videoPlayer.dispose()
            previewModal.videoPlayer = null
        }

        $('#ModalPreviewMusic audio').pause()
        $('#ModalPreviewMusic audio').src = ''

        $('#ModalPreviewMusicPlayItem').setAttribute('data-playing', 'false')
        $('#ModalPreviewMusicPlayItem').removeAttribute('data-music-url')

        $('#ModalPreviewImage').innerHTML = ''

        // $('#ModalPreviewDefault').innerHTML = ''
    })
})()