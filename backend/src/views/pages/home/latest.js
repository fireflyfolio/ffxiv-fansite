import Backbone from 'backbone';
import Nunjucks from 'nunjucks';

import Config from '../../../config';
import Router from '../../../router';
import ContentCollection from '../../../models/content_';
import { handleFetchModel } from '../../../utils/auth';
import { getStatus, getType, getTypeLabel } from '../../../utils/string';
import { dateOnly } from '../../../utils/date';

export default Backbone.View.extend({
  template: Nunjucks,

  events: {
    'click .latest a.archive': 'onArchiveClick',
  },

  initialize: function () {
    this.router = Router.prototype.getInstance();
    this.contents = new ContentCollection();
  },

  render: function () {
    this.setElement('#latest');

    this.contents.url = Config.api.server + Config.api.backend.contents + '?limit=20';

    if (this.router.state.get('show_privacy')) this.contents.url += '&show_privacy=true';

    const cb = () => this.$el.html(this.template.render('pages/home/latest.html', {
      contents: this.contents,
      dateOnly: dateOnly,
      getStatus: getStatus,
      getType: getType,
      getTypeLabel: getTypeLabel,
    }));

    handleFetchModel(this.contents, cb);

    return this;
  },

  onArchiveClick: function (e) {
    e.preventDefault();
    this.router.state.set({ type: '-1' });
    this.router.navigate(e.currentTarget.attributes.href.nodeValue, { trigger: true });
  }
});
