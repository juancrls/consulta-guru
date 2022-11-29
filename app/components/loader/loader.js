import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task } from "ember-concurrency";
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { A } from '@ember/array';
import { later } from '@ember/runloop';

export default class LoaderLoaderComponent extends Component {
    constructor(...args) {
			super(...args)
      console.log("entrou no controller")

			if(this.args.urlCnpj) {
					this.addCnpjInput(null, this.args.urlCnpj);
					this.getCnpjData.perform();
			}
    }
    @service store
    @service router;
    @tracked isLoading = false;

    @tracked queryResult;
    @tracked error = false;

    @tracked dataType = "mock"; // api - mock
    @tracked oldInput;

    changeLoadingStatus = () => this.loading = false;
    

    @task
    *getCnpjData() {
      if(this.args.cnpjInput == this.oldInput || this.isLoading) return;
			
			console.log(this.isLoading)
      if (this.args.cnpjInput.length == 18) {
        this.queryResult = '';
        if(this.dataType == "api") {
            this.queryResult = yield this.store.findRecord('cnpjQuery', this.args.cnpjInput.match(/\d/g).join(''));
        } else if(this.dataType == "mock") {

            let response = yield fetch('/api/data.json');
            let { data } = yield response.json();
    
            if (!data) {
                console.log("No data found for: ", this.cnpjInput)
                this.error = true;
                return;
            }

            data.map((obj) => {
                if (obj.legalEntity.federalTaxNumber.match(/\d/g).join('') == this.args.cnpjInput.match(/\d/g).join('')) {
									this.queryResult = obj.legalEntity;
                }
            });
        }
        console.log('Query result', {
            "dataType": this.dataType,
            "response": this.queryResult ? this.queryResult : "No data found!"
        })
  
        if (!this.queryResult) {
          console.log("No query result!")
          this.error = true;
          return;
        }
  
      } else {
        console.log("No valid input inserted!")
        this.error = true;
        return;
      }

      this.router.transitionTo(`/cnpj-query/${this.args.cnpjInput.match(/\d/g).join('')}`)
			this.oldInput = this.args.cnpjInput;
    }
}
