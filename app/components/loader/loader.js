import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task } from "ember-concurrency";
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { A } from '@ember/array';

export default class LoaderLoaderComponent extends Component {
    @service store
    @tracked cnpjData;
    @tracked isLoading = false;
    @tracked queryResult;
    @tracked dataType = "mock"; // api - mock

    changeLoadingStatus = () => this.loading = false;

    @task
    *getCnpjData() {
      if (this.args.cnpjInput.length == 18) {
        this.queryResult = '';
        if(this.dataType == "api") {
            this.queryResult = yield this.store.findRecord('cnpjQuery', this.args.cnpjInput.match(/\d/g).join(''));
        } else if(this.dataType == "mock") {
            let response = yield fetch('/api/data.json');
            let { data } = yield response.json();
    
            if (!data) {
                console.log("No data found for: ", this.cnpjInput)
                this.args.setErrorStatus(true);
                return;
            }

            data.map((obj) => {
                if (obj.legalEntity.federalTaxNumber.match(/\d/g).join('') == this.args.cnpjInput.match(/\d/g).join('')) {
                    this.queryResult = obj.legalEntity;
                }
            });
        }
        console.log('query result', {
            "dataType": this.dataType,
            "response": this.queryResult ? this.queryResult : "No data found!"
        })
  
        if (!this.queryResult) {
            console.log("No query result!")
          this.args.setErrorStatus(true);
          return;
        }
  
        const processedData = this.queryResult;

        processedData.economicActivities = this.args.economicActivitiesParser(
          this.queryResult.economicActivities
        );

        processedData.shareCapital = this.args.shareCapitalParser(
          this.queryResult.shareCapital
        );

        processedData.address = this.args.adressParser(this.queryResult.address);

        processedData.legalNature = this.args.legalNatureParser(
          this.queryResult.legalNature
        );
        processedData.openedOn = this.args.dateParser(new Date(this.queryResult.openedOn));
        processedData.email = this.queryResult.email.toLowerCase();
  
        this.queryResult = processedData;
        this.args.setErrorStatus(false);
      } else {
        console.log("No input inserted!")
        this.args.setErrorStatus(true);
        return;
      }
    }


    @task *load() {
        this.isLoading = true;
        let query = "00000000000191";
        
        this.cnpjData = yield this.store.findRecord("cnpjQuery", query).then(changeLoadingStatus);

        return this.cnpjData;
    }
}
