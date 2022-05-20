import Backbone from 'backbone';
import Nunjucks from 'nunjucks';
import EditorJS from '@editorjs/editorjs';
import Header from 'editorjs-header-with-anchor';
import List from '@editorjs/list';
import ImageTool from '@editorjs/image';
import Delimiter from '@editorjs/delimiter';

import Config from '../../../config';

export default Backbone.View.extend({
  template: Nunjucks,

  initialize: function () {
  },

  render: function (options) {
    this.setElement('#modal-data');

    this.content = options ? options.content || this.content : this.content;
    this.id = options ? options.id || this.id : this.id;

    this.element = this.content.get('items').elements.find((i) => i.id === this.id);

    this.$el.html(this.template.render('pages/data/modal.html', {
      server: Config.api.server,
      items: this.content.get('items'),
      element: this.element,
      isMetaRefActive: this._isMetaRefActive,
    }));

    this.editor = new EditorJS({
      placeholder: 'Hello world!',
      autofocus: true,
      readOnly: true,
      tools: {
        header: Header,
        list: List,
        image: ImageTool,
        delimiter: Delimiter,
      },
      data: this.element.body
    });

    return this;
  },

  _isMetaRefActive: function (metadata, meta) {
    const metaRef = metadata.find((item) => item.key === meta.key);
    return metaRef.is_active;
  },
});
