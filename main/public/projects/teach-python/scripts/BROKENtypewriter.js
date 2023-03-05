class Typewriter {
    constructor(el, options) {
        this.el = el;
        this.options = options;
        this.toType = options.toType.substring(3, options.toType.length - 3);
        this.delay = 50;
        this.timeout = options.timeout;
    }

    type(str) {
        this.el.innerHTML = "<span>" + str + "</span>";
        console.log(this.el.innerHTML);
    }

    step() {
        let i = this.current.length;
        if (i < this.toType.length) {
            this.current = this.toType.substring(0, i + 1);
        } else {
            this.current = this.toType.substring(0, i - 1);
        }
    }

    start() {
        this.current = "";
        setTimeout(() => {
            this.type(this.current);
            this.step();
        }, this.delay);
    }
}

window.onload = function () {
    let elements = document.getElementsByClassName("typewrite");
    for (let elem of elements) {
        let toType = elem.getAttribute("data-type");
        let timeout = elem.getAttribute("data-timeout");
        if (toType) {
            (new Typewriter(elem, {
                timeout: timeout ? parseInt(timeout) : 2000,
                toType: toType,
            })).start();
        }
    }

    // INJECT CSS
    let css = document.createElement("style");
    css.setAttribute("type", "text/css");
    css.innerHTML = ".typewrite > .wrap { border-right: 0.08em solid #000}";
    document.body.appendChild(css);
};