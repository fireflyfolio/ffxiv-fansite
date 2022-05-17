import Backbone from 'backbone';
import Nunjucks from 'nunjucks';

import Config from '../../../config';
import Router from '../../../router';
import ContentModel from '../../../models/content';
import NavView from '../../commons/nav';
import MoreView from '../../commons/more';
import ContainerView from './container';
import AdminView from '../../admin';
import { handleFetchModel } from '../../../utils/auth';

export default Backbone.View.extend({
  template: Nunjucks,

  initialize: function () {
    this.router = Router.prototype.getInstance();
    this.content = new ContentModel();
  },

  render: function (options) {
    this.id = options.id;

    this.content.url = Config.api.server + Config.api.backend.contents + '/' + this.id;

    const cb = () => {
      this.$el.html(this.template.render('pages/picture/index.html', { item: this.content }));

      const navView = new NavView();
      this.$('#nav').append(navView.render().el);

      const moreView = new MoreView({ id: this.id });
      this.$('#more').append(moreView.render().el);

      const containerView = new ContainerView({ items: this.content.get('items') });
      this.$('#container').append(containerView.render().el);

      const adminView = new AdminView({ id: this.id });
      this.$('#admin').append(adminView.render().el);
    };

    handleFetchModel(this.content, cb);

    return this;
  },
});
