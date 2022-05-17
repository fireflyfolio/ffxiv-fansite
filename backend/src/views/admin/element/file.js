import Backbone from 'backbone';
import Nunjucks from 'nunjucks';
import Toastr from 'toastr';

import Config from '../../../config';
import Router from '../../../router';
import { handleFetch } from '../../../utils/auth';

export default Backbone.View.extend({
  template: Nunjucks,

  events: {
    'click #content-file .copy': 'onCopyClick',
    'click #content-file .upload': 'onUploadClick',
  },

  initialize: function (options) {
    this.content = options.content;

    this.router = Router.prototype.getInstance();
  },

  render: function () {
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
        // @todo: Reload the files tab, need to change the api create files response.
        // @todo: If generate_elements then reload the content data and re-render the all content.
        Toastr.success(`Les fichiers ont été transférés avec succès.`);
      },
    };

    handleFetch(options);
  }
});
