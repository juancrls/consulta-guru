import RESTAdapter from '@ember-data/adapter/rest';
import { inject as service } from '@ember/service';

export default class CnpjQueryAdapter extends RESTAdapter {
  @service queryCnpjNumber;

  urlForFindRecord(query) {
    this.queryCnpjNumber.query = query;
    query = query.match(/\d/g).join('');

    let requestType = 'mock'; // mock - api

    let url = `${
      requestType == 'api'
        ? `https://api.nfse.io/LegalEntities/Basicinfo/taxNumber/${query}`
        : '/api/data.json'
    }`;
    return url;
    // return `${requestType = api ? 'https://api.nfse.io/LegalEntities/Basicinfo/taxNumber/' : '/api/data.json/'} ${query}`
  }
}
