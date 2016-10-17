const hammer = require("hammerjs");
class HammerEffect {
    /**
     * @param {HTMLElement} hitArea
     * @param {function({scale:number,angle:number,x:number,y:number})} updateHandler
     */
    constructor( hitArea, updateHandler ) {
        var transform = {
            x: 0,
            y: 0,
            scale: 1,
            angle: 0,
            centerX: 0,
            centerY: 0
        };
        /** @type {{scale:number,angle:number,x:number,y:number}} */
        this.transform = transform;
        /** @type {function} */
        this.updateHandler = updateHandler;
        this.startX = 0;
        this.startY = 0;


        var mc = new Hammer.Manager( hitArea );
        mc.add( new Hammer.Pan( { threshold: 0, pointers: 0 }) );
        mc.add( new Hammer.Rotate( { threshold: 0 }) ).recognizeWith( mc.get( 'pan' ) );
        mc.add( new Hammer.Pinch( { threshold: 0 }) ).recognizeWith( [mc.get( 'pan' ), mc.get( 'rotate' )] );

        
        mc.on( 'pan panend', ev => {
            var x = this.startX + ev.deltaX;
            var y = this.startY + ev.deltaY;
            if ( ev.type === 'panend' ) {
                this.startX += ev.deltaX;
                this.startY += ev.deltaY;
            }
            transform.x = x;
            transform.y = y;
            this.updateElementTransform();
        });

        var initScale = 1;
        mc.on( "pinchstart pinchmove", ev => {
            if ( ev.type == 'pinchstart' ) {
                initScale = transform.scale || 1;
            }
            
            transform.scale = initScale * ev.scale;
            transform.scale = Math.max( 0.5, transform.scale );            
            this.updateElementTransform();
        });



        this.initAngle = 0;
        this.accRotation = 0;
        mc.on( "rotatestart rotatemove", ev => {
        // mc.on( "rotatestart rotatemove rotateend", ev => {
            if ( ev.type == 'rotatestart' ) {
                // console.log(  );
                
                this.accRotation = ev.rotation;
                this.initAngle = transform.angle;
            } else {
                var offset = ev.rotation - this.accRotation;
                var angle = this.initAngle + offset;
                transform.angle = angle;
                // $( '.debug' ).html( angle );
            }
            this.updateElementTransform();
        });
    }
    /**
     * @param {number} sourceWidth
     * @param {number} sourceHeight
     * @param {number} canvasWidth
     * @param {number} canvasHeight
     */
    init( sourceWidth , sourceHeight , canvasWidth , canvasHeight) {
        console.log( 'init', sourceWidth, sourceHeight , canvasWidth , canvasHeight );
        
        this.accRotation = 0;
        this.initAngle = 0;
        this.sourceWidth = sourceWidth;
        this.sourceHeight = sourceHeight;        
        this.startX = sourceWidth - canvasWidth >> 1;
        this.startY = sourceHeight - canvasHeight >> 1;
        this.transform.x = this.startX;
        this.transform.y = this.startY;
        this.transform.scale = 1;
        this.transform.angle = 0;
        this.transform.centerX = sourceWidth >> 1;
        this.transform.centerY = sourceHeight >> 1;
        this.updateElementTransform();
    }
    reset() {
        console.log( 'reset' );
        this.init( this.sourceWidth , this.sourceHeight );        
    }
    updateElementTransform() {        
        this.updateHandler( this.transform );
    }
}
module.exports = HammerEffect;