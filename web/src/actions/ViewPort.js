let intersectionObserver;


function ensureObserver() {
    if (intersectionObserver) return;
    intersectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            const eventName = entry.isIntersecting ? "enterViewport" : "exitViewport";
            entry.target.dispatchEvent(new CustomEvent(eventName));
        })
    });
}


export default function viewport(element) {
    ensureObserver()
    intersectionObserver.observe(element)
    return {
        destroy() {
            intersectionObserver.unobserver(element);
        }
    }
}
