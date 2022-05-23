import Backbone from 'backbone';
import Nunjucks from 'nunjucks';

import Config from '../../../config';
import Router from '../../../router';
import ContentCollection from '../../../models/content_';
import { getType, getTypeLabel } from '../../../utils/string';
import { dateOnly } from '../../../utils/date';

export default Backbone.View.extend({
  template: Nunjucks,

  initialize: function () {
    this.router = Router.prototype.getInstance();
    this.contents = new ContentCollection();
  },

  render: function () {
    this.setElement(`#spotlight`);

    this.contents.url = Config.api.server + Config.api.contents + '?limit=10&is_focus=true';

    this.contents.fetch().then(() => this.$el.html(this.template.render('pages/home/spotlight.html', {
      contents: this.contents,
      dateOnly: dateOnly,
      getType: getType,
      getTypeLabel: getTypeLabel,
      type: this.type,
    })));

    return this;
  },
});
