import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { task, timeout } from 'ember-concurrency';

export default class CnpjQueryCnpjIndexController extends Controller {
  @service router;

  @action updateUrl(cnpjId, data, error) {
    this.router.transitionTo(`/consultar-cnpj-gratis/${cnpjId}`);
  }
}
