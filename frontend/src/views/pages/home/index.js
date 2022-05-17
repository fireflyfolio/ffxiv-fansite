import Backbone from 'backbone';
import Nunjucks from 'nunjucks';

import Router from '../../../router';
import NavView from '../../commons/nav';
import WelcomeView from './welcome';
import LatestView from './latest';

export default Backbone.View.extend({
  template: Nunjucks,

  events: {
    'click #home a': 'onClick',
  },

  initialize: function () {
    this.router = Router.prototype.getInstance();
  },

  render: function () {
    this.$el.html(this.template.render('pages/home/index.html'));

    const navView = new NavView();
    this.$('#nav').append(navView.render().el);

    const welcomeView = new WelcomeView();
    this.$('#welcome').append(welcomeView.render().el);

    const latestView = new LatestView();
    this.$('#latest').append(latestView.render().el);

    return this;
  },

  onClick: function (e) {
    e.preventDefault();
    this.router.navigate(e.currentTarget.attributes.href.nodeValue, { trigger: true });
  },
});
