import Backbone from 'backbone';
import Nunjucks from 'nunjucks';

import Config from '../../../config';
import { handleFetchModel } from '../../../utils/auth';

export default Backbone.View.extend({
  template: Nunjucks,

  initialize: function (options) {
    this.content = options.content;
    this.tags = options.tags;
  },

  render: function () {
    this.tags.url = Config.api.server + Config.api.backend.contents_tags.replace('{id}', this.content.get('id'));

    const cb = () => this.$el.html(this.template.render('admin/extra/tag.html'));
    handleFetchModel(this.tags, cb);

    return this;
  },
});
