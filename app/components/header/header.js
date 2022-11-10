import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { task, timeout } from 'ember-concurrency';

export default class HeaderHeaderComponent extends Component {
  @tracked headerIsFixed = false;

  constructor(...args) {
    super(...args);

    window.onscroll = () => {
      this.headerIsFixed = window.scrollY >= 95 ? true : false;
    };

    // window.onscroll = () => {
    //   if (this.scrolling === false) {
    //     this.scrolling = true;
    //     setTimeout(() => {
    //       if (window.scrollY >= 50) {
    //         this.fixedHeader = true;
    //       } else {
    //         this.fixedHeader = false;
    //       }
    //       this.scrolling = false;
    //     }, 100);
    //   }
    // };
  }
}
