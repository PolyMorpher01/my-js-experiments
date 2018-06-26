var animate = function () {

    var newfun = function () {
        setInterval(function () {
            var num = 1;
            var direction = "right";
            return function () {
                var star = "";

                for (var j = 0; j < num; j++) {
                    star += "*";
                }
                console.log(star);
                if (direction === "right") {
                    num += 1;
                }
                else{
                    num -= 1;
                }

                if (num === 5) {
                    direction = "left";
                }

                if (num === 1) {
                    direction = "right";
                }

            }

        }(), 100);
    };


    newfun();


};

animate();



