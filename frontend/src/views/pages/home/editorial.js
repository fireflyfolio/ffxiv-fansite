import Backbone from 'backbone';
import Nunjucks from 'nunjucks';
import EditorJS from '@editorjs/editorjs';
import Header from 'editorjs-header-with-anchor';
import List from '@editorjs/list';
import ImageTool from '@editorjs/image';
import Delimiter from '@editorjs/delimiter';

import Config from '../../../config';
import Router from '../../../router';
import ContentCollection from '../../../models/content_';
export default Backbone.View.extend({
  template: Nunjucks,

  initialize: function () {
    this.router = Router.prototype.getInstance();
    this.contents = new ContentCollection();
  },

  render: function () {
    this.setElement('#editorial');

    this.contents.url = Config.api.server + Config.api.contents + '?type=0&is_focus=true&limit=1&is_editorial=true';

    this.contents.fetch().then(() => {
      this.content = this.contents.length > 0 ? this.contents.pop() : null;

      if (!this.content) return;

      this.$el.html(this.template.render('pages/home/editorial.html', { content: this.content }));

      this.editor = new EditorJS({
        placeholder: 'Hello world!',
        autofocus: true,
        readOnly: true,
        tools: {
          header: {
            class: Header,
            config: {
              allowAnchor: true,
            }
          },
          list: {
            class: List,
            inlineToolbar: true,
            config: {
              defaultStyle: 'unordered'
            }
          },
          image: {
            class: ImageTool,
            config: {
              endpoints: {
                byFile: 'http://localhost:8008/uploadFile', // Your backend file uploader endpoint
                byUrl: 'http://localhost:8008/fetchUrl', // Your endpoint that provides uploading by Url
              }
            }
          },
          delimiter: Delimiter,
        },
        data: this.content.get('body'),
      });
    });

    return this;
  },
});
