import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class QueryCnpjNumberService extends Service {
  @tracked query;
}
