import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { task, timeout } from 'ember-concurrency';

export default class DataContainerDataContainerComponent extends Component {
  @tracked cnpjInput = ''; // input cnpj
  @tracked cnpjInputId = this.args.cnpjId; // input cnpj for did-update

  @service store;
  @service inputErrorState;
  @service validateCnpj;

  constructor(...args) {
    super(...args);
    this.addCnpjInput(null, this.args.cnpjId); // if the url contains a cnpjId, it will add on the input text area

    if (this.args.cnpjId && !this.validateCnpj.validateCnpj(this.cnpjInputId.match(/\d/g).join(''))) {
      this.inputErrorState.error = 'CNPJ inválido inserido';
      this.inputErrorState.invalidCnpj = this.args.cnpjId;
      return;
    } else {
      this.inputErrorState.error = null;
      this.inputErrorState.invalidCnpj = null;
    }
  }

  // User input
  @action
  addCnpjInput(e, urlInput = null) {
    let num = '';
    if (!e && urlInput) {
      num = urlInput;
    } else if (e) {
      num = e.target.value;
    } else {
      return;
    }
    
    num = num
      .replace(/\D+/g, '')
      .match(/(\d{0,2})(\d{0,3})(\d{0,3})(\d{0,4})(\d{0,2})/);
      
      this.cnpjInput =
      `${num[1]}` +
      (num[2] ? `.${num[2]}` : ``) +
      (num[3] ? `.${num[3]}` : ``) +
      (num[4] ? `/${num[4]}` : ``) +
      (num[5] ? `-${num[5]}` : ``);

      if(this.cnpjInput.length == 18) { // will submit if user enter all CNPJ digits
        this.onSubmit();
      }
  }

  @tracked alreadySubInput;

  @action onSubmit() {
    if (!this.cnpjInput) return;
    let formattedCnpj = this.cnpjInput.match(/\d/g).join('');
    this.alreadySubInput = this.cnpjInputId;
    
    if (!this.validateCnpj.validateCnpj(formattedCnpj)) {
      this.inputErrorState.error = 'CNPJ inválido inserido';
      // return;
    } else {
      if(this.alreadySubInput != formattedCnpj) { // to avoid bugs with valid CNPJ without data
        this.inputErrorState.validWithoutData = false;
      }

      if(this.inputErrorState.validWithoutData == true) {
        return;
      } else {
        this.inputErrorState.error = null;
      }
    }

    if (this.alreadySubInput == formattedCnpj) return; // will avoid multiple consecutive requests for the same cnpj

    if (this.cnpjInput) {
      console.log('alterou e chamou load')
      this.cnpjInputId = formattedCnpj; // will activate did-update and run the fetch function
    }
  }
}
