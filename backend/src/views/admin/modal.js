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
    this.title = options ? options.title || null : null;
    this.cover = options ? options.cover || null : null;

    this.$el.html(this.template.render('admin/modal.html', { id: this.id, type: this.type, title: this.title, cover: this.cover }));

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
        let file = null;

        if (this.cover) {
          file = items.files.filter((item) => item.name === this.cover);
          if (file.length > 0) file = file[0];
        }

        items.elements = items.elements.filter((item) => item.id !== this.id);
        this.content.set({ items: items });

        handleSaveModel(this.content, () => {
          if (file) this._deleteFile(file.id);
          Toastr.success("L'élément a été supprimé avec succès.");
          this.router.dispatcher.trigger('content:element:update', this.content);
        });
        break;

      case 'file':
        this._deleteFile(this.id);
        break;

      case 'metadata':
        items.elements = items.elements.map((element) => {
          element.customized_metadata = element.customized_metadata.filter((meta) => meta.id !== this.id);
          return element;
        });

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
  },

  _deleteFile: function (id) {
    handleFetch({
      url: Config.api.server + Config.api.backend.contents_files.replace('{id}', this.content.id) + '/' + id,
      method: 'DELETE',
      callback: () => {
        Toastr.success('Le fichier a été supprimé avec succès.');
        this.router.dispatcher.trigger('content:file:delete', id);
      },
    });
  }
});
