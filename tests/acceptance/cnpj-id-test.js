import { done, module, test } from 'qunit';
import {
  click,
  fillIn,
  visit,
  find,
  currentURL,
  waitUntil,
  settled,
  waitFor,
} from '@ember/test-helpers';
import {
  setupBrowserNavigationButtons,
  backButton,
  forwardButton,
} from 'ember-cli-browser-navigation-button-test-helper/test-support';
import { setupApplicationTest, addInputAndSubmit } from 'myapp/tests/helpers';

module('Acceptance | cnpj id', function (hooks) {
  setupApplicationTest(hooks);

  test('should show loading div and data when accessed via URL', async function (assert) {
    visit('/consultar-cnpj-gratis/00000000000191');

    await waitUntil(() => find('[data-test-content-loading]'));
    assert.ok(find('[data-test-content-loading]'), 'loader should be present');

    await waitUntil(() => find('[data-test-content-item]'));
    assert.ok(
      find('[data-test-content-item]'),
      'content item should be present'
    );
    assert
      .dom('[data-test-item-federal-tax-number]')
      .hasText(
        '00.000.000/0001-91',
        'CNPJ data field should contain the correct data after URL change'
      );
  });

  test('should show the correct data when user search multiple valid CNPJ using the input', async function (assert) {
    setupBrowserNavigationButtons();
    await visit('/consultar-cnpj-gratis/');

    await addInputAndSubmit('00000000000191');
    assert.strictEqual(
      currentURL(),
      '/consultar-cnpj-gratis/00000000000191',
      'URL should have the correct CNPJ number after search'
    );
    assert
      .dom('[data-test-item-federal-tax-number]')
      .hasText(
        '00.000.000/0001-91',
        'CNPJ data field should contain the correct data after search'
      );

    await addInputAndSubmit('18792479000101');
    assert
      .dom('[data-test-item-federal-tax-number]')
      .hasText(
        '18.792.479/0001-01',
        'CNPJ data field should contain the correct data after search'
      );
    assert.strictEqual(
      currentURL(),
      '/consultar-cnpj-gratis/18792479000101',
      'URL should have the correct CNPJ number after search'
    );
  });

  test('should keep the URL and add an error class to input if user tries to search for an invalid CNPJ using input', async function (assert) {
    setupBrowserNavigationButtons();
    await visit('/consultar-cnpj-gratis/00000000000191');

    await addInputAndSubmit('123');
    assert.ok(
      find('[data-test-text-area]').classList.contains('error'),
      'Text Area should have an error class'
    );

    assert.strictEqual(
      currentURL(),
      '/consultar-cnpj-gratis/00000000000191',
      'URL should still be the same'
    );
    assert
      .dom('[data-test-item-federal-tax-number]')
      .hasText(
        '00.000.000/0001-91',
        'CNPJ data field should still have the data for the URL CNPJ'
      );
  });

  test('should display an "no data found" error message if user search an CNPJ without data via the URL', async function (assert) {
    setupBrowserNavigationButtons();
    await visit('/consultar-cnpj-gratis/83184591000121');

    await waitUntil(() => find('[data-test-error-message]'));
    assert
      .dom('[data-test-error-message]')
      .hasText(
        'Não há dados para o CNPJ inserido!',
        'CNPJ without data message should be displayed'
      );
    assert.ok(
      find('[data-test-text-area]').classList.contains('error'),
      'Text Area should have an error class'
    );
  });

  test('should display an "no data found" error message if user search for an invalid url using input', async function (assert) {
    setupBrowserNavigationButtons();
    await visit('/consultar-cnpj-gratis/');

    await addInputAndSubmit('83184591000121');
    await waitUntil(() => find('[data-test-error-message]'));
    assert
      .dom('[data-test-error-message]')
      .hasText(
        'Não há dados para o CNPJ inserido!',
        'CNPJ without data message should be displayed'
      );
    assert.ok(
      find('[data-test-text-area]').classList.contains('error'),
      'Text Area should have an error class'
    );
  });

  test('should show the correct data when user search for an valid CNPJ after searching for a invalid', async function (assert) {
    setupBrowserNavigationButtons();
    await visit('/consultar-cnpj-gratis/');

    await addInputAndSubmit('123');
    assert.strictEqual(
      currentURL(),
      '/consultar-cnpj-gratis/',
      'URL should have the correct CNPJ number after search'
    );
    assert.notOk(
      find('[data-test-item-federal-tax-number]'),
      'CNPJ data should NOT be displayed for incorrect CNPJ'
    );

    await addInputAndSubmit('18792479000101');
    assert
      .dom('[data-test-item-federal-tax-number]')
      .hasText(
        '18.792.479/0001-01',
        'CNPJ data field should contain the correct data after search'
      );
    assert.strictEqual(
      currentURL(),
      '/consultar-cnpj-gratis/18792479000101',
      'URL should have the correct CNPJ number after search'
    );
  });

  test('should show the correct data when user search for a different CNPJ than the one in the URL using the input', async function (assert) {
    setupBrowserNavigationButtons();
    await visit('/consultar-cnpj-gratis/00000000000191');
    assert.strictEqual(
      currentURL(),
      '/consultar-cnpj-gratis/00000000000191',
      'URL should have the correct CNPJ number before change'
    );

    await addInputAndSubmit('18792479000101');
    assert.strictEqual(
      currentURL(),
      '/consultar-cnpj-gratis/18792479000101',
      'URL should have the correct CNPJ number before change'
    );
    assert
      .dom('[data-test-item-federal-tax-number]')
      .hasText(
        '18.792.479/0001-01',
        'CNPJ data field should contain the correct data after search'
      );
  });

  test('should show the correct data when user click on the back arrow in navigator when is from an valid cnpj to another valid cnpj', async function (assert) {
    setupBrowserNavigationButtons();

    // BEFORE URL CHANGE
    await visit('/consultar-cnpj-gratis/00000000000191');
    assert.strictEqual(
      currentURL(),
      '/consultar-cnpj-gratis/00000000000191',
      'URL should have the correct CNPJ number before change'
    );

    await waitUntil(() => find('[data-test-content-item]'));
    assert
      .dom('[data-test-item-federal-tax-number]')
      .hasText(
        '00.000.000/0001-91',
        'CNPJ data field should contain the correct data before URL is changed'
      );

    // AFTER URL CHANGED
    await visit('/consultar-cnpj-gratis/18792479000101');
    assert.strictEqual(
      currentURL(),
      '/consultar-cnpj-gratis/18792479000101',
      'URL should have the correct CNPJ number after change'
    );

    await waitUntil(() => find('[data-test-content-item]'));
    assert
      .dom('[data-test-item-federal-tax-number]')
      .hasText(
        '18.792.479/0001-01',
        'CNPJ data field should contain the correct data after URL change'
      );

    // PREVIOUS PAGE BUTTON CLICKED
    await backButton();
    assert.strictEqual(
      currentURL(),
      '/consultar-cnpj-gratis/00000000000191',
      'URL should have the correct CNPJ number after page back button is clicked'
    );

    await waitUntil(() => find('[data-test-content-item]'));
    assert
      .dom('[data-test-item-federal-tax-number]')
      .hasText(
        '00.000.000/0001-91',
        'CNPJ data field should contain the correct data after page back button is clicked'
      ); // federal tax number should be equal to the URL number formatted
  });

  test('should redirect to index when user click on the back arrow in navigator when is from an valid cnpj to an invalid cnpj', async function (assert) {
    setupBrowserNavigationButtons();

    await visit('/consultar-cnpj-gratis/123');
    await visit('/consultar-cnpj-gratis/00000000000191');
    assert.strictEqual(
      currentURL(),
      '/consultar-cnpj-gratis/00000000000191',
      'URL should have the correct CNPJ number before page back button is clicked'
    );

    await backButton();

    assert.strictEqual(
      currentURL(),
      '/consultar-cnpj-gratis/123',
      'URL should have the same CNPJ number as the input'
    );

    assert.ok(
      find('[data-test-text-area]').classList.contains('error'),
      'Text Area should NOT have an error class'
    );

    assert
      .dom('[data-test-text-area]')
      .hasText('', 'CNPJ data field should NOT contain text');
  });
});
