// Make a list of python keywords
const KEYWORDS = ["and", "as", "elif", "else", "for", "if", "in", "is", "not", "or", "pass", "return", "while", "None"];
const COMMENT = ["#"];
const STRING = ["\"\"\"", "\""];
const DEF = ["class", "def"];
const BULITIN = ["print", "input"]

// Find all the pre/code tags
let pres = document.getElementsByTagName("pre");
let codes = document.getElementsByTagName("code");
setTimeout(function () {
    highlight(pres);
    highlight(codes);
}, 1);


function highlight(tags) {
    for (let pre of tags) {
        let text = pre.innerHTML;
        pre.innerHTML = "";
        for (let line of text.split("\n")) {
            if (pre.className !== "output") {
                let addedComment = false;
                let addedString = false;
                for (let def of DEF) {
                    if (line.includes(def)) {
                        line = line.replace(new RegExp("\\b"+def+"\\b"), "<span class='def'>" + def + "</span>");
                    }
                }
                for (let comment of COMMENT) {
                    if (line.includes(comment)) {
                        addedComment = true;
                        let first = line.indexOf(comment);
                        let last = line.length;
                        comment = line.substring(first, last);
                        line = line.replace(comment, "<span class='comment'>" + comment + "</span>");
                    }
                }
                for (let string of STRING) {
                    if (line.includes(string)) {
                        addedString = true;
                        let first = line.indexOf(string);
                        let last = line.lastIndexOf(string);
                        let stringText = line.substring(first, last + 1);
                        line = line.replace(stringText, "<span class='string'>" + stringText + "</span>");
                    }
                }
                for (let keyword of KEYWORDS) {
                    if (line.includes(keyword) && !((addedComment && line.indexOf(keyword) > line.indexOf("#")) || (addedString && line.indexOf(keyword) > line.indexOf("\"")))) {
                            line = line.replace(new RegExp("\\b"+keyword+"\\b"), "<span class='keyword'>" + keyword + "</span>");
                        }
                    }
                for (let bulitin of BULITIN) {
                    if (line.includes(bulitin) && !((addedComment && line.indexOf(bulitin) > line.indexOf("#")) || (addedString && line.indexOf(bulitin) > line.indexOf("\"")))) {
                        line = line.replace(bulitin, "<span class='bulitin'>" + bulitin + "</span>");
                    }
                }
            } else if (pre.className === "output") {
                line = "<span class='def'>" + line + "</span>";
            }
            pre.innerHTML += line + "\n";
        }
    pre.innerHTML = pre.innerHTML.substring(0, pre.innerHTML.length - 1);
    }
}

