import { module, test } from 'qunit';
import { click, fillIn, visit, find, currentURL, andThen, waitUntil, settled } from '@ember/test-helpers';
import { setupBrowserNavigationButtons, backButton, forwardButton } from 'ember-cli-browser-navigation-button-test-helper/test-support';
import { setupApplicationTest } from 'myapp/tests/helpers';

module('Acceptance | cnpj id', function (hooks) {
  setupApplicationTest(hooks);

  test('should show loading div and data when accessed via URL', async function (assert) {
    await visit('/consultar-cnpj-gratis/00000000000191');

    await waitUntil(() => find('[data-test-content-loading]'));
    assert.ok(find('[data-test-content-loading]'), 'loader should be present');

    await waitUntil(() => find('[data-test-content-container]'));
    assert.ok(find('[data-test-content-container]'), 'content item should be present');
    assert.dom('[data-test-item-federal-tax-number]').hasText("00.000.000/0001-91", 'CNPJ field should contain the correct data after URL change');
  });

  test('should show the correct data when user click on the back arrow in navigator', async function (assert) {
    setupBrowserNavigationButtons()
    // BEFORE URL CHANGE
    await visit('/consultar-cnpj-gratis/00000000000191');
    assert.strictEqual(currentURL(), '/consultar-cnpj-gratis/00000000000191', 'URL should have the correct CNPJ number before change');  

    await waitUntil(() => find('[data-test-content-container]'));
    assert.dom('[data-test-item-federal-tax-number]').hasText("00.000.000/0001-91", 'CNPJ field should contain the correct data before URL is changed');
    // AFTER URL CHANGED
    await visit('/consultar-cnpj-gratis/18792479000101');
    assert.strictEqual(currentURL(), '/consultar-cnpj-gratis/18792479000101', 'URL should have the correct CNPJ number after change');

    await waitUntil(() => find('[data-test-content-container]'));
    assert.dom('[data-test-item-federal-tax-number]').hasText("00.000.000/0001-91", 'CNPJ field should contain the correct data after URL change');
    // PREVIOUS PAGE BUTTON CLICKED
    backButton();
    assert.strictEqual(currentURL(), '/consultar-cnpj-gratis/00000000000191', 'URL should have the correct CNPJ number after page back button is clicked');  

    await waitUntil(() => find('[data-test-content-container]'));
    assert.dom('[data-test-item-federal-tax-number]').hasText("00.000.000/0001-91", 'CNPJ field should contain the correct data after page back button is clicked'); // federal tax number should be equal to the URL number formatted
  });
});
