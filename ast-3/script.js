var nextButton = document.getElementById("right");
var previousButton = document.getElementById("left");

var imageWrapper = document.getElementsByClassName("image-wrapper");
var buttonWrapper = document.getElementById("button-number");


var previousIndex = 0;
var currentIndex = 0;

var images = [
    "./images/img-1.jpg",
    "./images/img-2.jpg",
    "./images/img-3.jpg",
    "./images/img-4.jpg",
    "./images/img-5.jpg",
    "./images/img-6.jpg",
    "./images/img-7.jpg",
];


loadImages();


nextButton.onclick = function () {

    // previousIndex = currentIndex;

    currentIndex = (currentIndex += 1) % images.length;

    imageWrapper[0].style.marginLeft = currentLeftMargin(currentIndex);
};


previousButton.onclick = function () {

    // previousIndex = currentIndex;
    currentIndex = (currentIndex -= 1) % images.length;

    console.log(currentIndex);

    if (currentIndex <= 0) {
        currentIndex = images.length - 1;
    }


    imageWrapper[0].style.marginLeft = currentLeftMargin(currentIndex);
};


function loadImages() {
    for (var i = 0; i < images.length; i++) {

        //add a new image
        var newImage = document.createElement('img');
        imageWrapper[0].appendChild(newImage);
        // newImage.setAttribute("src",images[i]);
        newImage.src = images[i];

        //add a new button
        var newButton = document.createElement('button');
        newButton.innerHTML = i + 1;
        newButton.imagePosition = i;
        buttonWrapper.appendChild(newButton);


        newButton.onclick = function () {
            currentIndex = this.imagePosition;
            imageWrapper[0].style.marginLeft = currentLeftMargin(currentIndex);
        };

    }
}


function currentLeftMargin(currentIndex) {
    return (currentIndex * -600) + "px";
}

function transitionAnimation(previousIndex, currentIndex) {

}
