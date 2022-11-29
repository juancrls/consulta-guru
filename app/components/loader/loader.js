import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { A } from '@ember/array';
import { later } from '@ember/runloop';

export default class LoaderLoaderComponent extends Component {
  @service store;

  @tracked queryResult;
  @tracked error = false;

  @tracked dataType = 'mock'; // api - mock

  @task
  *getCnpjData() {
    console.log('RODOU FETCH');

    if (this.args.urlCnpj.length == 14) {
      this.queryResult = '';
      if (this.dataType == 'api') {
        this.queryResult = yield this.store.findRecord(
          'cnpjQuery',
          this.args.urlCnpj
        );
      } else if (this.dataType == 'mock') {
        let response = yield fetch('/api/data.json');
        let { data } = yield response.json();

        if (!data) {
          this.error = `No data found for: ${this.cnpjInput}`;
          return;
        }

        data.map((obj) => {
          if (
            obj.legalEntity.federalTaxNumber.match(/\d/g).join('') ==
            this.args.urlCnpj
          ) {
            this.queryResult = obj.legalEntity;
          }
        });
      }

      if (!this.queryResult) {
        this.error = 'No query result!';
        return;
      }
    } else {
      this.error = 'No valid input inserted!';
      return;
    }
  }
}