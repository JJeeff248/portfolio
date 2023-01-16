function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function setup() {
    let gallery = document.getElementById("gallery");
    getVal(gallery, "grid-auto-rows");
    getHeight(gallery);
    resizeAll();
    gallery.querySelectorAll("img").forEach(function (item) {
        item.addEventListener("load", function () {
            let altura = getVal(gallery, "grid-auto-rows");
            let gap = getVal(gallery, "grid-row-gap");
            let gitem = item.parentElement.parentElement;
            gitem.style.gridRowEnd = "span " + Math.ceil((getHeight(gitem) + gap) / (altura + gap));
        });
        item.addEventListener("click", function () {
            item.classList.toggle("full");
        });
    });
}

let getVal = function (elem, style) {
    return parseInt(
        elem.ownerDocument.defaultView
            .getComputedStyle(elem)
            .getPropertyValue(style)
    );
};

let getHeight = function (item) {
    return item.querySelector(".gallery-image").getBoundingClientRect().height;
};

let resizeAll = function () {
    let altura = getVal(gallery, "grid-auto-rows");
    let gap = getVal(gallery, "grid-row-gap");
    gallery.querySelectorAll(".gallery-item").forEach(function (item) {
        let el = item;
        el.style.gridRowEnd =
            "span " + Math.ceil((getHeight(item) + gap) / (altura + gap));
    });
};

window.addEventListener("resize", resizeAll);
