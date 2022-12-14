import {
  setupApplicationTest as upstreamSetupApplicationTest,
  setupRenderingTest as upstreamSetupRenderingTest,
  setupTest as upstreamSetupTest,
} from 'ember-qunit';

import { click, fillIn, find, waitUntil } from '@ember/test-helpers';

// This file exists to provide wrappers around ember-qunit's / ember-mocha's
// test setup functions. This way, you can easily extend the setup that is
// needed per test type.

function setupApplicationTest(hooks, options) {
  upstreamSetupApplicationTest(hooks, options);

  // Additional setup for application tests can be done here.
  //
  // For example, if you need an authenticated session for each
  // application test, you could do:
  //
  // hooks.beforeEach(async function () {
  //   await authenticateSession(); // ember-simple-auth
  // });
  //
  // This is also a good place to call test setup functions coming
  // from other addons:
  //
  // setupIntl(hooks); // ember-intl
  // setupMirage(hooks); // ember-cli-mirage
}

function setupRenderingTest(hooks, options) {
  upstreamSetupRenderingTest(hooks, options);

  // Additional setup for rendering tests can be done here.
}

function setupTest(hooks, options) {
  upstreamSetupTest(hooks, options);

  // Additional setup for unit tests can be done here.
}

async function addInputAndSubmit(input) {
  await click('[data-test-text-area]');
  fillIn('[data-test-text-area]', input);
  await waitUntil(() => find('[data-test-text-area-submit-button]'));

  if(input.length !== 14) { // if the length isn't 14, the input will not make the submit automatically, so the click on submit button is needed
    await click('[data-test-text-area-submit-button]');
  }
  
  await waitUntil(() => find('[data-test-text-area-submit-button]'));
}

export {
  setupApplicationTest,
  setupRenderingTest,
  setupTest,
  addInputAndSubmit,
};
