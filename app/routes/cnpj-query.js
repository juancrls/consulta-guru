import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class CnpjQueryRoute extends Route {
  model(params) {
      console.log('This is the dynamic segment data: ', params.cnpj_id);
      return params.cnpj_id
  }
}
