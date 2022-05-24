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
  },

  initialize: function () {
    this.router = Router.prototype.getInstance();
    this.contentTypes = new ContentTypeCollection();
  },

  render: function (options) {
    this.setElement('#options');

    this.contentTypes.url = Config.api.server + Config.api.contents + '/types';

    this.contentTypes.fetch().then(() => {
      this.$el.html(this.template.render('pages/archive/options.html', { contentTypes: this.contentTypes }));
    });

    return this;
  },

  onSortChange: function (e) {
    this.router.state.set({ sort: e.currentTarget.value });
  },

  onSortDirChange: function (e) {
    this.router.state.set({ sort_dir: e.currentTarget.value });
  }
});
