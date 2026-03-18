// call Adlib.screenshotterEnd() on the last animation code.
// do not delete initAnimation function since this is the first function that will be called after initialization of defaultValues.
// if ever there is a video for this ad, you can use myVideo as the variable to play the video.
// sample tween codes:
// tween.to("#disclaimerWrapper", {opacity:0.99,duration: 1,ease: "power2.out"},"-=1");
// tween.set("#frame1HeadlineWrapper",{opacity:1})
let tween;
var slideIndex = 1, slideIndicator = 1, buttonClick=0, above4="no";
let endTween;
let classActive="cards-monthly";
let disclaimerDisp=0;

function initAnimation() {
     // place all fluid elements before text resize and css attrib.
     removeY3VzdG9t(["uiElement1","uiElement2","uiElement3","ctaColor1","trigger"]);
     document.querySelector("#customColorBG-container").style.background = defaultValues.uiElement3;
     document.querySelector("#cta-box").style.background = defaultValues.ctaColor1;
     document.querySelector("#cta-box-2").style.background = defaultValues.ctaColor1;
     document.querySelector("#cta-box-3").style.background = defaultValues.ctaColor1;

     document.querySelector("#legal-text").style.display = "flex";
     // changeCTAMargin();
     gsap.set(["#cta-flex-2","#cta-flex-3"],{opacity:0});


     showDivs(slideIndex,1,"default",170);
     contentValidation();
     Adlib.textResize(); // This is optional if your build doesn't use text resize you can delete this
     Adlib.templateCSS(this); // DO NOT DELETE THIS
     startAnimation();
}
function startAnimation() {  

     document.querySelector("#mainContent").style.opacity = 1;
     tween = gsap.timeline();
     takeScreenshot();
     tween.addLabel("autoanimation")
     .to(this, {onStart: () => {
                        plusDivs(1,"auto", buttonClick+=0);
               }, onComplete: () => {
                        tween.to(this,{onComplete:takeScreenshot,duration:.5},"autoanimation+=1.75");
               }},"autoanimation+=1.75")
     .to(this, {onStart: () => {
                        plusDivs(1,"auto", buttonClick+=0);
                    }, onComplete: () => {
                        tween.to(this,{onComplete:takeScreenshot,duration:.5},"autoanimation+=3.5");
               }},"autoanimation+=3.5")
     .to(this, {onStart: () => {
                       slidingtoRight('default');
                    }, onComplete: () => {
                        tween.to(this,{onComplete:takeScreenshot,duration:.75},"autoanimation+=5.25");
               }},"autoanimation+=5.25")
     .to(this, {onStart: () => {
                        plusDivs(1,"auto", buttonClick+=0);
                    }, onComplete: () => {
                        tween.to(this,{onComplete:takeScreenshot,duration:.5},"autoanimation+=7");
               }},"autoanimation+=7")
     .to(this, {onStart: () => {
                        plusDivs(1,"auto", buttonClick+=0);
                    }, onComplete: () => {
                        tween.to(this,{onComplete:animationEnd,duration:.5},"autoanimation+=8.80");
               }},"autoanimation+=8.75");
}
function animationEnd() {
     // call this function on the very end of the last animation.  

     takeScreenshot();
     setTimeout(function() {adlibEnd();},200);
     endTween = "yes";

}


// Remove <p class="Y3VzdG9t"> tag
function removeY3VzdG9t(elems) {
     elems.forEach((e) => { defaultValues[e] = defaultValues[e].replace(/<[^>]*>?/gm, ''); });
}



function slidingtoLeft(leftAction){
     var activeNow = document.querySelector('.active').id;
     slidingtoLeftgsap = gsap.timeline();
     console.log("Slide to left");
     if(leftAction=="click" && endTween!="yes") {
          tween.kill()
          animationEnd();
     }

     if(activeNow!="pill-monthly") {
          var yearlyCardPrev = document.getElementsByClassName("cards-yearly");
          var monthlyCardPrev = document.getElementsByClassName("cards-monthly");
          var y = document.getElementsByClassName("indicator");
          var z = document.getElementsByClassName("disclaimer");
          var ctaClass = document.getElementsByClassName("cta-flex");


          // slidingtoLeftgsap.set(["#card1"],{x:0});
          classActive="cards-monthly";
          slidingtoLeftgsap.add("anim")
          .fromTo(yearlyCardPrev[slideIndex-1],{opacity:1, x:0},{opacity:0,x:0, ease: "power2.in"},"anim+=0")
          .fromTo("#white-container", {x:77}, {x:0, ease: "power2.inOut"},"anim+=0")
          .to(this,{ onComplete:()=>{
               document.getElementById("pill-yearly").classList.remove("active");
               document.querySelector('#pill-monthly').classList.add("active");
          }},"anim-=0.2")
          .fromTo(yearlyCardPrev[slideIndex-1],{opacity:1, x:0},{opacity:0,x:0, ease: "power2.in"},"anim+=0")
          .fromTo(monthlyCardPrev[0],{opacity:0, x:0},{display:"flex",opacity:1,x:0, ease: "power2.in"},"anim+=.5")
          .fromTo(z[slideIndex-1],{opacity:1, x:0},{opacity:0,x:0, ease: "power2.in"},"anim+=0")
          // .fromTo(ctaClass[slideIndex-1],{opacity:1, x:0},{opacity:0,x:0, ease: "power2.in"},"anim+=0")
          .fromTo(ctaClass[slideIndex-1],{opacity:1, x:0},{opacity:0,x:0, ease: "power2.in"},"anim+=.0")
          .to(z[0],{display:"flex",opacity:1,x:0, ease: "power2.in"},"anim+=.5")
          // .to(ctaClass[0],{opacity:1,x:0, ease: "power2.in"},"anim+=.5")
          .to(ctaClass[0],{opacity:1,x:0, ease: "power2.in"},"anim+=.5")
          .to(this,{ onComplete:()=>{
               //set indicators to display none
               for (j = 0; j < y.length; j++) {
                    y[j].style.backgroundColor = "rgba(255, 255, 255, 0.15)";
               }

               //set indicator to active
               y[0].style.backgroundColor = "rgba(255, 255, 255, 0.50)";
          }},"anim+=0");
          

           slideIndex=1; 

          // showDivs(slideIndex,1,"click");

     }    
}

function slidingtoRight(rightAction){
     var activeNow = document.querySelector('.active').id;

     slidingtoRightgsap = gsap.timeline();
     console.log("Slide to right");

     if(rightAction=="click" && endTween!="yes") {
          tween.kill()
          animationEnd();
     }

     if(activeNow!="pill-yearly") {
          var monthlyCardPrev = document.getElementsByClassName("cards-monthly");
          var yearlyCardPrev = document.getElementsByClassName("cards-yearly");
          var y = document.getElementsByClassName("indicator");
          var z = document.getElementsByClassName("disclaimer");
          var ctaClass = document.getElementsByClassName("cta-flex");


          // for (i = 0; i < x.length; i++) {
          //      x[i].style.display = "none";  
          // }

          classActive="cards-yearly";
          slidingtoRightgsap.add("anim")
          .fromTo(monthlyCardPrev[slideIndex-1],{opacity:1, x:0},{opacity:0,x:0, ease: "power2.in"},"anim+=0")
          .fromTo("#white-container", {x:0}, {x:77, ease: "power2.inOut"},"anim+=0")
          .to(this,{ onComplete:()=>{
               document.getElementById("pill-monthly").classList.remove("active");
               document.querySelector('#pill-yearly').classList.add("active");
          }},"anim-=0.2")
          .fromTo(monthlyCardPrev[slideIndex-1],{opacity:1, x:0},{opacity:0, x:0, ease: "power2.in"},"anim+=0")
          .fromTo(yearlyCardPrev[0],{opacity:0, x:0},{display:"flex",opacity:1,x:0, ease: "power2.in"},"anim+=.5")
          .fromTo(z[slideIndex-1],{opacity:1, x:0},{opacity:0,x:0, ease: "power2.in"},"anim+=0")
          // .fromTo(ctaClass[slideIndex-1],{opacity:1, x:0},{opacity:0,x:0, ease: "power2.in"},"anim+=0")
          .fromTo(ctaClass[slideIndex-1],{opacity:1, x:0},{opacity:0,x:0, ease: "power2.in"},"anim+=0")
          .to(z[0],{display:"flex",opacity:1,x:0, ease: "power2.in"},"anim+=.5")
          // .to(ctaClass[0],{opacity:1,x:0, ease: "power2.in"},"anim+=.5")
          .to(ctaClass[0],{opacity:1,x:0, ease: "power2.in", ease: "power2.in"},"anim+=.5")
          .to(this,{ onComplete:()=>{
               //set indicators to display none
               for (j = 0; j < y.length; j++) {
                    y[j].style.backgroundColor = "rgba(255, 255, 255, 0.15)";
               }

               //set indicator to active
               y[0].style.backgroundColor = "rgba(255, 255, 255, 0.50)";
          }},"anim+=0");
          
          slideIndex=1; 
          // tween.fromTo(x[slideIndex-1],{opacity:0},{opacity:1, ease: "power2.in"});    

          // showDivs(slideIndex,1,"click");
     }
     
}



function contentValidation() {
     // frame 1 subheadline - key art title
     // var f1subheadlineArray = [defaultValues.frame1Subheadline, defaultValues.frame1Subheadline2, defaultValues.frame1Subheadline3];
     // var f1subheadlineContainerIdArray = ["frame1subheadline-text", "frame1subheadline2-text","frame1subheadline3-text"];
     // for(var ctr=0; ctr < f1subheadlineArray.length; ctr++) {
     //      if(Adlib.isEmpty(f1subheadlineArray[ctr])) {
     //           document.getElementById(f1subheadlineContainerIdArray[ctr]).style.display = "none";
     //      }      
     // }

     // headline - Promo name
     var frameHeadlineArray = [defaultValues.frame1Headline, defaultValues.frame2Headline, defaultValues.frame3Headline, defaultValues.frame4Headline, defaultValues.frame5Headline, defaultValues.frame6Headline];
     var frameHeadlineContainerIdArray = ["frame1headline-text","frame2headline-text","frame3headline-text","frame4headline-text","frame5headline-text","frame6headline-text",];
     for(var ctr=0; ctr < frameHeadlineArray.length; ctr++) {
          if(Adlib.isEmpty(frameHeadlineArray[ctr])) {
               document.getElementById(frameHeadlineContainerIdArray[ctr]).style.display = "none";
          }      
     }

     // headline2 - Promo Description
     var frameHeadline2Array = [defaultValues.frame1Headline2, defaultValues.frame2Headline2, defaultValues.frame3Headline2, defaultValues.frame4Headline2, defaultValues.frame5Headline2, defaultValues.frame6Headline2];
     var frameHeadline2ContainerIdArray = ["frame1headline2-text","frame2headline2-text","frame3headline2-text","frame4headline2-text","frame5headline2-text","frame6headline2-text",];
     for(var ctr=0; ctr < frameHeadline2Array.length; ctr++) {
          if(Adlib.isEmpty(frameHeadline2Array[ctr])) {
               document.getElementById(frameHeadline2ContainerIdArray[ctr]).style.display = "none";
          }      
     }

     // headline3 - Price
     var frameHeadline3Array = [defaultValues.frame1Headline3, defaultValues.frame2Headline3, defaultValues.frame3Headline3, defaultValues.frame4Headline3, defaultValues.frame5Headline3, defaultValues.frame6Headline3];
     var frameHeadline3ContainerIdArray = ["frame1headline3-text","frame2headline3-text","frame3headline3-text","frame4headline3-text","frame5headline3-text","frame6headline3-text",];
     for(var ctr=0; ctr < frameHeadline3Array.length; ctr++) {
          if(Adlib.isEmpty(frameHeadline3Array[ctr])) {
               document.getElementById(frameHeadline3ContainerIdArray[ctr]).style.display = "none";
          }      
     }

     // legal - disclaimer 
     var legalArray = [defaultValues.legal, defaultValues.legal2, defaultValues.legal3];
     var legalContainerIdArray = ["legal-text", "legal2-text","legal3-text","legal4-text", "legal5-text","legal6-text"];
     for(var ctr=0; ctr < legalArray.length; ctr++) {
          if(Adlib.isEmpty(legalArray[ctr])) {
               document.getElementById(legalContainerIdArray[ctr]).style.display = "none";
               // document.getElementById(legalContainerIdArray[ctr+3]).style.display = "none";
          }      
     }

     // frame1Image - curve image
     // if((defaultValues.frame1Image.indexOf("blank") > -1)) {
     if(checkBlankImage("frame1Image")) {
          document.getElementById("curve-container").style.display = "none";
     }

  
}

/* Slide Show */

// showDivs(slideIndex);

function plusDivs(n,triggerButton, noOfClicks) {
     plusDivsgsap = gsap.timeline();
     var positionOfPrev;

     if(triggerButton=="arrowButton" && noOfClicks==1  && endTween!="yes") {
          tween.kill()
          animationEnd();
     }

     if(n=="1" && slideIndex<6){
          plusDivsgsap.set(["#card1","#card2","#card3","#card4","#card5","#card6"],{x:170});
          positionOfPrev=-170;
     } else if(n=="-1") {
          plusDivsgsap.set(["#card1","#card2","#card3","#card4","#card5","#card6"],{x:-170});
          positionOfPrev=170;
     }


     showDivs(slideIndex += n,n,"default",positionOfPrev);
}

function showDivs(n,n2,activeNowId,posOfPrev,slideNumber,posOfCurrent) {
 

     slideIndicator = slideIndex;
     showDivsgsap = gsap.timeline();
     // changeCTAMargin();

     var i, h;
     var currentCards = document.getElementsByClassName(classActive);
     var y = document.getElementsByClassName("indicator");
     var z = document.getElementsByClassName("disclaimer");
     var ctaClass = document.getElementsByClassName("cta-flex");




     

     if (n >= 4) {slideIndex = 1; slideIndicator = 1; above4="yes";}
     if (n < 1) {slideIndex = currentCards.length, slideIndicator = 3}


     for (i = 0; i < currentCards.length; i++) {
          currentCards[i].style.display = "none";  
     }


     //set indicators to display none
     for (j = 0; j < y.length; j++) {
          y[j].style.backgroundColor = "rgba(255, 255, 255, 0.15)";
     }

     //set disclaimer to display none
     if(disclaimerDisp=="1") {
          for (k = 0; k < z.length; k++) {
               z[k].style.opacity = "0";  
          }
     }

     //set cta to display none
     // if(disclaimerDisp=="1") {
     //      for (h = 0; h < ctaClass.length; h++) {
     //           ctaClass[h].style.opacity = "0";  
     //      }
     // }

     //set indicator to active
     y[slideIndicator-1].style.backgroundColor = "rgba(255, 255, 255, 0.50)";

     //set card to active
     showDivsgsap.addLabel("next");


     if (n2=="1") {
          //display prev
          if (above4=="yes") {
               showDivsgsap.fromTo(currentCards[2],{x:0, display:"flex"},{x: posOfPrev,duration:.5, ease: "expo.inOut"},"next");
               // showDivsgsap.to("#cta-flex", {position:"absolute", top:0, duration:0.25, ease: "power1.inOut"},"next");  
               showDivsgsap.fromTo(z[2],{opacity:1,display:"flex"},{duration:.75,opacity:0, ease: "power1.inOut"},"next");        
               // showDivsgsap.fromTo(ctaClass[2],{opacity:1},{duration:.75,opacity:0, ease: "power1.inOut"},"next");        
               showDivsgsap.fromTo(ctaClass[2],{opacity:1},{duration:.75,opacity:0},"next");        
               above4="no";
               console.log("above 4");
          } else {
               showDivsgsap.fromTo(currentCards[slideIndex-2],{x:0, display:"flex"},{x: posOfPrev,duration:.5, ease: "expo.inOut"},"next");
               // showDivsgsap.to("#cta-flex", {position:"absolute",  top:0, duration:0.25, ease: "power1.inOut"},"next"); 
                showDivsgsap.to(z[slideIndex-2],{duration:0.75,opacity:0, ease: "power1.inOut"},"next");     
                // showDivsgsap.to(ctaClass[slideIndex-2],{duration:0.75,opacity:0, ease: "power1.inOut"},"next");     
                showDivsgsap.to(ctaClass[slideIndex-2],{duration:0.75,opacity:0},"next");     

               console.log("below 4");
          }
          
          //display next 
          showDivsgsap.to(currentCards[slideIndex-1],{opacity:1,display:"flex",x:0,duration:.5, ease: "expo.inOut"},"next");
          // showDivsgsap.to(ctaClass[slideIndex-1],{opacity:1,duration:.5, ease: "expo.inOut"},"next");
          showDivsgsap.to(ctaClass[slideIndex-1],{opacity:1,duration:.5},"next-=.2");


     } else if (n2=="-1") {

          //display prev
          if(slideIndex==3) {
               showDivsgsap.fromTo(currentCards[0],{x:0, display:"flex"},{x: posOfPrev,duration:.5, ease: "expo.inOut"},"next");
               showDivsgsap.fromTo(z[0],{opacity:1,display:"block"},{duration:.75,opacity:0, ease: "power1.inOut"},"next");            
               // showDivsgsap.fromTo(ctaClass[0],{opacity:1},{duration:.75,opacity:0, ease: "power1.inOut"},"next");            
               showDivsgsap.fromTo(ctaClass[0],{opacity:1},{duration:.75,opacity:0},"next");            
          } else {
               showDivsgsap.fromTo(currentCards[slideIndex],{x:0, display:"flex"},{x: posOfPrev,duration:.5, ease: "expo.inOut"},"next");
               showDivsgsap.fromTo(z[slideIndex],{opacity:1,display:"flex"},{duration:.75,opacity:0, ease: "power1.inOut"},"next");                  
               // showDivsgsap.fromTo(ctaClass[slideIndex],{opacity:1},{duration:.75,opacity:0, ease: "power1.inOut"},"next");                  
               showDivsgsap.fromTo(ctaClass[slideIndex],{opacity:1},{duration:.75,opacity:0},"next");                  

          } 
          
          //display next
          showDivsgsap.to(currentCards[slideIndex-1],{display:"flex",x:0,opacity:1,duration:.5, ease: "expo.inOut"},"next");
          // showDivsgsap.to(ctaClass[slideIndex-1],{opacity:1,duration:.5, ease: "expo.inOut"},"next");
          showDivsgsap.to(ctaClass[slideIndex-1],{opacity:1,duration:.5},"next-=.2");

     }


     if(disclaimerDisp=="1") {
          showDivsgsap.fromTo(z[slideIndex-1],{opacity:0},{duration:.75,display:"flex",opacity:1, ease: "power1.inOut"},"next");    
     }

     disclaimerDisp="1";
     
  
     
}

function showIndicator(num,slideNo,activeNowId) {

     if(endTween!="yes") {
          tween.kill()
          animationEnd();
     }

     if(slideNo>6) {slideNo=6;}
     else if(slideNo<1) {slideNo=1;} 

     showIndicatorgsap = gsap.timeline();
     var i,j, showIndicatorNum, slideNo2;
     var x = document.getElementsByClassName(classActive);
     var y = document.getElementsByClassName("indicator");
     var z = document.getElementsByClassName("disclaimer");
     var ctaClass = document.getElementsByClassName("cta-flex");


     showIndicatorNum = num;
     slideNo2 = slideNo;

     if(slideNo>3) {
          showIndicatorNum+=3;
          slideNo2-=3;
     }

     slideIndex=showIndicatorNum;

     if(slideNo2!=num) {
          if(showIndicatorNum>slideNo) {
               showIndicatorgsap.fromTo(x[slideNo-1],{x:0, display:"flex"},{opacity:1,x: -170,duration:.5, ease: "expo.inOut"},"next");
               showIndicatorgsap.fromTo(x[showIndicatorNum-1],{x:170, display:"flex"},{opacity:1,display:"flex",x:0,duration:.5, ease: "expo.inOut"},"next");

          } else {
               showIndicatorgsap.fromTo(x[slideNo-1],{x:0, display:"flex"},{opacity:1,x: 170,duration:.5, ease: "expo.inOut"},"next");
               showIndicatorgsap.fromTo(x[showIndicatorNum-1],{x:-170, display:"flex"},{opacity:1,display:"flex",x:0,duration:.5, ease: "expo.inOut"},"next");
          }

          //disclaimer
          showIndicatorgsap.to(z[slideNo-1],{duration:0.75,opacity:0, ease: "power1.inOut"},"next");  
          // showIndicatorgsap.to(ctaClass[slideNo-1],{duration:0.75,opacity:0, ease: "power1.inOut"},"next");  
          showIndicatorgsap.to(ctaClass[slideNo-1],{duration:0.75,opacity:0},"next");  
          showIndicatorgsap.fromTo(z[showIndicatorNum-1],{opacity:0},{duration:.75,display:"flex",opacity:1, ease: "power1.inOut"},"next");    
          // showIndicatorgsap.fromTo(ctaClass[showIndicatorNum-1],{opacity:0},{duration:.75,opacity:1, ease: "power1.inOut"},"next");    
          showIndicatorgsap.fromTo(ctaClass[showIndicatorNum-1],{opacity:0},{duration:.75,opacity:1},"next-=.25");    

     }
     
     //set indicators to display none
     for (j = 0; j < y.length; j++) {
          y[j].style.backgroundColor = "rgba(255, 255, 255, 0.15)";
     }

 
     //set indicator to active
     y[num-1].style.backgroundColor = "rgba(255, 255, 255, 0.50)";


}


// Check Blank Image
function checkBlankImage(element) { return (defaultValues[element].indexOf("blank") !== -1 || defaultValues[element] === "" || defaultValues[element] === null || defaultValues[element] === undefined); }


