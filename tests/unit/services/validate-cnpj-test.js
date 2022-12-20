import { module, test } from 'qunit';
import { setupTest } from 'myapp/tests/helpers';

module('Unit | Service | validateCnpj', function (hooks) {
  setupTest(hooks);

  // TODO: Replace this with your real tests.
  test('it exists', function (assert) {
    let service = this.owner.lookup('service:validate-cnpj');
    assert.ok(service);
  });
});
