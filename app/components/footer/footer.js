import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class FooterFooterComponent extends Component {
  @action addClickListener() {
    let linkContainers = document.querySelectorAll(".footer-link-title");
    let buttons = document.querySelectorAll(".footer-link-title-button");

    for(let i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener("click", () => {
        linkContainers[i].classList.toggle("closed");
      })
    }
  }
}