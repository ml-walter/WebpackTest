import 'index.scss';
import 'index.jade';

const HammerEffect = require('./HammerEffect');
$(() => {
    var CROP_IMAGE_SIZE = 1024;

    $(".upload_input").on("change",function(event){                
        var input = event.target.files[0];
        // canvasResize
        canvasResize(input, {
            width: CROP_IMAGE_SIZE,
            height: CROP_IMAGE_SIZE,
            crop: true,            
            quality: 100,               
            callback: function(data , width , height, imageData){
                console.log("onParseImageComplete",width,height);
                if (width < CROP_IMAGE_SIZE && height < CROP_IMAGE_SIZE) {
                    alert("選取的圖片太小張，換一張試試看");
                } else {
                    source.src = data;            
                }                        
            }
        });
    });


    var hitArea = $( '.hit_area' ).get( 0 );
    var canvas = $( '#canvas' ).get( 0 );
    var hammer = new HammerEffect( hitArea, data => drawCanvas( data ) );

    var source = new Image();
    source.src = require('../img/img_1024.png');
    source.onload = () => hammer.init( source.width, source.height , canvas.width , canvas.height );    
    
    /**
     * @param {{scale:number,angle:number,x:number,y:number}} hammerData 
     * */
    function drawCanvas( hammerData ) {
        var ctx = canvas.getContext('2d');
        ctx.clearRect( 0, 0, canvas.width, canvas.height );        
        if ( hammerData ) {
            ctx.save();

            var radian = hammerData.angle * Math.PI / 180;
            var scale = hammerData.scale;

            ctx.translate( hammerData.x, hammerData.y );
            ctx.rotate( radian );
            ctx.scale( scale, scale );

            ctx.drawImage( source, hammerData.centerX*-1, hammerData.centerY*-1 );
            ctx.restore();
        }
    }
});