import Route from '@ember/routing/route';

export default class CnpjQueryCnpjIdRoute extends Route {
  model(params) {
    return params.cnpj_id;
  }
}
