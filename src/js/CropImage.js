const HammerEffect = require('./HammerEffect');
const canvas = $('#canvas').get(0);
const hitArea = $('.hit_area').get(0);
const EventEmitter = require('events').EventEmitter;

class CropImage extends EventEmitter{
    constructor() {
        super();

        var CROP_IMAGE_SIZE = 800;
        // var hitArea = $('.hit_area').get(0);
        // var canvas = $('#canvas').get(0);
        this.hammer = new HammerEffect(hitArea, data => this.drawCanvas(data));
        this.source = new Image();

        // event trigger
        this.source.onload = (e) => {
            this.hammer.init(this.source.width, this.source.height, canvas.width, canvas.height)
        };

        $(".upload_input").on("change", (e) => {
            var input = event.target.files[0];
            // canvasResize
            canvasResize(input, {
                width: CROP_IMAGE_SIZE,
                height: CROP_IMAGE_SIZE,
                crop: true,
                quality: 100,
                callback: (data, width, height, imageData) => {
                    console.log("onParseImageComplete", width, height);
                    if (width < CROP_IMAGE_SIZE && height < CROP_IMAGE_SIZE) {
                        alert("選取的圖片太小張，換一張試試看");
                    } else {
                        this.source.src = data;
                    }
                }
            });
        });

        $(window).resize((e) => {
            this.canvasResize();
        }).resize();

        $('#getRectangleResult').on('click', e => {
            this.getRectangleResult();
        });
    }

    drawCanvas(hammerData) {
        /**
         * @param {{scale:number,angle:number,x:number,y:number}} hammerData 
         * */
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (hammerData) {
            ctx.save();

            var radian = hammerData.angle * Math.PI / 180;
            var scale = hammerData.scale;

            ctx.translate(hammerData.x, hammerData.y);
            ctx.rotate(radian);
            ctx.scale(scale, scale);

            ctx.drawImage(this.source, hammerData.centerX * -1, hammerData.centerY * -1);
            ctx.restore();
        }
    }

    getRectangleResult() {
        //Get rectangle_area's coordinate and width and height in webpage
        var _rectangle = $('.rectangle_area'),
            _rectangle_offset = _rectangle.offset(),
            rectangle_area = {
                x: _rectangle_offset.left,
                y: _rectangle_offset.top,
                width: _rectangle.width(),
                height: _rectangle.height()
            };
        console.log(rectangle_area);
        //Get canvas's coordinate and width and height in webpage
        var _canvas = $('#canvas'),
            _canvas_ctx = $('#canvas').get(0),
            _canvas_offset = _canvas.offset(),
            canvas_area = {
                x: _canvas_offset.left,
                y: _canvas_offset.top,
                width: _canvas.width(),
                height: _canvas.height()
            }
        console.log(canvas_area);
        //determine rectangle_area and canvas
        var rectangle_result = {
            x: Math.round(rectangle_area.x - canvas_area.x),
            y: Math.round(rectangle_area.y - canvas_area.y),
            width: Math.round(rectangle_area.width),
            height: Math.round(rectangle_area.height)
        }
        console.log(rectangle_result);

        //create elemnt canvas to store the rectangle_area
        var rectangle_canvas = document.createElement('canvas');
        rectangle_canvas.width = rectangle_result.width;
        rectangle_canvas.height = rectangle_result.height;
        var rectangle_ctx = rectangle_canvas.getContext('2d');

        // rectangle_ctx.width= $(hitArea).width();
        // rectangle_ctx.height= $(hitArea).height();

        rectangle_ctx.drawImage(_canvas_ctx, rectangle_result.x, rectangle_result.y, rectangle_result.width, rectangle_result.height, 0, 0, rectangle_result.width, rectangle_result.height);

        $('#RectangleImg').attr('src', rectangle_canvas.toDataURL("image/jpeg"));

        this.emit('complete',rectangle_canvas.toDataURL("image/jpeg"));
    }

    canvasResize() {
        canvas.width=$(hitArea).width();
        canvas.height=$(hitArea).height();
        this.hammer.updateElementTransform();
    }
}

module.exports = CropImage;