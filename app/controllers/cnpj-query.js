import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { task, timeout } from 'ember-concurrency';

export default class CnpjQueryController extends Controller {
    @tracked cnpjInput = "";
    @tracked queryResult;
    @service store;
    
    // User input
    @action 
    addCnpjInput(e) {
        this.cnpjInput = e.target.value;
        console.log("on input trigger", this.cnpjInput)
    }
    // Data 
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