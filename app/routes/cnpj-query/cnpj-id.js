import Route from '@ember/routing/route';

export default class CnpjQueryCnpjIdRoute extends Route {
  model(params) {
    return params.cnpj_id;
  }

  setupController(controller, ...args) {
    super.setupController(controller, ...args);
    let cnpjId = args[0];
    controller.cnpjId = cnpjId;
  }
}
