import Backbone from 'backbone';
import Nunjucks from 'nunjucks';

import Router from '../../../router';

export default Backbone.View.extend({
  template: Nunjucks,

  events: {
    'change #layout': 'onLayoutChange',
    'click button.preset-list-title-asc': 'onPresetListTitleAscClick',
    'click button.preset-icon-title-asc': 'onPresetIconTitleAscClick',
    'click button.preset-bubble-date-desc': 'onPresetBubbleDateDescClick',
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

  onPresetListTitleAscClick: function (e) {
    e.preventDefault();
    this.router.state.set({ layout: 'layout-list', sort: 'title', sort_dir: 'asc' });
    this.router.dispatcher.trigger('archive:options');
  },

  onPresetIconTitleAscClick: function (e) {
    e.preventDefault();
    this.router.state.set({ layout: 'layout-icon', sort: 'title', sort_dir: 'asc' });
    this.router.dispatcher.trigger('archive:options');
  },

  onPresetBubbleDateDescClick: function (e) {
    e.preventDefault();
    this.router.state.set({ layout: 'layout-bubble', sort: 'date', sort_dir: 'desc' });
    this.router.dispatcher.trigger('archive:options');
  },

  onResetClick: function (e) {
    e.preventDefault();
    this.router.state.set({ ...this.router.state.defaults() });
    this.router.dispatcher.trigger('archive:options');
  },
});
