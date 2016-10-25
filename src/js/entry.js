import 'index.scss';
import 'index.jade';
require('../lib/all');
require('../lib/TransformTool/Utils');
require('../lib/TransformTool/TransformTool');
require('../lib/TransformTool/TransformCanvasPictures');
// require('../lib/TransformTool/DOMTransformTool');
// require('../lib/TransformTool/TransformDOMPictures');
require('../lib/rasterizeHTML.allinone');


$(() => {
    const CropImage = require('./CropImage');
    const Fitting = require('./fitting');

    var _CropImage = new CropImage();
    var _Fitting = new Fitting();

    //Img Default
    _CropImage.source.src=require('../img/img_1024.png');

    _CropImage.on('complete',(e)=>{
        _Fitting.Init(e);
    })

    // $.when(dbAccessor).then(function () {
        
    // });

});