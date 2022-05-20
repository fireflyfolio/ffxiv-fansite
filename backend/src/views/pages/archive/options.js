import Backbone from 'backbone';
import Nunjucks from 'nunjucks';

import Config from '../../../config';
import ContentTypeCollection from '../../../models/content_type_';
import { handleFetchModel } from '../../../utils/auth';

export default Backbone.View.extend({
  template: Nunjucks,

  events: {
    'change #sort': 'onSortChange',
    'change #sort_dir': 'onSortDirChange',
  },

  initialize: function () {
    this.contentTypes = new ContentTypeCollection();
  },

  render: function (options) {
    this.setElement('#options');

    this.state = options ? options.state || this.state : this.state;

    this.contentTypes.url = Config.api.server + Config.api.backend.contents + '/types';

    const cb = () => {
      this.$el.html(this.template.render('pages/archive/options.html', { contentTypes: this.contentTypes }));
    };

    handleFetchModel(this.contentTypes, cb);

    return this;
  },

  onSortChange: function (e) {
    this.state.set({ sort: e.currentTarget.value });
  },

  onSortDirChange: function (e) {
    this.state.set({ sort_dir: e.currentTarget.value });
  }
});
