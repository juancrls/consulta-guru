import { module, test } from 'qunit';
import { setupRenderingTest } from 'myapp/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | header/header', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders the content inside the header', async function (assert) {
    // await render(hbs`<Header::Header>Hello World</Header::Header>`);
    await render(hbs`<Header::Header />`);

    assert.dom('.header').exists();
    assert.dom('div').hasText('Test');
  });
});
