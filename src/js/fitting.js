const TransformTool = require('../lib/TransformTool/TransformCanvasPictures')

class Fitting {
    constructor() {
        this._App = new App();

        this._App.loader.load([
            require('../img/_dunny.png'),
            // require('../img/_fatcap.png'),
            // require('../img/_piggy.png')
        ]);
        $('#getResultImg').on('click', (e) => {
            this.GetResultImg();
        });
    }
    Init(eyeImage) {
        this.eyeImage = eyeImage;
        // var canvas = document.getElementById("canvas2");
        // var ctx = canvas.getContext("2d");
        $('#RectangleImg').attr('src',eyeImage);
        // var image = new Image();
        // image.onload = function () {
        //     // ctx.drawImage(image, 0, 0);
        //     $('#dom').css('background-image','url('+image.src +')');
                
        // };
        // image.src = eyeImage;
    }

    GetResultImg() {
        // console.log(rasterizeHTML);
        // var scaleFactor = this.backingScale();
        // console.log(scaleFactor);
        // var canvas = document.getElementById("canvas2");
        // var ctx = canvas.getContext("2d");
        // // var dom = $('#dom').children('svg:eq(0)').remove().prevObject.children('#dunny').remove().prevObject.children('#piggy').remove().html();
        // var dom = document.getElementById('dom');

        // console.log(dom);

        // var image = new Image();
        // image.onload = function () {
        //     ctx.drawImage(image, 0, 0);
        //     rasterizeHTML.drawDocument(dom, canvas);
        // };
        // image.src = this.eyeImage;
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        canvas.width =703 ;
        canvas.height=124;
        ctx.drawImage(document.getElementById('RectangleImg') , 0,0);
        ctx.drawImage(document.getElementById('canvas2'),0,0);
        $('#result_img').attr('src', canvas.toDataURL("image/jpeg"));
        

    }

    backingScale() {
        if (window.devicePixelRatio && window.devicePixelRatio > 1) {
            return window.devicePixelRatio;
        }
        return 1;
    };
}

module.exports = Fitting;