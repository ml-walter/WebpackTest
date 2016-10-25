
class Fitting {
    constructor() {
        this._App = new App();

        $('#getResultImg').on('click', (e) => {
            this.GetResultImg();
        });
    }
    Init(eyeImage) {
        this.eyeImage = eyeImage;
        // var canvas = document.getElementById("canvas2");
        // var ctx = canvas.getContext("2d");

        // var image = new Image();
        // image.onload = function () {
        //     // ctx.drawImage(image, 0, 0);
        //     $('#dom').css('background-image','url('+image.src +')');
        // };
        // image.src = eyeImage;
    }

    GetResultImg() {
        console.log(rasterizeHTML);
        var scaleFactor = this.backingScale();
        console.log(scaleFactor);
        var canvas = document.getElementById("canvas2");
        var ctx = canvas.getContext("2d");
        // var dom = $('#dom').children('svg:eq(0)').remove().prevObject.children('#dunny').remove().prevObject.children('#piggy').remove().html();
        var dom = document.getElementById('dom');
        // img.children('svg').remove();
        console.log(dom);
        // console.log(rasterizeHTML);



        var image = new Image();
        image.onload = function () {
            ctx.drawImage(image, 0, 0);
            rasterizeHTML.drawDocument(dom, canvas);
        };
        image.src = this.eyeImage;
    }

    backingScale() {
        if (window.devicePixelRatio && window.devicePixelRatio > 1) {
            return window.devicePixelRatio;
        }
        return 1;
    };
}

module.exports = Fitting;