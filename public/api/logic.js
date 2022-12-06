let cnpj = "11.222.333/0001-81"

const verifyCnpj = (cnpj) => {
    if(cnpj.length !== 18) return false // Wrong CNPJ length

    let subscriptionNumber = cnpj.match(/\d{2}.\d{3}.\d{3}/g)[0].replace(/\D/g, "");
    let numOfBranches = cnpj.match(/\d{4}/g)[0];
    let checkerDigits = cnpj.match(/-\d{2}/g)[0].replace(/\D/g, "");

    // if(/1{8}|2{8}|3{8}|4{8}|5{8}|6{8}|7{8}|8{8}|9{8}/g.test(subscriptionNumber)) return false // wrong subscription pattern "00000000"
    if(numOfBranches <= 0) return false // CNPJ needs at least 1 branch

    
    let cnpjForValidateDigits = subscriptionNumber + numOfBranches;
    let checkerDigitsToValidate = "";

    for(let j = 1; j <= 2; j++) {
        let currentCheckerDigit;
        let product = 0;
        for(let i = cnpjForValidateDigits.length + 1; i > 1; i--) {
            let numToAdd;
            if(i > 9) {
                numToAdd = i + 1 - 9;
            } else {
                numToAdd = i;
            }
    
            product += Number(cnpjForValidateDigits.charAt(cnpjForValidateDigits.length + 1 - i)) * numToAdd;
        }
        
        let rest = product % 11;
        if(rest < 2) {
            currentCheckerDigit = 0;
        } else {
            currentCheckerDigit = 11 - rest;
        }
        cnpjForValidateDigits += currentCheckerDigit;
        checkerDigitsToValidate += currentCheckerDigit;
    }
    if(checkerDigits !== checkerDigitsToValidate) return false;
    return true;
}
console.log(verifyCnpj(cnpj))