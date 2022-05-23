import Backbone from 'backbone';
import Nunjucks from 'nunjucks';

import Config from '../../../config';
import Router from '../../../router';
import ContentModel from '../../../models/content';
import ContainerView from './container';
import ModalView from './modal';

export default Backbone.View.extend({
  template: Nunjucks,

  events: {
    'click a.dm': 'showModal',
    'click .modal': 'hideModal',
  },

  initialize: function () {
    this.router = Router.prototype.getInstance();
    this.content = new ContentModel();
    this.containerView = new ContainerView();
    this.modalView = new ModalView();
  },

  render: function (options) {
    this.id = options ? options.id || this.id : this.id;

    this.content.url = Config.api.server + Config.api.contents + '/' + this.id;

    this.content.fetch().then(() => {
      this.$el.html(this.template.render('pages/data/index.html', { content: this.content }));

      this.$('#nav').append(this.router.views.nav.render().el);
      this.$('#more').append(this.router.views.more.render({ content: this.content }).el);
      this.$('#container').append(this.containerView.render({ content: this.content }).el);
    });

    return this;
  },

  showModal: function (e) {
    e.preventDefault();

    const id = e.currentTarget.getAttribute('data-id');
    this.$('#modal-data').append(this.modalView.render({ content: this.content, id: id }).el);

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
