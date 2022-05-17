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
import NavView from '../../commons/nav';
import MoreView from '../../commons/more';
import SummaryView from './summary';

export default Backbone.View.extend({
  template: Nunjucks,

  initialize: function () {
    this.router = Router.prototype.getInstance();
    this.content = new ContentModel();
  },

  render: function (options) {
    this.id = options.id;

    this.content.url = Config.api.server + Config.api.contents + '/' + this.id;
    this.content.fetch().then(() => {
      const editor = new EditorJS({
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
        onChange: (api, event) => {
          editor.save().then((res) => console.log(res));
        }
      });

      this.$el.html(this.template.render('pages/article/index.html', { item: this.content }));

      const navView = new NavView();
      this.$('#nav').append(navView.render().el);

      const moreView = new MoreView({ id: this.id });
      this.$('#link').append(moreView.render().el);

      const summaryView = new SummaryView({ body: this.content.get('body') });
      this.$('#summary').append(summaryView.render().el);
    });

    return this;
  },
});
