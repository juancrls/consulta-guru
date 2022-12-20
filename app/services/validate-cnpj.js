import Service from '@ember/service';
import { action } from '@ember/object';

export default class ValidateCnpjService extends Service {

  @action validateCnpj(cnpj) {
    if (cnpj.length !== 14) return false; // Wrong CNPJ length
  
    let subscriptionNumber = cnpj.substring(0, 8);
    let numOfBranches = cnpj.substring(8, 12);
    let checkerDigits = cnpj.substring(12, 14);
    
    if (numOfBranches <= 0) return false; // CNPJ needs at least 1 branch
  
    let cnpjForValidateDigits = subscriptionNumber + numOfBranches;
    let checkerDigitsToValidate = '';
  
    for (let j = 1; j <= 2; j++) {
      let currentCheckerDigit;
      let product = 0;
      for (let i = cnpjForValidateDigits.length + 1; i > 1; i--) {
        let numToAdd;
        if (i > 9) {
          numToAdd = i + 1 - 9;
        } else {
          numToAdd = i;
        }
  
        product +=
          Number(
            cnpjForValidateDigits.charAt(cnpjForValidateDigits.length + 1 - i)
          ) * numToAdd;
      }
  
      let rest = product % 11;
      if (rest < 2) {
        currentCheckerDigit = 0;
      } else {
        currentCheckerDigit = 11 - rest;
      }
      cnpjForValidateDigits += currentCheckerDigit;
      checkerDigitsToValidate += currentCheckerDigit;
    }
    if (checkerDigits !== checkerDigitsToValidate) return false;
    return true;
  };
}
