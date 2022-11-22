import RESTSerializer from '@ember-data/serializer/rest';

export default class CnpjQuerySerializer extends RESTSerializer {
  normalizeFindRecordResponse(store, primaryModelClass, payload, id, requestType) {
    payload.legalEntity.id = payload.legalEntity.federalTaxNumber.match(/\d/g).join('');;
    
    console.log("passou 3", payload)
    return super.normalizeFindRecordResponse(...arguments);
  }
}
