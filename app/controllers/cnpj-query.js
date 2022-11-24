import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { task, timeout } from 'ember-concurrency';

export default class CnpjQueryController extends Controller {
  @tracked hasError = false;
  @tracked cnpjInput = ''; // input cnpj
  @tracked cnpjUrlParam = '';
  @service store;

  

  @action setUrlParam(param) {
    this.cnpjUrlParam = param;
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
  };
  
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
  };
  
  @action adressParser(address) {
    const addressObj = {
      address_p1: `${address.streetSuffix ? address.streetSuffix + ' ' : ''}${
        address.street
      }, ${address.number}`,
      address_p2: `${address.district}, ${address.city.name} - ${address.state}`,
      address_p3: `CEP: ${address.postalCode}`,
    };
  
    return addressObj;
  };
  
  @action legalNatureParser(obj) {
    obj.code = obj.code.replace(/\D+/g, '').match(/(\d{0,3})(\d{0,1})/);
    obj.code = `${obj.code[1]}` + (obj.code[2] ? `-${obj.code[2]}` : ``);
    return `${obj.code} - ${obj.description}`;
  };
  
  @action dateParser(date) {
    return date.toISOString().substring(0, 10).split('-').reverse().join('/');
  };

  @action setErrorStatus(status) {
    this.hasError = status;
  }

  // User input
  @action
  addCnpjInput(e, urlInput = null) {
    let num = '';
    if (!e || urlInput) {
      num = urlInput;
    } else {
      num = e.target.value;
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

    // this.cnpj = this.cnpjInput.match(/\d/g).join(''); // for query param
  }
}

// 00.000.000/0001-91