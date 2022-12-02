import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task, timeout } from 'ember-concurrency';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { A } from '@ember/array';

export default class LoaderLoaderComponent extends Component {
  @service store;

  @tracked queryResult;
  @tracked error = false;
  @tracked dataType = 'mock'; // api - mock

  @task
  *getCnpjData(cnpj) {
    this.queryResult = null;

    if (!cnpj) return;
    yield timeout(500);
    console.log('RODOU FETCH', cnpj);

    if (cnpj.length == 14) {
      this.queryResult = '';
      if (this.dataType == 'api') {
        this.queryResult = yield this.store.findRecord(
          'cnpjQuery',
          cnpj
        );
        this.error = false;
      } else if (this.dataType == 'mock') {
        let response = yield fetch('/api/data.json');
        let { data } = yield response.json();

        data.map((obj) => {
          if (
            obj.legalEntity.federalTaxNumber.match(/\d/g).join('') ==
            cnpj
          ) {
            this.queryResult = obj.legalEntity;
          }
        });
        this.error = false;
      }

      if (!this.queryResult) {
        this.error = 'No query result!';
        console.log("olha o erro ai", this.error)
        return;
      }
    } else {
      this.error = 'No valid input inserted!';
      return;
    }
    
  }
}
