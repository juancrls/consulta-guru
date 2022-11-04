import Model, { attr } from '@ember-data/model';

export default class CnpjQueryModel extends Model {
  @attr legalEntity;
}
