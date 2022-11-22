import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task } from "ember-concurrency";
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { A } from '@ember/array';

export default class LoaderLoaderComponent extends Component {
    @service store;

    @action async load() {
        let response = await this.store.findRecord('cnpjQuery', '00000000000191', {reload: true});
        console.log('passou 2', response);
        return response;
        // return await this.store.findRecord('cnpjQuery', '00000000000191');
    }
}
