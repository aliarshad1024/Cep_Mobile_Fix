const currentEnvir = "dev";  //development = dev, staging = stage, production= prod
const developmentBaseUrl = "http://competitiveexaminationpakistan.com";
const stagingBaseUrl = "http://competitiveexaminationpakistan.com";
const productionBaseUrl = "http://competitiveexaminationpakistan.com";

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
export {baseUrl}