/* Find the trailing item in each row, add a new class.
 * The trailing item in Breadcrumb will take up the spaces until the row end
 * So it won't leave an ugly blank space.
 *
 * This solution also benefits from the stable widths of items, otherwise the everchanging widths 
 * distracts the user when clicking folder links.
 */
function addTopBreadcrumbTralingItems() {
    const elements = document.querySelectorAll("#TopBreadcrumb li")
    let largestDistance = -1
    let lastElement;
    
    Array.from(elements).reduce(
        (acc, current) => {
            if (current.offsetLeft <= largestDistance) {
                lastElement && acc.push(lastElement)
            }
            largestDistance = current.offsetLeft
            lastElement = current
            return acc
        }, []
    ).forEach(e => {
        e.classList.add("row-trailing-item")
    })
}