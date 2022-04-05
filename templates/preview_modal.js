!(function() {
    const $ = (path) => document.querySelector(path)
    const $a = (path) => document.querySelectorAll(path);
    const previewModal = $('#PreviewModal')
    previewModal.addEventListener('hide.bs.modal', function(event) {
        previewModal.querySelectorAll('.preview-content-container').forEach(c => c.classList.add('hidden'));

        $('#ModalPreviewVideo').pause()
        $('#ModalPreviewVideo source').src = ''

        $('#ModalPreviewMusic audio').pause()
        $('#ModalPreviewMusic audio').src = ''

        $('#ModalPreviewMusicPlayItem').setAttribute('data-playing', 'false')
        $('#ModalPreviewMusicPlayItem').removeAttribute('data-music-url')

        $('#ModalPreviewImage').src = ''

        $('#ModalPreviewDefault').innerHTML = ''
    })

    previewModal.addEventListener('show.bs.modal', function(event) {
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

        const modalPreviewVideo = $('#ModalPreviewVideo')
        const modalPreviewAudio = $('#ModalPreviewMusic audio')
        const modalPrevButton = $('#ModalButtonPrev')
        const modalNextButton = $('#ModalButtonNext')

        modalPrevButton.onclick = (e) => {
            prevButton && prevButton.click();
            modalPrevButton.setAttribute("data-active", "true")
            setTimeout(() => {
                modalPrevButton.setAttribute("data-active", "false")
            }, 250)
            e.preventDefault();
        }
        modalNextButton.onclick = (e) => {
            nextButton && nextButton.click();
            modalNextButton.setAttribute("data-active", "true")
            setTimeout(() => {
                modalNextButton.setAttribute("data-active", "false")
            }, 250)
            e.preventDefault();
        }


        const modalTitle = previewModal.querySelector('.modal-title')
        modalTitle.textContent = name

        const modalPreviewDefault = $('#ModalPreviewDefault')
        const attrs = [lastName, name, entryType, urlString]
        attrs.forEach(attr => {
            const newNode = document.createElement('li')
            newNode.classList.add("list-group-item")
            newNode.textContent = attr
            modalPreviewDefault.appendChild(newNode)
        })

        switch (entryType) {
            case 'image':
                previewModal.querySelector('#ModalPreviewImage').src = urlString
                previewModal.querySelector(".image-container").classList.remove('hidden')
                break;
            case 'video':
                modalPreviewVideo.querySelector('source').setAttribute('src', urlString + '#t=0.1')
                modalPreviewVideo.load()
                previewModal.querySelector(".video-container").classList.remove('hidden')
                break;
            case 'music':
                const playItem = previewModal.querySelector('#ModalPreviewMusicPlayItem')
                playItem.setAttribute("data-music-name", name)
                playItem.setAttribute("data-music-url", urlString)
                playItem.setAttribute("data-playing", false)
                playItem.setAttribute("data-auto-start", true)

                window.musicPlayerInit && window.musicPlayerInit()
                previewModal.querySelector(".music-container").classList.remove('hidden')
            case 'default':
            default:
                break;
        }
    })
})();