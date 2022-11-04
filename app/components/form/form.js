import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class FormFormComponent extends Component {
  constructor(...args) {
    super(...args);
  }

  @action
  async onSubmit(event) {
    event.preventDefault();
  }
}
