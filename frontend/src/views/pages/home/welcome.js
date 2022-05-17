import Backbone from 'backbone';
import Nunjucks from 'nunjucks';

import Config from '../../../config';
import Router from '../../../router';
import ContentModel from '../../../models/content';

export default Backbone.View.extend({
  template: Nunjucks,
  el: '#welcome',

  initialize: function (options) {
    this.router = Router.prototype.getInstance();
    this.content = new ContentModel();
  },

  render: function () {
    this.content.url = Config.api.server + Config.api.contents + Config.static.home.welcome;
    this.content.fetch().then(() => this.$el.html(this.template.render('pages/home/welcome.html', { item: this.content })));

    return this;
  },
});
