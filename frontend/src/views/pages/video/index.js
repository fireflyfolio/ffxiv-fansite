import Backbone from 'backbone';
import Nunjucks from 'nunjucks';

import Config from '../../../config';
import Router from '../../../router';
import ContentModel from '../../../models/content';
import ContainerView from './container';

export default Backbone.View.extend({
  template: Nunjucks,

  initialize: function () {
    this.router = Router.prototype.getInstance();
    this.content = new ContentModel();
    this.containerView = new ContainerView();
  },

  render: function (options) {
    this.id = options ? options.id || this.id : this.id;

    this.content.url = Config.api.server + Config.api.contents + '/' + this.id;

    this.content.fetch().then(() => {
      this.$el.html(this.template.render('pages/video/index.html', { item: this.content }));

      this.$('#nav').append(this.router.views.nav.render().el);
      this.$('#more').append(this.router.views.more.render({ id: this.id }).el);
      this.$('#container').append(this.containerView.render({ content: this.content }).el);
    });

    return this;
  },
});
