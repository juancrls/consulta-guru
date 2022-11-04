import RESTSerializer from '@ember-data/serializer/rest';

export default class CnpjQuerySerializer extends RESTSerializer {
  normalizeFindRecordResponse(
    store,
    primaryModelClass,
    payload,
    id,
    requestType
  ) {
    id = payload.legalEntity.federalTaxNumber.match(/\d/g).join('');

    payload = {
      cnpjQuery: payload,
    };

    payload.cnpjQuery.id = id;
    return super.normalizeFindRecordResponse(...arguments);
  }
}
