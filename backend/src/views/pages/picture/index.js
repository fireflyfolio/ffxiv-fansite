import Backbone from 'backbone';
import Nunjucks from 'nunjucks';

import Config from '../../../config';
import Router from '../../../router';
import ContentModel from '../../../models/content';
import ContainerView from './container';
import { handleFetchModel } from '../../../utils/auth';

export default Backbone.View.extend({
  template: Nunjucks,

  initialize: function () {
    this.router = Router.prototype.getInstance();
    this.content = new ContentModel();
    this.containerView = new ContainerView();
  },

  render: function (options) {
    this.id = options ? options.id || this.id : this.id;

    this.content.url = Config.api.server + Config.api.backend.contents + '/' + this.id;

    const cb = () => {
      this.$el.html(this.template.render('pages/picture/index.html', { item: this.content }));

      this.$('#nav').append(this.router.views.nav.render().el);
      this.$('#more').append(this.router.views.more.render({ id: this.id }).el);
      this.$('#container').append(this.containerView.render({ content: this.content }).el);
      this.$('#admin').append(this.router.views.admin.render({ id: this.id }).el);
    };

    handleFetchModel(this.content, cb);

    return this;
  },
});
