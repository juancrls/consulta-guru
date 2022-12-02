import { module, test } from 'qunit';
import { setupRenderingTest } from 'myapp/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module(
  'Integration | Component | data-container/data-container',
  function (hooks) {
    setupRenderingTest(hooks);

    test('it renders', async function (assert) {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.set('myAction', function(val) { ... });

      await render(hbs`<DataContainer::DataContainer />`);

      assert.dom(this.element).hasText('');

      // Template block usage:
      await render(hbs`
      <DataContainer::DataContainer>
        template block text
      </DataContainer::DataContainer>
    `);

      assert.dom(this.element).hasText('template block text');
    });
  }
);
