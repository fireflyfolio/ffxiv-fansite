import Backbone from 'backbone';
import Nunjucks from 'nunjucks';
import Toastr from 'toastr';
import EditorJS from '@editorjs/editorjs';
import Header from 'editorjs-header-with-anchor';
import List from '@editorjs/nested-list';
import Delimiter from '@editorjs/delimiter';
import Code from '@editorjs/code';
import Table from '@editorjs/table';
import Checklist from '@editorjs/checklist';
import Quote from '@editorjs/quote';
import Warning from '@editorjs/warning';
import Marker from '@editorjs/marker';
import Underline from '@editorjs/underline';
import Footnotes from '@editorjs/footnotes';
import TextVariant from '@editorjs/text-variant-tune';
import Alert from 'editorjs-alert';
import Paragraph from 'editorjs-paragraph-with-alignment';
import Alignement from 'editorjs-text-alignment-blocktune';
import Image from 'editorjs-inline-image';
import Button from 'editorjs-button';
import Link from 'editorjs-hyperlink';
import Embed from '@editorjs/embed';
import MathTex from 'editorjs-math';

import Config from '../../../config';
import Router from '../../../router';
import ContentModel from '../../../models/content';
import SummaryView from './summary';
import { handleFetchModel } from '../../../utils/auth';

export default Backbone.View.extend({
  template: Nunjucks,

  events: {
    'click #article .submit': 'onSubmitClick',
    'keydown #article #editorjs': 'onKeydown',
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
          alignment: Alignement,
          footnotes: Footnotes,
          textvariant: TextVariant,
          header: {
            class: Header,
            config: {
              allowAnchor: true,
            }
          },
          paragraph: {
            class: Paragraph,
            tunes: ['footnotes', 'textvariant'],
          },
          list: {
            class: List,
            config: {
              defaultStyle: 'unordered',
            }
          },
          delimiter: Delimiter,
          code: Code,
          table: {
            class: Table,
            config: {
              rows: 2,
              cols: 3,
            },
          },
          checklist: Checklist,
          quote: Quote,
          warning: Warning,
          marker: Marker,
          underline: Underline,
          alert: Alert,
          image: Image,
          button: Button,
          link: Link,
          embed: Embed,
          math: MathTex,
        },
        tunes: ['alignment'],
        data: this.content.get('body'),
      });

      this.$el.html(this.template.render('pages/article/index.html', { content: this.content }));

      this.$('#nav').append(this.router.views.nav.render().el);
      this.$('#more').append(this.router.views.more.render({ content: this.content }).el);
      this.$('#tag').append(this.router.views.tag.render({ content: this.content }).el);
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
  },

  onKeydown: function (e) {
    if (e.ctrlKey && e.keyCode === 83) {
      this.onSubmitClick(e);
    }
  },
});
