import Backbone from 'backbone';
import Nunjucks from 'nunjucks';

import Config from '../../../config';
import Router from '../../../router';
import ContentCollection from '../../../models/content_';

export default Backbone.View.extend({
  template: Nunjucks,

  events: {
    'click a.archive': 'onArchiveClick',
  },

  initialize: function () {
    this.router = Router.prototype.getInstance();
    this.contents = new ContentCollection();
  },

  render: function () {
    this.setElement('#latest');

    this.contents.url = Config.api.server + Config.api.contents;
    this.contents.fetch().then(() => this.$el.html(this.template.render('pages/home/latest.html', { items: this.contents })));

    return this;
  },

  onArchiveClick: function (e) {
    e.preventDefault();
    this.router.navigate(e.currentTarget.attributes.href.nodeValue, { trigger: true });
  }
});
