import 'index.scss';
import 'index.jade';

const Action = require("./action.js");
$(function (){
    
    var action = new Action(document.getElementById('croppie_img'));
    action.bindCroopie();
    // action.on('photoReady', () => {
    // });
})