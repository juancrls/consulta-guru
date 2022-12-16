import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class TextAreaTextAreaComponent extends Component {
  @action addSubmitListener() {
    let input = document.getElementById("cnpj-input")

    input.addEventListener("keypress", function(event) {
      if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("submit-button").click();
      }
    });
  }
}
