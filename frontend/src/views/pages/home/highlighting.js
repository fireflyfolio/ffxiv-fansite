import Backbone from 'backbone';
import Nunjucks from 'nunjucks';

import Config from '../../../config';
import Router from '../../../router';
import ContentCollection from '../../../models/content_';
import { getStatus, getType, getTypeLabel } from '../../../utils/string';
import { dateOnly } from '../../../utils/date';
import { CONTENT_TYPE_ARTICLE } from '../../../config/constants';

export default Backbone.View.extend({
  template: Nunjucks,

  events: {
    'click .highlighting a.archive': 'onArchiveClick',
  },

  initialize: function () {
    this.router = Router.prototype.getInstance();
    this.contents = new ContentCollection();
  },

  render: function (options) {
    this.type = options ? options.type || this.type : CONTENT_TYPE_ARTICLE;

    this.setElement(`#highlighting-${this.type}`);

    this.contents.url = Config.api.server + Config.api.contents + `?limit=20&type=${this.type}&is_pin=true`;

    this.contents.fetch().then(() => this.$el.html(this.template.render('pages/home/highlighting.html', {
      contents: this.contents,
      dateOnly: dateOnly,
      getStatus: getStatus,
      getType: getType,
      getTypeLabel: getTypeLabel,
      type: this.type,
    })));

    return this;
  },

  onArchiveClick: function (e) {
    e.preventDefault();
    this.router.state.set({ type: this.type, page: 1 });
    this.router.navigate(e.currentTarget.attributes.href.nodeValue, { trigger: true });
  }
});
