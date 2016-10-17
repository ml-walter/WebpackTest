import 'index.scss';
import 'index.jade';
require('../lib/all');
const CropImage = require('./CropImage');
$(() => {
    var _CropImage = new CropImage();
    //Img Default
    _CropImage.source.src=require('../img/img_1024.png');
});