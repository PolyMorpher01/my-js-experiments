var data = [];
var list = document.getElementById("list");
var myDiv = document.getElementById('my-div');

myDiv.style.position = "relative";


for (var i = 0; i < 10; i++) {
    data[i] = {top: getRandom(), left: getRandom()};

}

function getRandom() {
    return Math.floor(Math.random() * Math.floor(490));
}


for (var j = 0; j < 10; j++) {
    var newElement = document.createElement('div');

    newElement.style.height = "10px";
    newElement.style.width = "10px";
    newElement.style.backgroundColor = "black";
    newElement.style.position = "absolute";
    newElement.style.top = data[j].top + "px";
    newElement.style.left = data[j].left + "px";

    myDiv.appendChild(newElement);

    newElement.onclick = function () {
        this.style.display = "none";
        var listElement = document.createElement("li");
        listElement.innerText = "Top: " + this.style.top + ", " + "Left: " + this.style.left;
        list.appendChild(listElement);
    }
}


//**************************************************

