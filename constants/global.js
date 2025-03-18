const currentEnvir = "dev";  //development = dev, staging = stage, production= prod
const developmentBaseUrl = "http://competitiveexaminationpakistan.com";
const stagingBaseUrl = "http://competitiveexaminationpakistan.com";
const productionBaseUrl = "http://competitiveexaminationpakistan.com";

const admobAdBanner="ca-app-pub-6153295999412289/4339293190"
const admobAppOpen="ca-app-pub-6153295999412289/3325594426"
const admobInterestial="ca-app-pub-6153295999412289/6306733561"
const admobRewarded="ca-app-pub-6153295999412289/2159852413"
const admobRewardedInterestial="ca-app-pub-6153295999412289/6343202058"


const admobTestAdBanner="ca-app-pub-3940256099942544/6300978111"
const admobTestAppOpen="ca-app-pub-3940256099942544/3419835294"
const admobTestInterestial="ca-app-pub-3940256099942544/1033173712"
const admobTestRewarded="ca-app-pub-3940256099942544/5224354917"


let _baseUrl = "";
switch(currentEnvir){
    case "dev":
        _baseUrl = developmentBaseUrl;
        break;
    case "stage":
        _baseUrl = stagingBaseUrl;
        break;
    case "prod":
        _baseUrl = productionBaseUrl;

}


const baseUrl = _baseUrl
export {baseUrl, admobAdBanner, admobAppOpen, admobInterestial, admobRewarded, admobTestRewarded, admobRewardedInterestial}