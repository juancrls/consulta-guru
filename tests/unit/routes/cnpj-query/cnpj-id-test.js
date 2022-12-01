import { module, test } from 'qunit';
import { setupTest } from 'myapp/tests/helpers';

module('Unit | Route | cnpj-query/cnpj-id', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:cnpj-query/cnpj-id');
    assert.ok(route);
  });
});
