import Backbone from 'backbone';
import Nunjucks from 'nunjucks';

import Config from '../../../config';
import Router from '../../../router';
import ContentModel from '../../../models/content';
import { handleFetchModel } from '../../../utils/auth';

export default Backbone.View.extend({
  template: Nunjucks,
  el: '#welcome',

  initialize: function () {
    this.router = Router.prototype.getInstance();
    this.content = new ContentModel();
  },

  render: function () {
    this.content.url = Config.api.server + Config.api.backend.contents + Config.static.home.welcome;

    const cb = () => this.$el.html(this.template.render('pages/home/welcome.html', { item: this.content }));
    handleFetchModel(this.content, cb);

    return this;
  },
});
