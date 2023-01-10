import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task, timeout } from 'ember-concurrency';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { A } from '@ember/array';

export default class LoaderLoaderComponent extends Component {
  @service store;
  @service inputErrorState;
  @tracked queryResult;

  @task
  *getCnpjData(cnpj) {
    this.queryResult = '';

    if (!cnpj || this.args.error) return;
    yield timeout(300);

    try {
      this.queryResult = yield this.store.findRecord('cnpjQuery', cnpj);
    } catch (error) {
      // console.log("error", error) // checar se o tratamento para 404 deve ser feito da mesma forma
      if(error.errors && error.errors[0].status == "429") {
        this.inputErrorState.error = 'Limite de consultas excedido!';
        this.inputErrorState.invalidCnpj = this.args.cnpjId;        
      }
    }
  }
}
