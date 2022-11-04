import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { task, timeout } from 'ember-concurrency';

export default class HeaderHeaderComponent extends Component {
  constructor(...args) {
    super(...args);
  }
  
  @tracked queryResult;
  @tracked cnpjInput;
  @service cnpjQuery;
  @service store;

  @action
  addCnpjInput(e) {
    this.cnpjInput = e.target.value;
    console.log("on input trigger", this.cnpjInput)
  }

  @task
  *getData() { // fake API
    this.queryResult = "";

    let response = yield fetch('/api/data.json');
    let { data } = yield response.json();

    data.map(obj => {
        if(obj.legalEntity.federalTaxNumber.match(/\d/g).join("") == this.cnpjInput.match(/\d/g).join("")) { // remover tratamento com match (usar mask)
            this.queryResult = obj.legalEntity;
        }
        // console.log(Object.keys(obj.legalEntity))
    })
    
    console.log('data received: ', data);
    console.log("actual input: ", this.cnpjInput);
    console.log("data: ", this.queryResult);

    // return parsed;
  }

  // @task
  // *getData() { // for API requests
  //     this.data = yield this.store.findRecord('cnpjQuery', "60.746.948/0001-12").then(res => {
  //         console.log("data", res)
  //     })
  // }
}
