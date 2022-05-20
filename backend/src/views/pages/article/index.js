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
import SummaryView from './summary';
import { handleFetchModel } from '../../../utils/auth';

export default Backbone.View.extend({
  template: Nunjucks,

  events: {
    'click #article .submit': 'onSubmitClick',
  },
  initialize: function () {
    this.router = Router.prototype.getInstance();
    this.content = new ContentModel();
    this.summaryView = new SummaryView();
  },

  render: function (options) {
    this.id = options ? options.id || this.id : this.id;

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

      this.$el.html(this.template.render('pages/article/index.html', { content: this.content }));

      this.$('#nav').append(this.router.views.nav.render().el);
      this.$('#more').append(this.router.views.more.render({ id: this.id }).el);
      this.$('#summary').append(this.summaryView.render({ content: this.content }).el);
      this.$('#admin').append(this.router.views.admin.render({ id: this.id }).el);
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
