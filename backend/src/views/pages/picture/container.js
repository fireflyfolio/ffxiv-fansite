import Backbone from 'backbone';
import Nunjucks from 'nunjucks';
import Lightbox from 'lightbox2';
import LazyLoad from 'vanilla-lazyload';
import Toastr from 'toastr';

import Config from '../../../config';
import Router from '../../../router';

export default Backbone.View.extend({
  template: Nunjucks,

  events: {
    'click .copy': 'onCopyClick',
  },

  lazyLoadInstance: new LazyLoad(),

  initialize: function () {
    this.router = Router.prototype.getInstance();

    this.listenTo(this.router.dispatcher, 'content:element:update', (content) => this.render({ content: content }));
    this.listenTo(this.router.dispatcher, 'content:element:delete:picture', (id) => this.deleteLocally(id));

    Lightbox.option({
      'resizeDuration': 150,
      'imageFadeDuration': 300
    });
  },

  render: function (options) {
    this.setElement('#container');

    this.content = options ? options.content || this.content : this.content;

    this.$el.html(this.template.render('pages/picture/container.html', { server: Config.api.server, items: this.content.get('items') }));
    this.lazyLoadInstance.update();

    return this;
  },

  onCopyClick: function (e) {
    e.preventDefault();

    const id = e.currentTarget.attributes['data-id'].nodeValue;
    const items = this.content.get('items') ?? {};
    const elements = items.elements ?? [];
    const element = elements.find((item) => item.id === id);

    navigator.clipboard.writeText(element.cover);
    Toastr.success(`Le nom du fichier a été copié dans le presse-papier : ${element.cover}`);
  },

  deleteLocally: function (id) {
    document.getElementById('picture-' + id).remove();
    document.getElementById('element-' + id).remove();
  },
});
