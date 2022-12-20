import RESTSerializer from '@ember-data/serializer/rest';
import { inject as service } from '@ember/service';

// debugger
export default class CnpjQuerySerializer extends RESTSerializer {
  @service inputErrorState;
  @service inputAlreadySubmited;
  @service queryCnpjNumber;
  @service validateCnpj;
  @service router;

  shareCapitalParser(number) {
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

  economicActivitiesParser(activitiesArr) {
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

  adressParser(address) {
    const addressObj = {
      address_p1: `${address.streetSuffix ? address.streetSuffix + ' ' : ''}${
        address.street
      }, ${address.number}`,
      address_p2: `${address.district}, ${address.city.name} - ${address.state}`,
      address_p3: `CEP: ${address.postalCode}`,
    };

    return addressObj;
  }

  legalNatureParser(obj) {
    obj.code = obj.code.replace(/\D+/g, '').match(/(\d{0,3})(\d{0,1})/);
    obj.code = `${obj.code[1]}` + (obj.code[2] ? `-${obj.code[2]}` : ``);
    return `${obj.code} - ${obj.description}`;
  }

  dateParser(date) {
    return date.toISOString().substring(0, 10).split('-').reverse().join('/');
  }

  normalizeFindRecordResponse(
    store,
    primaryModelClass,
    payload,
    id,
    requestType
  ) {
    if (payload.data && !payload.legalEntity) {
      // if true, data is from mock json (public/api/data.json)
      let data = payload.data;
      let hasData = false;
      console.log('payload.data  ', data);

      data.map((obj, i) => {
        if (hasData) return;

        if (
          obj.legalEntity.federalTaxNumber.match(/\d/g).join('') ==
          this.queryCnpjNumber.query
        ) {
          payload.legalEntity = obj.legalEntity;
          hasData = true;
          return;
        }

        if (data.length - 1 == i && !hasData) {
          this.inputErrorState.error = 'Não há dados para o CNPJ inserido!';
          this.inputErrorState.invalidCnpj = this.queryCnpjNumber.query;
          payload.legalEntity = null;
          return;
        }
      });
    }

    if(!payload.legalEntity) {
      throw this.inputErrorState.error;
    }

    id = payload.legalEntity.federalTaxNumber.match(/\d/g).join('');
    payload.legalEntity.id = id;

    if (!payload.legalEntity) {
      this.formattedData = null;
      this.inputErrorState.error = 'Não há dados para o CNPJ inserido!';
      this.inputErrorState.invalidCnpj = this.queryCnpjNumber.query;
      return;
    }

    payload.legalEntity.economicActivities = this.economicActivitiesParser(
      payload.legalEntity.economicActivities
    );

    payload.legalEntity.shareCapital = this.shareCapitalParser(
      payload.legalEntity.shareCapital
    );

    payload.legalEntity.address = this.adressParser(
      payload.legalEntity.address
    );

    payload.legalEntity.legalNature = this.legalNatureParser(
      payload.legalEntity.legalNature
    );

    payload.legalEntity.openedOn = this.dateParser(
      new Date(payload.legalEntity.openedOn)
    );

    payload.legalEntity.email = payload.legalEntity.email.toLowerCase();

    payload[primaryModelClass.modelName] = payload.legalEntity;
    delete payload.legalEntity;
    
    return super.normalizeFindRecordResponse(
      store,
      primaryModelClass,
      payload,
      id,
      requestType
    );
  }
}
