import { module, test } from 'qunit';
import { setupTest } from 'myapp/tests/helpers';

module('Unit | Route | cnpj-query/cnpj-index', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:cnpj-query/cnpj-index');
    assert.ok(route);
  });
});
