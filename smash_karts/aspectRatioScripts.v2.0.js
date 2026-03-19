function resizeTagByClass(className){
    if(document.getElementsByClassName('wrapperAspectRatio').length > 0 &&
      document.getElementsByClassName(className).length > 0){
      var documentW = parseInt(window.innerWidth);
      var documentH = parseInt(window.innerHeight);

      var targetRatioElem = document.getElementsByClassName(className)[0];
      var baseAspectRatioElem = document.getElementsByClassName('wrapperAspectRatio')[0];
      var templateH = parseInt(baseAspectRatioElem.getAttribute('data-height'));
      var templateW = parseInt(baseAspectRatioElem.getAttribute('data-width'));
      
      if((documentW/templateW) > (documentH/templateH)){
        targetRatioElem.style.height = '100%';
        var newWrapperHeight = parseInt(baseAspectRatioElem.offsetHeight);
        targetRatioElem.style.width = templateW * (newWrapperHeight/templateH)+'px';
      }else{
        targetRatioElem.style.width = '100%';
        var newWrapperWidth = parseInt(baseAspectRatioElem.offsetWidth);
        targetRatioElem.style.height = templateH * (newWrapperWidth/templateW)+'px';
      }
    }
}

function resizeVideoTag() {
  if(document.getElementsByTagName('video').length > 0) {
    var videoElem = document.getElementsByTagName('video')[0];
    var videoW = parseInt(videoElem.offsetWidth);
    videoElem.style.height = videoW * 0.666+'px';
  }
}

function applyStyleToTags() {
  resizeTagByClass('wrapperAspectRatio');
  resizeTagByClass('linkTag');
  resizeVideoTag();
}

var timer;
document.onresize = function(){
    timer && clearTimeout(timer);
    timer = setTimeout(applyStyleToTags, 200);
};

var ind=0;
function resizeAdRec(){
    ind++;
    if(document.documentElement.clientWidth <= 0){
        if(ind <= 20){
            setTimeout(resizeAdRec, 250);            
        }
        else {
          applyStyleToTags();
        }
    }
    else{
      applyStyleToTags();
    } 
}

resizeAdRec();


