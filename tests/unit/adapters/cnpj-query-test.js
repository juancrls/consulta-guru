import { module, test } from 'qunit';
import { setupTest } from 'myapp/tests/helpers';

module('Unit | Adapter | cnpj query', function (hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function (assert) {
    let adapter = this.owner.lookup('adapter:cnpj-query');
    assert.ok(adapter);
  });
});
