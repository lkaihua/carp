/* Find the trailing item in each row, add a new class and update max width.
 *
 * Force the trailing pill in each row to extend to the end so it won't leave an ugly blank
 * and all items have stable width between page jumps.
 */
function initTopBreadcrumbTralingItems() {
    const elements = document.querySelectorAll("#TopBreadcrumb li")
    let largestDistance = -1
    let lastMaxWidth = 0;
    let lastElement;
    const zero = elements[0] && elements[0].offsetLeft
    const gap = 5

    Array.from(elements).reduce(
        (acc, current) => {
            if (current.offsetLeft <= largestDistance) {
                lastElement && acc.push([lastElement, lastMaxWidth])
            }
            
            if (lastElement) {
                lastMaxWidth = lastElement.offsetLeft + lastElement.offsetWidth - zero + gap
                console.debug(current, lastMaxWidth)
            }
            
            
            largestDistance = current.offsetLeft
            lastElement = current
            return acc
        }, []
    ).forEach(e => {
        e[0].classList.add("row-trailing-item")
        e[0].style.maxWidth = `calc(100% - ${e[1]}px)`
    })
}