const currentEnvir = "dev";  //development = dev, staging = stage, production= prod
const developmentBaseUrl = "https://competitiveexaminationpakistan.com";
const stagingBaseUrl = "https://competitiveexaminationpakistan.com";
const productionBaseUrl = "https://competitiveexaminationpakistan.com";

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