import Backbone from 'backbone';
import Nunjucks from 'nunjucks';

import Router from '../../router';

export default Backbone.View.extend({
  template: Nunjucks,

  el: '#nav',

  events: {
    'click a': 'onClick'
  },

  initialize: function () {
    this.router = Router.prototype.getInstance();
  },

  render: function () {
    this.$el.html(this.template.render('commons/nav.html'));
    return this;
  },

  onClick: function (e) {
    e.preventDefault();
    this.router.navigate(e.currentTarget.attributes.href.nodeValue, { trigger: true });
  }
});
