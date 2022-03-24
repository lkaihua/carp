/* Find the trailing item in each row, add a new class and update max width.
 *
 * Force the trailing pill in each row to extend to the end so it won't leave an ugly blank
 * and all items have stable width between page jumps.
 */
function initTopBreadcrumbTralingItems() {
    const elements = Array.from(document.querySelectorAll("#TopBreadcrumb li"));
    let largestDistance = -1
    let usedWidth = 0;
    let lastElement;
    let trailingItems = []
    if (elements.length == 0) {
        return;
    } else if (elements.length == 1) {
        trailingItems = [{e: elements[0], w:-1}]
    } else {
        const zero = elements[0] && elements[0].offsetLeft
        const gap = 5
    
        trailingItems = elements.reduce(
            (acc, current, index) => {

                let isLastElementTrailing = false
                if (current.offsetLeft <= largestDistance) {
                    lastElement && acc.push({e: lastElement, w: usedWidth})
                    isLastElementTrailing = true
                }
                
                if (lastElement) {
                    usedWidth = lastElement.offsetLeft + lastElement.offsetWidth - zero + gap
                    // console.debug(current, usedWidth)
                }


                largestDistance = current.offsetLeft
                lastElement = current

                // For the last item, we also take it as a trailing item
                if (index == elements.length - 1) {
                    acc.push({
                        e: current, 
                        w: isLastElementTrailing ? 0 : usedWidth
                    })
                }

                return acc
            }, []
        )

        
    }

    trailingItems.forEach(item => {
        item.e.classList.add("row-trailing-item")
        if (item.w >= 0) item.e.style.maxWidth = `calc(100% - ${item.w}px)`
    })
}