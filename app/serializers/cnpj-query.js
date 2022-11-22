import RESTSerializer from '@ember-data/serializer/rest';

debugger
export default class CnpjQuerySerializer extends RESTSerializer {
  normalizeFindRecordResponse(
    store,
    primaryModelClass,
    payload,
    id,
    requestType
  ) {
    id = payload.legalEntity.id = payload.legalEntity.federalTaxNumber
      .match(/\d/g)
      .join('');

    payload.legalEntity.id = id;
    console.log('payload after', payload);
    console.log(
      'NORMALIZE',
      super.normalizeFindRecordResponse(
        store,
        primaryModelClass,
        payload,
        id,
        requestType
      )
    );

    // return super.normalizeFindRecordResponse(...arguments); talvez o erro estivesse no ...arguments
    // precisa testar se funcioonaria com o serializer antigo porém sem o ...arguments
    return super.normalizeFindRecordResponse(
      store,
      primaryModelClass,
      payload,
      id,
      requestType
    );
  }
}
