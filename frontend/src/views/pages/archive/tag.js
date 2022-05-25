import Backbone from 'backbone';
import Nunjucks from 'nunjucks';

import Config from '../../../config';
import Router from '../../../router';
import TagCollection from '../../../models/tag_';

export default Backbone.View.extend({
  template: Nunjucks,

  events: {
    'click .tag': 'onTagClick',
  },

  initialize: function () {
    this.router = Router.prototype.getInstance();
    this.tags = new TagCollection();
  },

  render: function () {
    this.setElement('#tag');

    this.tags.url = Config.api.server + Config.api.tags;

    this.tags.fetch().then(() => {
      this.$el.html(this.template.render('pages/archive/tag.html', {
        tags: this.tags,
        total: this.tags.reduce((acc, tag) => acc + tag.get('total'), 0),
        state: this.router.state,
      }));
    });

    return this;
  },

  onTagClick: function (e) {
    e.preventDefault();
    this.router.state.set({ page: 1, tag: e.currentTarget.getAttribute('data-id') });
    this.router.dispatcher.trigger('archive:options');
  },
});
