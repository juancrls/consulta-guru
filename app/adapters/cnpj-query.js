import RESTAdapter from '@ember-data/adapter/rest';

export default class CnpjQueryAdapter extends RESTAdapter {
  urlForFindRecord(query) {
    console.log('adapter - query', query);
    query = query.match(/\d/g).join('');
    let url = `https://api.nfse.io/LegalEntities/Basicinfo/taxNumber/${query}`;
    return url;
  }
}
