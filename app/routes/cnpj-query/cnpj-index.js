import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class CnpjQueryCnpjIndexRoute extends Route {
    @service inputErrorState;
    
    model() {
        if(!this.inputErrorState.invalidCnpj && this.inputErrorState.error) {
            this.inputErrorState.error = null;
        }
    }
}
