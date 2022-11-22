import Model, { attr } from '@ember-data/model';

export default class CnpjQueryModel extends Model {
  // @attr legalEntity;
  @attr address;
  @attr blocked;
  @attr economicActivities;
  @attr email;
  @attr federalTaxNumber;
  @attr id;
  @attr issuedOn;
  @attr legalNature;
  @attr name;
  @attr openedOn;
  @attr partners;
  @attr phones;
  @attr responsableEntity;
  @attr shareCapital;
  @attr size;
  @attr status;
  @attr statusOn;
  @attr tradeName;
  @attr unit;
}
