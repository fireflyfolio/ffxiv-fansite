import Backbone from 'backbone';
import Nunjucks from 'nunjucks';
import Toastr from 'toastr';
import _ from 'underscore';

import Config from '../../../config';
import Router from '../../../router';
import { handleFetch } from '../../../utils/auth';

export default Backbone.View.extend({
  template: Nunjucks,

  events: {
    'click #content-file .copy': 'onCopyClick',
    'click #content-file .upload': 'onUploadClick',
  },

  initialize: function () {
    this.router = Router.prototype.getInstance();

    this.listenTo(this.router.dispatcher, 'content:file:delete', (id) => this._deleteFileLocally(id));
  },

  render: function (options) {
    this.setElement('#tab-element-3');

    this.content = options ? options.content || this.content : this.content;

    this.$el.html(this.template.render('admin/element/file.html', { server: Config.api.server, content: this.content }));

    return this;
  },

  onCopyClick: function (e) {
    e.preventDefault();

    const element = e.currentTarget;
    const id = element.attributes['data-id'].nodeValue;

    const items = this.content.get('items') ?? {};
    const files = items.files ?? [];
    const file = files.find((item) => item.id === id);

    navigator.clipboard.writeText(file.name);
    Toastr.success(`Le nom du fichier a été copié dans le presse-papier : ${file.name}`);
  },

  onUploadClick: function (e) {
    e.preventDefault();

    const input = document.querySelector('input[type="file"]');
    const generateElements = document.getElementById('generate-elements');

    const formData = new FormData();

    Array.from(input.files).forEach((file) => {
      formData.append('upload', file);
    });

    formData.append('generate_elements', generateElements.checked);

    const options = {
      url: Config.api.server + Config.api.backend.contents_files.replace('{id}', this.content.id),
      method: 'POST',
      body: formData,
      callback: (res) => {
        this.router.dispatcher.trigger('content:update', this.content);
        Toastr.success(`Les fichiers ont été transférés avec succès.`);
      },
    };

    handleFetch(options);
  },

  _deleteFileLocally: function (id) {
    let items = this.content.get('items') ?? {};
    items.files = items.files ?? [];

    const index = _.findIndex(items.files, (i) => i.id === id);
    if (index > -1) items.files.splice(index, 1);

    this.render();
  },
});
