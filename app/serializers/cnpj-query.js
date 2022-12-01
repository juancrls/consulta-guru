import RESTSerializer from '@ember-data/serializer/rest';

// debugger
export default class CnpjQuerySerializer extends RESTSerializer {
  normalizeFindRecordResponse(
    store,
    primaryModelClass,
    payload,
    id,
    requestType
  ) {
    id = payload.legalEntity.federalTaxNumber.match(/\d/g).join('');
    payload.legalEntity.id = id;

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
