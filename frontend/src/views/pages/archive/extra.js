import Backbone from 'backbone';
import Nunjucks from 'nunjucks';

import Router from '../../../router';

export default Backbone.View.extend({
  template: Nunjucks,

  events: {
    'change #layout': 'onLayoutChange',
    'click button.reset': 'onResetClick',
  },

  initialize: function () {
    this.router = Router.prototype.getInstance();
  },

  render: function () {
    this.setElement('#extra');

    this.$el.html(this.template.render('pages/archive/extra.html', { state: this.router.state }));

    return this;
  },

  onLayoutChange: function (e) {
    this.router.state.set({ layout: e.currentTarget.value });
    this.router.dispatcher.trigger('archive:options');
  },

  onResetClick: function (e) {
    e.preventDefault();
    this.router.state.set({ ...this.router.state.defaults() });
    this.router.dispatcher.trigger('archive:options');
  },
});
