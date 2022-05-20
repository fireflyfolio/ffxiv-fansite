import Backbone from 'backbone';
import Nunjucks from 'nunjucks';

import Router from '../../../router';
import WelcomeView from './welcome';
import LatestView from './latest';

export default Backbone.View.extend({
  template: Nunjucks,

  events: {
    'click #home a': 'onClick',
  },

  initialize: function () {
    this.router = Router.prototype.getInstance();

    this.welcomeView = new WelcomeView();
    this.latestView = new LatestView();
  },

  render: function () {
    this.$el.html(this.template.render('pages/home/index.html'));

    this.$('#nav').append(this.router.views.nav.render().el);
    this.$('#welcome').append(this.welcomeView.render().el);
    this.$('#latest').append(this.latestView.render().el);

    return this;
  },

  onClick: function (e) {
    e.preventDefault();
    this.router.navigate(e.currentTarget.attributes.href.nodeValue, { trigger: true });
  },
});
