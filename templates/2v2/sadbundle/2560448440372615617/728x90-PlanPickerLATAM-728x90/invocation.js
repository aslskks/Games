var creativeSize = `${template.width}x${template.height}`; // Set the width and height of the ad.
var devDynamicContent = {}; // Variable for studio invocation code.
function exitCall() {
    var activeNow = document.querySelector('.active').id;
    var caseIndex=slideIndex;

    if(activeNow=="pill-yearly") {
        caseIndex=slideIndex+3;
    }

    switch (caseIndex) {
        case 1: Enabler.exitOverride("Frame 1 Clickthrough", defaultValues.frame1Overlay+Adlib.utmParser(defaultValues.uiElement4)); break;
        case 2: Enabler.exitOverride("Frame 2 Clickthrough", defaultValues.frame2Overlay+Adlib.utmParser(defaultValues.uiElement4)); break;
        case 3: Enabler.exitOverride("Frame 3 Clickthrough", defaultValues.frame3Overlay+Adlib.utmParser(defaultValues.uiElement4)); break;
        case 4: Enabler.exitOverride("Frame 4 Clickthrough", defaultValues.frame4Overlay+Adlib.utmParser(defaultValues.uiElement4)); break;
        case 5: Enabler.exitOverride("Frame 5 Clickthrough", defaultValues.frame5Overlay+Adlib.utmParser(defaultValues.uiElement4)); break;
        case 6: Enabler.exitOverride("Frame 6 Clickthrough", defaultValues.frame6Overlay+Adlib.utmParser(defaultValues.uiElement4)); break;
    }
}
var videoCuePoint = [
  //"cuePoint:funcName" ex. "1:firstAninmation" please do not included the parenthesis after the function name.
]
function initDynamic() {
  if (checkEnvironment() === 'tools') {
    for (var i=0;i<Object.keys(defaultValues).length;i++) {
      Object.keys(defaultValues)[i];
    }
  } else {
    // paste studio invocation code here, and delete the devDynamicContent declaration as it is already declared outside this function.
    Enabler.setProfileId(10943601);

    devDynamicContent.REBRAND__PLAN_PICKER_LATAM__MEX_Sheet1 = [{}];
    devDynamicContent.REBRAND__PLAN_PICKER_LATAM__MEX_Sheet1[0]._id = 0;
    devDynamicContent.REBRAND__PLAN_PICKER_LATAM__MEX_Sheet1[0].id = "076380fc-2446-447a-a959-cb6403928d4a";
    devDynamicContent.REBRAND__PLAN_PICKER_LATAM__MEX_Sheet1[0].Reporting_Label = "b955b129-04f6-420d-9a4c-ccceb8535027-129ac634-b11e-49f8-a60c-48a0c810a4c1-7383adff-9286-4e91-95ac-b9948647f9bb-8CVZFHJ21G-e812f1a6-bc44-44f4-9004-200130b85830-7f4e995cc4231e774ee9ac4a33651e706fd9b9785f63462c156cf717b0e54a54";
    devDynamicContent.REBRAND__PLAN_PICKER_LATAM__MEX_Sheet1[0].Variant_name = "May 2025 Plan Picker Multi - TLOU S2, HPC, Kraven";
    devDynamicContent.REBRAND__PLAN_PICKER_LATAM__MEX_Sheet1[0].Active = false;
    devDynamicContent.REBRAND__PLAN_PICKER_LATAM__MEX_Sheet1[0].isDefault = false;
    devDynamicContent.REBRAND__PLAN_PICKER_LATAM__MEX_Sheet1[0].logo = {};
    devDynamicContent.REBRAND__PLAN_PICKER_LATAM__MEX_Sheet1[0].logo.Url = "https://app.smartly.io/warren/images/637df0fd-e736-44bc-8a7c-c7db963a32d4/blob?Max Logo.png";
    devDynamicContent.REBRAND__PLAN_PICKER_LATAM__MEX_Sheet1[0].legal = "Aplican t&eacute;rminos.";
    devDynamicContent.REBRAND__PLAN_PICKER_LATAM__MEX_Sheet1[0].legal2 = "Aplican t&eacute;rminos.";
    devDynamicContent.REBRAND__PLAN_PICKER_LATAM__MEX_Sheet1[0].legal3 = "Aplican t&eacute;rminos.";
    devDynamicContent.REBRAND__PLAN_PICKER_LATAM__MEX_Sheet1[0].bgMask1 = "Mensual";
    devDynamicContent.REBRAND__PLAN_PICKER_LATAM__MEX_Sheet1[0].bgMask2 = "Anual";
    devDynamicContent.REBRAND__PLAN_PICKER_LATAM__MEX_Sheet1[0].bgMask3 = "Elige tu plan";
    devDynamicContent.REBRAND__PLAN_PICKER_LATAM__MEX_Sheet1[0].bgMask4 = "Disfruta y ahorra";
    devDynamicContent.REBRAND__PLAN_PICKER_LATAM__MEX_Sheet1[0].ctaText = "<span style=\"color: #ffffff;\">Seleccionar Plan<\/span>";
    devDynamicContent.REBRAND__PLAN_PICKER_LATAM__MEX_Sheet1[0].trigger = "Three Shows (Default)";
    devDynamicContent.REBRAND__PLAN_PICKER_LATAM__MEX_Sheet1[0].baseImage = {};
    devDynamicContent.REBRAND__PLAN_PICKER_LATAM__MEX_Sheet1[0].baseImage.Url = "https://app-direct.smartly.io/matrix/_blank.png";
    devDynamicContent.REBRAND__PLAN_PICKER_LATAM__MEX_Sheet1[0].ctaColor1 = "#8298ab5C";
    devDynamicContent.REBRAND__PLAN_PICKER_LATAM__MEX_Sheet1[0].baseImage2 = {};
    devDynamicContent.REBRAND__PLAN_PICKER_LATAM__MEX_Sheet1[0].baseImage2.Url = "https://app.smartly.io/warren/images/293f9143-8166-45dd-8932-81c0c21b8168/blob?SPA_MULTI3_01_TLOU2_970X250.png";
    devDynamicContent.REBRAND__PLAN_PICKER_LATAM__MEX_Sheet1[0].baseImage3 = {};
    devDynamicContent.REBRAND__PLAN_PICKER_LATAM__MEX_Sheet1[0].baseImage3.Url = "https://app-direct.smartly.io/matrix/_blank.png";
    devDynamicContent.REBRAND__PLAN_PICKER_LATAM__MEX_Sheet1[0].baseImage4 = {};
    devDynamicContent.REBRAND__PLAN_PICKER_LATAM__MEX_Sheet1[0].baseImage4.Url = "https://app.smartly.io/warren/images/4ba0771f-5999-4894-b013-1af5a5f8f7a3/blob?SPA_MULTI3_02_HARRY_POTTER_970X250.png";
    devDynamicContent.REBRAND__PLAN_PICKER_LATAM__MEX_Sheet1[0].baseImage5 = {};
    devDynamicContent.REBRAND__PLAN_PICKER_LATAM__MEX_Sheet1[0].baseImage5.Url = "https://app-direct.smartly.io/matrix/_blank.png";
    devDynamicContent.REBRAND__PLAN_PICKER_LATAM__MEX_Sheet1[0].baseImage6 = {};
    devDynamicContent.REBRAND__PLAN_PICKER_LATAM__MEX_Sheet1[0].baseImage6.Url = "https://app.smartly.io/warren/images/488a5ba9-c4ce-475a-80e0-8123874b9c46/blob?SPA_MULTI3_03_KRAVEN_970X250.jpg";
    devDynamicContent.REBRAND__PLAN_PICKER_LATAM__MEX_Sheet1[0].uiElement1 = "#040F44";
    devDynamicContent.REBRAND__PLAN_PICKER_LATAM__MEX_Sheet1[0].uiElement2 = "0";
    devDynamicContent.REBRAND__PLAN_PICKER_LATAM__MEX_Sheet1[0].uiElement3 = "#040F44";
    devDynamicContent.REBRAND__PLAN_PICKER_LATAM__MEX_Sheet1[0].uiElement4 = "?utm_source=dv360&utm_medium=paid-display&utm_id=cm|dynamicCampaignIdUTM|dynamicSiteIdUTM|dynamicPlacementIdUTM|dynamicCreativeIdUTM";
    devDynamicContent.REBRAND__PLAN_PICKER_LATAM__MEX_Sheet1[0].frame1Image = {};
    devDynamicContent.REBRAND__PLAN_PICKER_LATAM__MEX_Sheet1[0].frame1Image.Url = "https://app.smartly.io/warren/images/ff7925e5-037e-4150-a4c8-356511306f04/variations/9febb4aa-19a0-45c7-a8cb-4c83f143ec0a/blob?728x90_Frame%201%20Background%402x_970x250_2.png";
    devDynamicContent.REBRAND__PLAN_PICKER_LATAM__MEX_Sheet1[0].CreativeName = "May 2025 Plan Picker Multi - TLOU S2, HPC, Kraven_970x250";
    devDynamicContent.REBRAND__PLAN_PICKER_LATAM__MEX_Sheet1[0].URL_Parameter = "";
    devDynamicContent.REBRAND__PLAN_PICKER_LATAM__MEX_Sheet1[0].frame1Overlay = {};
    devDynamicContent.REBRAND__PLAN_PICKER_LATAM__MEX_Sheet1[0].frame1Overlay.Url = "https://auth.max.com/product";
    devDynamicContent.REBRAND__PLAN_PICKER_LATAM__MEX_Sheet1[0].frame2Overlay = {};
    devDynamicContent.REBRAND__PLAN_PICKER_LATAM__MEX_Sheet1[0].frame2Overlay.Url = "https://auth.max.com/product";
    devDynamicContent.REBRAND__PLAN_PICKER_LATAM__MEX_Sheet1[0].frame3Overlay = {};
    devDynamicContent.REBRAND__PLAN_PICKER_LATAM__MEX_Sheet1[0].frame3Overlay.Url = "https://auth.max.com/product";
    devDynamicContent.REBRAND__PLAN_PICKER_LATAM__MEX_Sheet1[0].frame4Overlay = {};
    devDynamicContent.REBRAND__PLAN_PICKER_LATAM__MEX_Sheet1[0].frame4Overlay.Url = "https://auth.max.com/product";
    devDynamicContent.REBRAND__PLAN_PICKER_LATAM__MEX_Sheet1[0].frame5Overlay = {};
    devDynamicContent.REBRAND__PLAN_PICKER_LATAM__MEX_Sheet1[0].frame5Overlay.Url = "https://auth.max.com/product";
    devDynamicContent.REBRAND__PLAN_PICKER_LATAM__MEX_Sheet1[0].frame6Overlay = {};
    devDynamicContent.REBRAND__PLAN_PICKER_LATAM__MEX_Sheet1[0].frame6Overlay.Url = "https://auth.max.com/product";
    devDynamicContent.REBRAND__PLAN_PICKER_LATAM__MEX_Sheet1[0].customVariable = "C139380_SPA_MULTI_MLT_PLP_SUPN_ANB_970X250_DCO_TLOUS2HPCKTH MX";
    devDynamicContent.REBRAND__PLAN_PICKER_LATAM__MEX_Sheet1[0].frame1Headline = "B&aacute;sico con anuncios";
    devDynamicContent.REBRAND__PLAN_PICKER_LATAM__MEX_Sheet1[0].frame2Headline = "Est&aacute;ndar";
    devDynamicContent.REBRAND__PLAN_PICKER_LATAM__MEX_Sheet1[0].frame3Headline = "Platino";
    devDynamicContent.REBRAND__PLAN_PICKER_LATAM__MEX_Sheet1[0].frame4Headline = "B&aacute;sico con anuncios";
    devDynamicContent.REBRAND__PLAN_PICKER_LATAM__MEX_Sheet1[0].frame5Headline = "Est&aacute;ndar";
    devDynamicContent.REBRAND__PLAN_PICKER_LATAM__MEX_Sheet1[0].frame6Headline = "Platino";
    devDynamicContent.REBRAND__PLAN_PICKER_LATAM__MEX_Sheet1[0].customVariable2 = "May 2025 Plan Picker Multi - TLOU S2, HPC, Kraven";
    devDynamicContent.REBRAND__PLAN_PICKER_LATAM__MEX_Sheet1[0].customVariable3 = "";
    devDynamicContent.REBRAND__PLAN_PICKER_LATAM__MEX_Sheet1[0].customVariable4 = "";
    devDynamicContent.REBRAND__PLAN_PICKER_LATAM__MEX_Sheet1[0].customVariable5 = "";
    devDynamicContent.REBRAND__PLAN_PICKER_LATAM__MEX_Sheet1[0].frame1Headline2 = "<span style=\"color: #9d9d9d;\">Resoluci&oacute;n Full HD<\/span>";
    devDynamicContent.REBRAND__PLAN_PICKER_LATAM__MEX_Sheet1[0].frame1Headline3 = "$149.00\/mes";
    devDynamicContent.REBRAND__PLAN_PICKER_LATAM__MEX_Sheet1[0].frame2Headline2 = "<span style=\"color: #9d9d9d;\">2 dispositivos a la vez<\/span>";
    devDynamicContent.REBRAND__PLAN_PICKER_LATAM__MEX_Sheet1[0].frame2Headline3 = "$199.00\/mes";
    devDynamicContent.REBRAND__PLAN_PICKER_LATAM__MEX_Sheet1[0].frame3Headline2 = "<span style=\"color: #9d9d9d;\">4 dispositivos a la vez<\/span>";
    devDynamicContent.REBRAND__PLAN_PICKER_LATAM__MEX_Sheet1[0].frame3Headline3 = "$249.00\/mes";
    devDynamicContent.REBRAND__PLAN_PICKER_LATAM__MEX_Sheet1[0].frame4Headline2 = "<span style=\"color: #9d9d9d;\">Resoluci&oacute;n Full HD<\/span>";
    devDynamicContent.REBRAND__PLAN_PICKER_LATAM__MEX_Sheet1[0].frame4Headline3 = "12x $99\/mes";
    devDynamicContent.REBRAND__PLAN_PICKER_LATAM__MEX_Sheet1[0].frame5Headline2 = "<span style=\"color: #9d9d9d;\">2 dispositivos a la vez<\/span>";
    devDynamicContent.REBRAND__PLAN_PICKER_LATAM__MEX_Sheet1[0].frame5Headline3 = "12x $149\/mes";
    devDynamicContent.REBRAND__PLAN_PICKER_LATAM__MEX_Sheet1[0].frame6Headline2 = "<span style=\"color: #9d9d9d;\">4 dispositivos a la vez<\/span>";
    devDynamicContent.REBRAND__PLAN_PICKER_LATAM__MEX_Sheet1[0].frame6Headline3 = "12x $199\/mes";
    devDynamicContent.REBRAND__PLAN_PICKER_LATAM__MEX_Sheet1[0].frame1Background = {};
    devDynamicContent.REBRAND__PLAN_PICKER_LATAM__MEX_Sheet1[0].frame1Background.Url = "https://dyle7zu5kwqf5.cloudfront.net/cf6c02d3-5be1-45f3-a8b3-8a429f881d72/Frame1BG.png";
    devDynamicContent.REBRAND__PLAN_PICKER_LATAM__MEX_Sheet1[0].frame1Subheadline = "";
    devDynamicContent.REBRAND__PLAN_PICKER_LATAM__MEX_Sheet1[0].frame1Subheadline2 = "";
    devDynamicContent.REBRAND__PLAN_PICKER_LATAM__MEX_Sheet1[0].frame1Subheadline3 = "";
    Enabler.setDevDynamicContent(devDynamicContent);

    Adlib.assignInvocationCode(); // DO NOT DELETE THIS CODE, This will automatically assign invocation code to defaultValues
  }
}
function populate() {
  //Adlib.preloadDelay = 100;
  //Adlib.fpsSettings(60); // uncomment this if you want to change the FPS used in the creative          
  Adlib.populateElements(); // DO NOT DELETE THIS. automatically assign the defaultValues to the elements within the ad.
  /*****************************************
  If you need to manually assign a defaultValue to a style of an element, add it below.
  *****************************************/
};