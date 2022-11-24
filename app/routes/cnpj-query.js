import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class CnpjQueryRoute extends Route {
  model(params) {
      return params.cnpj_id
  }
}
