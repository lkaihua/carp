!(function() {

    const $a = (path) => document.querySelectorAll(path)

    const xButtons = Array.from($a(".btn-x"))
    const musicEntries = Array.from($a("#MusicPlaylist a.item-entry-type-music"))
    const dataSkipKey = "carp-data-skip:" + location.pathname
    const dataSkipAttr = 'data-skip'
    const dataUrlAttr = "data-music-url"

    // read skip states from local storage
    let dataSkipStorage
    try {
        const stringData = window.localStorage.getItem(dataSkipKey)
        dataSkipStorage = JSON.parse(stringData)
    } catch {}

    // alert(musicEntries.length)
    !!dataSkipStorage && musicEntries.forEach((musicEntry, i) => {

        const key = musicEntry.getAttribute(dataUrlAttr)
        if (key in dataSkipStorage) {
            const isSkip = dataSkipStorage[key]
            musicEntry.setAttribute(dataSkipAttr, isSkip)
            xButtons[i].setAttribute(dataSkipAttr, isSkip)
        }

    })

    // click to toggle data-skip boolean
    xButtons.forEach((xButton, i) => xButton.addEventListener("click", (e) => {

        const musicEntry = musicEntries[i]
        const isSkip = musicEntry.getAttribute(dataSkipAttr) == 'true' ? 'false' : 'true'
        musicEntry.setAttribute(dataSkipAttr, isSkip)
        xButton.setAttribute(dataSkipAttr, isSkip)

        // put into local storage
        let dataSkipStorage = {}
        try {
            const stringData = window.localStorage.getItem(dataSkipKey)
            dataSkipStorage = JSON.parse(stringData)
        } catch {}
        const url = musicEntry.getAttribute(dataUrlAttr)
        try {
            window.localStorage.setItem(dataSkipKey, JSON.stringify({...dataSkipStorage, [url]: isSkip }))
        } catch {}

        e.preventDefault();
        e.stopPropagation();
    }))

})()