import Backbone from 'backbone';
import Nunjucks from 'nunjucks';
import Toastr from 'toastr';

import Config from '../../config';
import Router from '../../router';
import { handleSaveModel, handleFetch } from '../../utils/auth';

export default Backbone.View.extend({
  template: Nunjucks,

  events: {
    'click button.delete-submit': 'onDeleteSubmit',
  },

  initialize: function () {
    this.router = Router.prototype.getInstance();
  },

  render: function (options) {
    this.setElement('#modal-delete');

    this.content = options ? options.content || this.content : this.content;
    this.relations = options ? options.relations || this.relations : this.relations;
    this.tags = options ? options.tags || this.tags : this.tags;
    this.id = options ? options.id || this.id : this.id;
    this.type = options ? options.type || this.type : this.type;
    this.title = options ? options.title || this.title : this.title;

    this.$el.html(this.template.render('admin/modal.html', { id: this.id, type: this.type, title: this.title }));

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
          this.router.dispatcher.trigger('content:element:update', this.content);
        });
        break;

      case 'file':
        handleFetch({
          url: Config.api.server + Config.api.backend.contents_files.replace('{id}', this.content.id) + '/' + this.id,
          method: 'DELETE',
          callback: () => {
            Toastr.success('Le fichier a été supprimé avec succès.');
            this.router.dispatcher.trigger('content:file:delete', this.id);
          },
        });
        break;

      case 'metadata':
        items.metadata = items.metadata.filter((item) => item.id !== this.id);
        this.content.set({ items: items });
        handleSaveModel(this.content, () => {
          Toastr.success('La métadonnée a été supprimée avec succès.');
          this.router.dispatcher.trigger('content:metadata:delete', this.content);
        });
        break;

      case 'relation':
        handleFetch({
          url: Config.api.server + Config.api.backend.contents_relations.replace('{id}', this.content.id) + '/' + this.id,
          method: 'DELETE',
          callback: () => {
            Toastr.success('La relation a été supprimée avec succès.');
            this.router.dispatcher.trigger('content:relation:update', { content: this.content, relations: this.relations });
          },
        });
        break;

      case 'tag':
        handleFetch({
          url: Config.api.server + Config.api.backend.contents_tags.replace('{id}', this.content.id) + '/' + this.id,
          method: 'DELETE',
          callback: () => {
            Toastr.success('Le tag a été supprimé avec succès.');
            this.router.dispatcher.trigger('content:tag:update', { content: this.content, tags: this.tags });
          },
        });
        break;
    }
  }
});
