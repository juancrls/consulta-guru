import EmberRouter from '@ember/routing/router';
import config from 'myapp/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('cnpj-query', { path: '/consultar-cnpj-gratis/' }, function () {
    this.route('cnpj-index', { path: '/' });
    this.route('cnpj-id', { path: '/:cnpj_id' });
  });
});