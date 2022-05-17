import Backbone from 'backbone';
import Nunjucks from 'nunjucks';
import Toastr from 'toastr';

import Config from '../../config';
import Router from '../../router';
import { handleSaveModel, handleFetch } from '../../utils/auth';

export default Backbone.View.extend({
  template: Nunjucks,
  el: '#modal-delete',

  events: {
    'click button.delete-submit': 'onDeleteSubmit',
  },

  initialize: function (options) {
    this.content = options.content;
    this.relations = options.relations;
    this.tags = options.tags;

    this.router = Router.prototype.getInstance();
  },

  render: function (options) {
    this.id = options.id;
    this.type = options.type;

    this.$el.html(this.template.render('admin/modal.html', { id: this.id, type: this.type }));

    return this;
  },

  onDeleteSubmit: function (e) {
    let items = this.content.get('items') ?? {};

    switch (this.type) {
      case 'content':
        handleFetch({
          url: Config.api.server + Config.api.backend.contents + '/' + this.id,
          method: 'DELETE',
          callback: () => {
            Toastr.success('Le contenu a été supprimé avec succès.');
            this.router.navigate('/', { trigger: true });
          },
        });
        break;

      case 'element':
        items.elements = items.elements.filter((item) => item.id !== this.id);
        this.content.set({ items: items });
        handleSaveModel(this.content, () => {
          Toastr.success("L'élément a été supprimé avec succès.");
          this.router.dispatcher.trigger('content:element:update', items);
        });
        break;

      case 'file':
        handleFetch({
          url: Config.api.server + Config.api.backend.contents_files.replace('{id}', this.content.id) + '/' + this.id,
          method: 'DELETE',
          callback: () => {
            Toastr.success('Le fichier a été supprimé avec succès.');
            this.router.dispatcher.trigger('content:element:update', items);
          }
        });
        break;

      case 'metadata':
        items.metadata = items.metadata.filter((item) => item.id !== this.id);
        this.content.set({ items: items });
        handleSaveModel(this.content, () => {
          Toastr.success('La métadonnée a été supprimée avec succès.');
          this.router.dispatcher.trigger('content:metadata:delete');
        });
        break;

      case 'relation':
        break;

      case 'tag':
        break;
    }
  }
});
