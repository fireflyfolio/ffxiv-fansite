import Backbone from 'backbone';
import Nunjucks from 'nunjucks';
import EditorJS from '@editorjs/editorjs';
import Header from 'editorjs-header-with-anchor';
import List from '@editorjs/list';
import ImageTool from '@editorjs/image';
import Delimiter from '@editorjs/delimiter';

import Config from '../../../config';
import Router from '../../../router';
import ContentModel from '../../../models/content';
import { handleFetchModel } from '../../../utils/auth';

export default Backbone.View.extend({
  template: Nunjucks,

  initialize: function () {
    this.router = Router.prototype.getInstance();
    this.content = new ContentModel();
  },

  render: function () {
    this.setElement('#editorial');

    this.content.url = Config.api.server + Config.api.backend.contents + Config.static.home.editorial;

    const cb = () => {
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
    };

    handleFetchModel(this.content, cb);

    return this;
  },
});
