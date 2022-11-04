import { module, test } from 'qunit';
import { setupTest } from 'myapp/tests/helpers';

module('Unit | Serializer | cnpj query', function (hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function (assert) {
    let store = this.owner.lookup('service:store');
    let serializer = store.serializerFor('cnpj-query');

    assert.ok(serializer);
  });

  test('it serializes records', function (assert) {
    let store = this.owner.lookup('service:store');
    let record = store.createRecord('cnpj-query', {});

    let serializedRecord = record.serialize();

    assert.ok(serializedRecord);
  });
});
