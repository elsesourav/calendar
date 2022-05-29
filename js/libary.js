//---------------- lab ---------------------
function hover(element) {
    const addHover = () => {
        element.classList.add("hover");
    }
    const removeHover = () => {
        element.classList.remove("hover");
    }
    element.addEventListener("touchstart", addHover);
    element.addEventListener("mouseenter", addHover);

    element.addEventListener("touchend", removeHover);
    element.addEventListener("mouseleave", removeHover);
}

function b36t10(v) {
    return parseInt(v, 36);
}
function b10t36(v) {
    return Number(v).toString(36);
}
function ran() {
    return Math.floor(Math.random() * 10);
}