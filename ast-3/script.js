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

    previousIndex = currentIndex;

    currentIndex = (currentIndex += 1) % images.length;
    //
    // if(previousIndex === 0 || previousIndex ===6){
    //     return null;
    // }

    transitionAnimation(currentIndex,previousIndex,"next");

    // imageWrapper[0].style.marginLeft = currentLeftMargin(currentIndex);
};


previousButton.onclick = function () {

    previousIndex = currentIndex;
    currentIndex = (currentIndex -= 1) % images.length;

    // if (currentIndex <= 0) {
    //     currentIndex = images.length - 1;
    // }
    //
    // if(previousIndex === 0 || previousIndex ===6){
    //     return null;
    // }

    transitionAnimation(currentIndex,previousIndex,"previous");

    // imageWrapper[0].style.marginLeft = currentLeftMargin(currentIndex);
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
            imageWrapper[0].style.marginLeft = currentLeftMargin(currentIndex) + "px";
        };

    }
}


function currentLeftMargin(currentIndex) {
    return (currentIndex * -600);
}



function transitionAnimation(currentIndex,previousIndex, side) {



    var leftMargin  = currentLeftMargin(previousIndex);
    var rightMargin = currentLeftMargin(currentIndex);
    console.log("previous index", previousIndex);
    console.log("current index", currentIndex);

    console.log("left margin", leftMargin);
    console.log("right margin", rightMargin);



    var intervalRef = setInterval(function () {

       //
       // console.log("right margin", rightMargin);
       // console.log("left margin", leftMargin);

        if (side==="next")
            leftMargin -= 30;
        else
            leftMargin +=30;

       imageWrapper[0].style.marginLeft = leftMargin + "px";

       if(leftMargin === rightMargin){
           clearInterval(intervalRef);
       }

   },30);

}
