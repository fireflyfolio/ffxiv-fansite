import Backbone from 'backbone';
import Nunjucks from 'nunjucks';
import EditorJS from '@editorjs/editorjs';
import Header from 'editorjs-header-with-anchor';
import List from '@editorjs/list';
import ImageTool from '@editorjs/image';
import Delimiter from '@editorjs/delimiter';
import Toastr from 'toastr';

import Config from '../../../config';
import Router from '../../../router';
import ContentModel from '../../../models/content';
import NavView from '../../commons/nav';
import MoreView from '../../commons/more';
import SummaryView from './summary';
import AdminView from '../../admin';
import { handleFetchModel, handleSaveModel } from '../../../utils/auth';

export default Backbone.View.extend({
  template: Nunjucks,

  events: {
    'click #article .submit': 'onSubmitClick',
  },

  initialize: function () {
    this.router = Router.prototype.getInstance();
    this.content = new ContentModel();
  },

  render: function (options) {
    this.id = options.id;

    this.content.url = Config.api.server + Config.api.backend.contents + '/' + this.id;

    const cb = () => {
      this.editor = new EditorJS({
        placeholder: 'Hello world!',
        autofocus: true,
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

      this.$el.html(this.template.render('pages/article/index.html', { item: this.content }));

      const navView = new NavView();
      this.$('#nav').append(navView.render().el);

      const moreView = new MoreView({ id: this.id });
      this.$('#link').append(moreView.render().el);

      const summaryView = new SummaryView({ content: this.content });
      this.$('#summary').append(summaryView.render().el);

      const adminView = new AdminView({ id: this.id });
      this.$('#admin').append(adminView.render().el);
    };

    handleFetchModel(this.content, cb);

    return this;
  },

  onSubmitClick: function (e) {
    e.preventDefault();

    this.editor.save()
      .then((data) => {
        this.content.set({ body: data });
        this.router.dispatcher.trigger('content:editor:update', data);
      })
      .catch((e) => Toastr.error('Erreur de sauvegarde du texte.'));
  }
});
