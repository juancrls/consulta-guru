import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class InputErrorStateService extends Service {
  @tracked error = '';
  @tracked invalidCnpj = '';
  @tracked validWithoutData = false;
}
