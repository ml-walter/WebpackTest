const Croppie = require('croppie');
// EventEmitter = require('events').EventEmitter
class Action {
    constructor(dom) {
        this._croopieEvent = new Croppie(dom, {
            enableExif: true,
            viewport: { width: 200, height: 100 },
            boundary: { width: 500, height: 500 }
        });
        console.log($(dom).closest('#croppie_uploadPhoto'));

        $(dom).children('input#croppie_uploadPhoto').click(e => {
            alert(312);
        });
        $(dom).children('input#croppie_file').change(e => {
            alert(765);
        });
        $(dom).children('input#croppie_range').change(e => {
            // console.log(e.val());
            console.log(e);
            // $('.cr-overlay').style('');
        });
    }
    bindCroopie(url) {
        this._croopieEvent.bind({
            url: require('../img/test.jpg')
        });
    }
    destoryCroopie(){
        this._croopieEvent.destory();
    }

}

module.exports = Action;