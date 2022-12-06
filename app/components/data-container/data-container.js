import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { task, timeout } from 'ember-concurrency';

export default class DataContainerDataContainerComponent extends Component {
  @tracked cnpjInput = ''; // input cnpj
  @tracked cnpjInputId = this.args.cnpjId; // input cnpj for did-update
  @tracked error;

  @tracked formattedData = null;
  @service store;
  @service router;
  constructor(...args) {
    super(...args);
    if (this.args.cnpjId) {
      this.formattedData = null;
      this.addCnpjInput(null, this.args.cnpjId); // if the url contains a cnpjId, it will add on the input text area
      
      // if(!this.validateCnpj(this.cnpjInput)) {
      //   this.error = "CNPJ inválido inserido";
      //   return;
      // } else {
      //   this.error = null;
      // }
    }
  }

  @action shareCapitalParser(number) {
    let shareCapital = number.toString().split('.');

    let capital = shareCapital[0];
    let rest = shareCapital[1];

    return (
      capital
        .split('')
        .reverse()
        .map((n, i) => {
          if (i == 0) return n;
          return i % 3 == 0 ? n + '.' : n;
        })
        .reverse()
        .join('') + `,${rest ? rest : '00'}`
    );
  }

  @action economicActivitiesParser(activitiesArr) {
    const parsedActivitiesArr = activitiesArr.map((e) => {
      e.code = e.code.replace(/\D+/g, '').match(/(\d{0,4})(\d{0,1})(\d{0,2})/);

      e.code =
        `${e.code[1]}` +
        (e.code[2] ? `-${e.code[2]}` : ``) +
        (e.code[3] ? `/${e.code[3]}` : ``);

      return e;
    });

    const activitiesObj = {
      main: parsedActivitiesArr.filter((e) => e.isMain),
      secondary: parsedActivitiesArr.filter((e) => !e.isMain),
    };
    return activitiesObj;
  }

  @action adressParser(address) {
    const addressObj = {
      address_p1: `${address.streetSuffix ? address.streetSuffix + ' ' : ''}${
        address.street
      }, ${address.number}`,
      address_p2: `${address.district}, ${address.city.name} - ${address.state}`,
      address_p3: `CEP: ${address.postalCode}`,
    };

    return addressObj;
  }

  @action legalNatureParser(obj) {
    obj.code = obj.code.replace(/\D+/g, '').match(/(\d{0,3})(\d{0,1})/);
    obj.code = `${obj.code[1]}` + (obj.code[2] ? `-${obj.code[2]}` : ``);
    return `${obj.code} - ${obj.description}`;
  }

  @action dateParser(date) {
    return date.toISOString().substring(0, 10).split('-').reverse().join('/');
  }

  // User input
  @action
  addCnpjInput(e, urlInput = null) {
    let num = '';
    if (!e && urlInput) {
      num = urlInput;
    } else if (e) {
      num = e.target.value;
    } else {
      return;
    }

    num = num
      .replace(/\D+/g, '')
      .match(/(\d{0,2})(\d{0,3})(\d{0,3})(\d{0,4})(\d{0,2})/);

    this.cnpjInput =
      `${num[1]}` +
      (num[2] ? `.${num[2]}` : ``) +
      (num[3] ? `.${num[3]}` : ``) +
      (num[4] ? `/${num[4]}` : ``) +
      (num[5] ? `-${num[5]}` : ``);
  }

  @action validateCnpj(cnpj) {
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

  @action onSubmit() {
    if(!this.validateCnpj(this.cnpjInput)) {
      this.error = "CNPJ inválido inserido";
      return;
    } else {
      this.error = null;
    }

    // if(this.cnpjInput.match(/\d/g).join('') == this.args.cnpjId) return; // will avoid multiple consecutive requests for the same cnpj
    
    if(this.cnpjInput) {
      this.cnpjInputId = this.cnpjInput.match(/\d/g).join(''); // will activate did-update and run the fetch function
    }
  }

  @action dataParser(dataObject) {
    if(this.cnpjInput.match(/\d/g).join('') == this.args.cnpjId && this.error) {
      // this.formattedData = null;
      // console.log("data RESETADA (2)")
    }

    if (!dataObject) return;

    this.formattedData = dataObject;
    this.formattedData.economicActivities = this.economicActivitiesParser(
      dataObject.economicActivities
    );

    this.formattedData.shareCapital = this.shareCapitalParser(
      dataObject.shareCapital
    );

    this.formattedData.address = this.adressParser(dataObject.address);

    this.formattedData.legalNature = this.legalNatureParser(
      dataObject.legalNature
    );
    this.formattedData.openedOn = this.dateParser(
      new Date(dataObject.openedOn)
    );
    this.formattedData.email = dataObject.email.toLowerCase();
    return this.formattedData;
  }
}
