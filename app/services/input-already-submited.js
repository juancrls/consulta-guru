import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class InputAlreadySubmitedService extends Service {
    @tracked input = "";
}
