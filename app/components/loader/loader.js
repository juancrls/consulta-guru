import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task, timeout } from 'ember-concurrency';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { A } from '@ember/array';

export default class LoaderLoaderComponent extends Component {
  @service store;

  @tracked queryResult;
  @tracked dataType = 'mock'; // api - mock

  @task
  *getCnpjData(cnpj) {
    this.queryResult = '';

    if (!cnpj || this.args.error) return;
    yield timeout(500);

    if (this.dataType == 'api') {
      this.queryResult = yield this.store.findRecord('cnpjQuery', cnpj);
    } else if (this.dataType == 'mock') {
      let response = yield fetch('/api/data.json');
      let { data } = yield response.json();

      let hasData = false;
      data.map((obj, i) => {
        if (hasData) return;

        if (obj.legalEntity.federalTaxNumber.match(/\d/g).join('') == cnpj) {
          this.queryResult = obj.legalEntity;
          hasData = true;
          return;
        }

        if (data.length - 1 == i && !hasData) {
          this.queryResult = null;
          return;
        }
      });
    }
  }
}
