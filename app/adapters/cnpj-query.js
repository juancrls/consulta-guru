import RESTAdapter from '@ember-data/adapter/rest';

export default class CnpjQueryAdapter extends RESTAdapter {
  urlForFindRecord(query) {
    query.params.cnpj = query.params.cnpj.match(/\d/g).join('');
    let url = `https://api.nfse.io/LegalEntities/Basicinfo/taxNumber/${query.params.cnpj}`;
    return url;
  }
}
