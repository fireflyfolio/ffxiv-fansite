import Backbone from 'backbone';
import Nunjucks from 'nunjucks';

import Config from '../../../config';
import Router from '../../../router';
import ContentModel from '../../../models/content';
import NavView from '../../commons/nav';
import MoreView from '../../commons/more';
import ContainerView from './container';

export default Backbone.View.extend({
  template: Nunjucks,

  initialize: function () {
    this.router = Router.prototype.getInstance();
    this.content = new ContentModel();
  },

  render: function (options) {
    this.id = options.id;

    this.content.url = Config.api.server + Config.api.contents + '/' + this.id;

    this.content.fetch().then(() => {
      this.$el.html(this.template.render('pages/video/index.html', { item: this.content }));

      const navView = new NavView();
      this.$('#nav').append(navView.render().el);

      const moreView = new MoreView({ id: this.id });
      this.$('#more').append(moreView.render().el);

      const containerView = new ContainerView({ items: this.content.get('items') });
      this.$('#container').append(containerView.render().el);
    });

    return this;
  },
});
