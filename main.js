let canvas = document.querySelector("#canvas");

let context = canvas.getContext("2d");

let root = document.querySelector("html");

let nodes = []
let selectedObject;

makeBackground();

document.getElementById('btn-download').addEventListener("click", function (e) {
    let dataURL = canvas.toDataURL("image/jpeg", 1.0);
    downloadImage(dataURL, 'my-canvas.jpeg');
});

function downloadImage(data, filename = 'canvas.jpeg') {
    var a = document.createElement('a');
    a.href = data;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
}

function makeBackground() {
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
}


// context.stroke();

canvas.addEventListener("click", e => {
    //For plus and minus operation
    for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].containsCoordsShow(e.offsetX, e.offsetY)) {
            nodes[i].viewChildren = !nodes[i].viewChildren;
            if (!nodes[i].viewChildren) {
                hideChildren(nodes[i]);
            }
            redrawTree();
            break;
        } else if (nodes[i].containsCoordsAttr(e.offsetX, e.offsetY)) {
            showAttributes(nodes[i]);
            break;
        }

    }
})

canvas.addEventListener("mousedown", e => {
    //For plus and minus operation
    for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].containsCoordsContent(e.offsetX, e.offsetY)) {
            selectedObject = nodes[i];
            break;
        }

    }
})

canvas.addEventListener("mousemove", e => {
    if (!selectedObject) {
        for (let i = 0; i < nodes.length; i++) {
            if (nodes[i].containsCoordsContent(e.offsetX, e.offsetY)) {
                showContent(nodes[i]);
                break;
            } else {
                hideContent();
            }
        }
    } else {
        selectedObject.x = e.offsetX;
        redrawTree();
        hideContent();
    }


})

canvas.addEventListener("mouseup", e => {
    selectedObject = null;
})

canvas.addEventListener("dblclick", e => {
    for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].containsCoordsContent(e.offsetX, e.offsetY)) {
            let tag = prompt("Enter tag name to create");
            if (tag == null) {
                alert("Tag value cannot be null")
                break;
            } else if (tag.trim().length == 0) {
                alert("Tag value cannot be empty")
            } else {
                nodes[i].element.appendChild(document.createElement(tag.trim()));
                alert("Child made at tag: "+ nodes[i].element + " Tag is: " + tag)
                nodes = [];
                remakeTree();
                break;
            }
        }
    }
})

function remakeTree(){
    clear();
    makeBackground()
    makeTree(root, 0, 1800, 42);
}

function redrawTree() {
    clear();
    makeBackground()
    for (let i = 0; i < nodes.length; i++) {
        drawCircle(nodes[i], nodes[i].x, nodes[i].y);
        nodes[i].drawText();
    }
    drawLines();
    drawRects();
}
function drawLines() {
    for (let i = 1; i < nodes.length; i++) {
        if (nodes[i].parent.viewChildren) {
            context.moveTo(nodes[i].x, nodes[i].headY);
            context.lineTo(nodes[i].parent.x, nodes[i].parent.tailY);
        }

    }
    context.stroke();
}

function drawRects() {

    for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].parent) {
            if (nodes[i].parent.viewChildren) {
                if (nodes[i].element.hasAttributes()) {
                    context.beginPath();
                    context.rect(nodes[i].x - 50, nodes[i].y - 5, 25, 10);
                    context.font = "12px Arial";
                    context.fillStyle = "transparent";
                    context.strokeText(". . .", nodes[i].x - 48, nodes[i].y);
                    context.stroke();
                    context.closePath();
                }
            }


        } else {
            if (nodes[i].element.hasAttributes()) {
                context.beginPath();
                context.rect(nodes[i].x - 50, nodes[i].y - 5, 25, 10);
                context.font = "12px Arial";
                context.fillStyle = "transparent";
                context.strokeText(". . .", nodes[i].x - 48, nodes[i].y);
                context.stroke();
                context.closePath();
            }
        }

    }
};

function clear() {
    context.beginPath()
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
}

function drawCircle(node, x, y) {
    context.beginPath();
    if (node.parent == null) {

        context.beginPath();
        context.arc(x, y, 20, 0, Math.PI * 2);
        context.font = "9px Arial";
        context.fillStyle = 'black';
        context.fillText(node.element.tagName, x - 18, y + 2, 100);
        if (node.element.children.length > 0) {
            if (node.viewChildren) {
                context.font = "bold 14px Arial";
                context.fillStyle = 'red';
                context.fillText("+", x - 30, y - 20);
                context.stroke();
            } else {
                context.font = "bold 14px Arial";
                context.fillStyle = "black";
                context.fillText("-", x - 30, y - 20);
                context.stroke();
            }
        }
        context.font = "9px Arial";
        context.fillStyle = 'black';



        context.stroke();
        context.closePath();
    } else if ((node.parent != null)) {
        if (node.parent.viewChildren) {
            context.beginPath();
            context.arc(x, y, 20, 0, Math.PI * 2);
            context.font = "9px Arial";
            context.fillStyle = 'black';
            context.fillText(node.element.tagName, x - 18, y + 2, 100);
            if (node.element.children.length > 0) {
                if (node.viewChildren) {
                    context.font = "bold 14px Arial";
                    context.fillStyle = 'red';
                    context.fillText("+", x - 30, y - 25);
                    context.stroke();
                } else {
                    context.font = "bold 14px Arial";
                    context.fillStyle = "black";
                    context.fillText("-", x - 30, y - 25);
                    context.stroke();
                }
            }
            context.stroke();

            drawRects()
        }
        context.font = "9px Arial";
        context.fillStyle = 'black';
        context.stroke();
        context.closePath();
    }

}

function hideChildren(node, i = 0) {
    hide(node, i);
}

function hide(node, i = 0) {
    if (!node.parent) {
        for (i = 0; i < nodes.length; i++) {
            nodes[i].viewChildren = false;
        }
    } else {
        for (i; i < nodes.length; i++) {
            if (node != nodes[i]) {
                if (nodes[i].parent == node && nodes[i].viewChildren) {
                    nodes[i].viewChildren = false;
                    hideChildren(nodes[i], i);
                }
            }
        }
    }
}

function showAttributes(node) {
    let attr = ""
    if (node.element.hasAttributes) {
        for (let i = 0; i < node.element.attributes.length; i++) {
            attr += node.element.attributes[i].name + ": " + node.element.attributes[i].value + "\n";
        }
    }
    alert(attr);
}

function showContent(node) {
    let content = document.querySelector(".content");
    content.innerText = node.element.outerHTML;
    content.style.display = "block"
}

function hideContent() {
    let content = document.querySelector(".content");
    content.style.display = "none";
}


class Node {
    constructor(element, x, y, viewChildren = true) {
        this.element = element;
        this.x = x;
        this.y = y;
        this.viewChildren = viewChildren
        this.headY = y - 20
        this.tailY = y + 20

    }
    element
    x
    y
    viewChildren
    fullText
    text
    parent
    headY
    tailY
    draw() {
        drawCircle(this, this.x, this.y);
    }
    drawText() {
        if (this.parent && this.parent.viewChildren) {
            if (this.fullText != undefined && this.fullText != null)
                if (this.fullText.length > 7) {
                    this.text = this.fullText.substring(0, 7) + "...";
                } else {
                    this.text = this.fullText;
                }

            if (this.text != undefined && this.text != null && this.text != "") {
                context.moveTo(this.x - 20, this.y);

                context.lineTo(this.x - 40, this.y + 25);
                context.fillText(this.text, this.x - 70, this.y + 40);
                context.rect(this.x - 75, this.y + 25, 60, 20, true);

                context.stroke();
            }
        }



    }

    containsCoordsShow(x, y) {
        if (this.x - 30 < x && this.y - 35 < y && this.x - 20 > x && this.y - 20 > y) {
            return true;
        }
    }

    containsCoordsContent(x, y) {
        if (this.x - 20 < x && this.y - 20 < y && this.x + 20 > x && this.y + 20 > y) {
            return true;
        }
    }

    containsCoordsAttr(x, y) {
        if (this.x - 50 < x && this.y < y && this.x - 25 > x && this.y + 10 > y) {
            return true;
        }
    }


}
function makeTree(element, xstart, xend, y, parent) {
    let x = (xend + xstart) / 2;
    let root = new Node(element, x, y, true, parent);
    root.parent = parent;
    root.draw();
    for (let i = 0; i < root.element.childNodes.length; i++) {

        if (root.element.childNodes[i].nodeType == 3) {
            root.fullText = root.element.childNodes[i].nodeValue.trim();
            break;
        }
    }
    if (root.fullText != null && root.fullText.length > 0) {
        root.drawText();
    }
    let d = (xend - xstart) / (root.element.childElementCount);
    y += 100;
    let tempStart = xstart;
    let tempEnd = xstart + d;
    nodes.push(root);
    if (root.viewChildren)
        for (let i = 0; i < root.element.childElementCount; i++) {
            makeTree(element.children[i], tempStart, tempEnd, y, root);
            context.moveTo(x, y - 80);
            context.lineTo((tempStart + tempEnd) / 2, y - 20);
            context.stroke();
            tempStart += d;
            tempEnd += d;
        }
}

makeTree(root, 0, 1800, 42);