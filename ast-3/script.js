var nextButton = document.getElementById("right");
var previousButton = document.getElementById("left");

var imageWrapper = document.getElementsByClassName("image-wrapper");
var buttonWrapper = document.getElementById("button-number");

$numberButton = document.getElementsByClassName("numberButton");


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

$numberButton[0].style.backgroundColor = "blue";
$numberButton[0].style.color = "white";


nextButton.onclick = function () {

    previousIndex = currentIndex;

    currentIndex = (currentIndex += 1) % images.length;

    if (currentIndex === 0) {
        currentIndex = 6;
        return null;
    }

    for( var k=0;k<$numberButton.length;k++){
        $numberButton[k].style.backgroundColor = "lightskyblue";
        $numberButton[k].style.color = "black";
    }


    $numberButton[currentIndex].style.backgroundColor = "blue";
    $numberButton[currentIndex].style.color = "white";

    transitionAnimation(currentIndex,previousIndex,"next");

};


previousButton.onclick = function () {

    previousIndex = currentIndex;
    currentIndex = (currentIndex -= 1) % images.length;

    if (currentIndex < 0) {
        currentIndex = 0;
        return null;
    }

    for( var l=0;l<$numberButton.length;l++){
        $numberButton[l].style.backgroundColor = "lightskyblue";
        $numberButton[l].style.color = "black";
    }

    $numberButton[currentIndex].style.backgroundColor = "blue";
    $numberButton[currentIndex].style.color = "white";

    transitionAnimation(currentIndex,previousIndex,"previous");

};


function loadImages() {
    for (var i = 0; i < images.length; i++) {

        //add a new image
        var newImage = document.createElement('img');
        imageWrapper[0].appendChild(newImage);
        newImage.src = images[i];

        //add a new button
        var newButton = document.createElement('button');
        newButton.innerHTML = i + 1;
        newButton.imagePosition = i;
        newButton.className = "numberButton";
        buttonWrapper.appendChild(newButton);


        newButton.onclick = function () {
            currentIndex = this.imagePosition;
            imageWrapper[0].style.marginLeft = currentLeftMargin(currentIndex) + "px";

            for( var j=0;j<$numberButton.length;j++){
                $numberButton[j].style.backgroundColor = "lightskyblue";
                $numberButton[j].style.color = "black";
            }

            this.style.backgroundColor = "blue";
            this.style.color = "white";
        };

    }
}


function currentLeftMargin(currentIndex) {
    return (currentIndex * -600);
}



function transitionAnimation(currentIndex,previousIndex, side) {



    var leftMargin  = currentLeftMargin(previousIndex);
    var rightMargin = currentLeftMargin(currentIndex);
    // console.log("previous index", previousIndex);
    // console.log("current index", currentIndex);
    //
    // console.log("left margin", leftMargin);
    // console.log("right margin", rightMargin);



    var intervalRef = setInterval(function () {

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
