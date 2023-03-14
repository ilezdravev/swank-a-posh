$(document).ready(function () {

    var mediaQuery1 = window.matchMedia('(max-width: 789px)');
  console.log(mediaQuery1,mediaQuery1.matches,'media qiery')
    if(mediaQuery1.matches){
        $('.footer__heading').on('click',function (e) {  
          e.preventDefault();
            $(this).toggleClass('open');
          return false;
        })
    }

});
