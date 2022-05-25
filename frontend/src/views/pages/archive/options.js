import Backbone from 'backbone';
import Nunjucks from 'nunjucks';

import Config from '../../../config';
import Router from '../../../router';
import ContentTypeCollection from '../../../models/content_type_';

export default Backbone.View.extend({
  template: Nunjucks,

  events: {
    'change #sort': 'onSortChange',
    'change #sort_dir': 'onSortDirChange',
    'click .type': 'onTypeClick',
    'click .tag': 'onTagClick',
    'keydown .search': 'onSearchKeydown',
  },

  initialize: function () {
    this.router = Router.prototype.getInstance();
    this.contentTypes = new ContentTypeCollection();
  },

  render: function () {
    this.setElement('#options');

    const search = this.router.state.get('search');
    const tag = this.router.state.get('tag');

    this.contentTypes.url = Config.api.server + Config.api.contents + '/types?empty=true';

    if (search !== '-1') this.contentTypes.url += `&search=${search}`;
    if (tag !== '-1') this.contentTypes.url += `&tag=${tag}`;

    this.contentTypes.fetch().then(() => {
      this.$el.html(this.template.render('pages/archive/options.html', {
        contentTypes: this.contentTypes,
        state: this.router.state,
      }));
    });

    return this;
  },

  onSortChange: function (e) {
    this.router.state.set({ sort: e.currentTarget.value });
    this.router.dispatcher.trigger('archive:options');
  },

  onSortDirChange: function (e) {
    this.router.state.set({ sort_dir: e.currentTarget.value });
    this.router.dispatcher.trigger('archive:options');
  },

  onTypeClick: function (e) {
    e.preventDefault();
    this.router.state.set({ page: 1, type: e.currentTarget.getAttribute('data-type') });
    this.router.dispatcher.trigger('archive:options');
  },

  onTagClick: function (e) {
    e.preventDefault();
    this.router.state.set({ page: 1, type: e.currentTarget.getAttribute('data-tag') });
    this.router.dispatcher.trigger('archive:options');
  },

  onSearchKeydown: function (e) {
    const value = e.currentTarget.value;

    if (e.keyCode === 13) {
      e.preventDefault();

      if (value.length < 2) {
        this.router.state.set({ page: 1, search: '' });
        this.router.dispatcher.trigger('archive:options');
        return;
      }

      this.router.state.set({ page: 1, search: value });
      this.router.dispatcher.trigger('archive:options');
    }
  }
});
