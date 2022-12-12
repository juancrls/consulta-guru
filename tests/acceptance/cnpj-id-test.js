import { module, test } from 'qunit';
import { click, fillIn, visit, find, currentURL, andThen, waitUntil, settled } from '@ember/test-helpers';
import { setupBrowserNavigationButtons, backButton, forwardButton } from 'ember-cli-browser-navigation-button-test-helper/test-support';
import { setupApplicationTest } from 'myapp/tests/helpers';

module('Acceptance | cnpj id', function (hooks) {
  setupApplicationTest(hooks);

  test('should show loading div and data when accessed via URL', async function (assert) {
    await visit('/consultar-cnpj-gratis/00000000000191');

    await waitUntil(() => find('[data-test-content-loading]'), { timeout: Infinity });
    assert.ok(find('[data-test-content-loading]'), 'content loader should be present')

    await settled();

    await waitUntil(() => find('[data-test-content-container]'), { timeout: Infinity });
    assert.ok(find('[data-test-content-container]'), 'content item should be present')

    await settled();
    
    assert.strictEqual(currentURL(), '/consultar-cnpj-gratis/00000000000191');
  });

  test('should show the correct data when user uses the back arrow in navigator', async function (assert) {
    setupBrowserNavigationButtons()
    await visit('/consultar-cnpj-gratis/00000000000191');
    
    await waitUntil(() => find('[data-test-content-container]'), { timeout: Infinity });
    await settled();
    // assert.ok(find('[data-test-content-container]'), 'content item should be present')
    
    await visit('/consultar-cnpj-gratis/18792479000101');
    assert.strictEqual(currentURL(), '/consultar-cnpj-gratis/18792479000101');
    await settled();
    
    backButton();

    await waitUntil(() => find('[data-test-content-container]'), { timeout: Infinity });
    await settled();

    assert.dom('.federal-tax-number').hasText("00.000.000/0001-91"); // federal tax number should be equal to the URL number formatted


    assert.strictEqual(currentURL(), '/consultar-cnpj-gratis/00000000000191');  

  });
});
