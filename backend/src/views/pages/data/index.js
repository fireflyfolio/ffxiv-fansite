import Backbone from 'backbone';
import Nunjucks from 'nunjucks';

import Config from '../../../config';
import Router from '../../../router';
import ContentModel from '../../../models/content';
import NavView from '../../commons/nav';
import MoreView from '../../commons/more';
import ContainerView from './container';
import ModalView from './modal';
import AdminView from '../../admin';
import { handleFetchModel } from '../../../utils/auth';

export default Backbone.View.extend({
  template: Nunjucks,

  events: {
    'click a.dm': 'showModal',
    'click .close, .cancel': 'hideModal',
  },

  initialize: function () {
    this.router = Router.prototype.getInstance();
    this.content = new ContentModel();
  },

  render: function (options) {
    this.id = options.id;

    this.content.url = Config.api.server + Config.api.backend.contents + '/' + this.id;

    const cb = () => {
      this.$el.html(this.template.render('pages/data/index.html', { item: this.content }));

      const navView = new NavView();
      this.$('#nav').append(navView.render().el);

      const moreView = new MoreView({ id: this.id });
      this.$('#more').append(moreView.render().el);

      this.items = this.content.get('items');
      const containerView = new ContainerView({ items: this.items });
      this.$('#container').append(containerView.render().el);

      const adminView = new AdminView({ id: this.id });
      this.$('#admin').append(adminView.render().el);

      this.modalView = new ModalView({ content: this.content, items: this.items });
    };

    handleFetchModel(this.content, cb);

    return this;
  },

  showModal: function (e) {
    e.preventDefault();

    const item_id = e.currentTarget.getAttribute('data-id');
    let element = this.items.elements.find((i) => i.id === item_id);

    this.$('#modal-data').append(this.modalView.render({ element: element }).el);

    const modal = document.getElementById('modal-data');
    modal.style.display = 'block';
    modal.scrollTo({ top: 0, behavior: 'smooth' });
  },

  hideModal: function (e) {
    e.preventDefault();
    const modal = document.getElementById('modal-data');
    modal.style.display = 'none';
  },
});
