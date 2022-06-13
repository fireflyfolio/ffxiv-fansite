import Backbone from 'backbone';
import Nunjucks from 'nunjucks';
import EditorJS from '@editorjs/editorjs';
import Header from 'editorjs-header-with-anchor';
import List from '@editorjs/list';
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
import YoutubeEmbed from 'editorjs-youtube-embed';

import Config from '../../../config';
import Router from '../../../router';
import ContentCollection from '../../../models/content_';
import { handleFetchModel } from '../../../utils/auth';

export default Backbone.View.extend({
  template: Nunjucks,

  initialize: function () {
    this.router = Router.prototype.getInstance();
    this.contents = new ContentCollection();
  },

  render: function () {
    this.setElement('#editorial');

    this.contents.url = Config.api.server + Config.api.backend.contents + '?type=0&is_focus=true&limit=1&is_editorial=true';

    const cb = () => {
      this.content = this.contents.length > 0 ? this.contents.pop() : null;

      if (!this.content) return;

      this.$el.html(this.template.render('pages/home/editorial.html', { content: this.content }));

      this.editor = new EditorJS({
        placeholder: 'Hello world!',
        autofocus: true,
        readOnly: true,
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
          youtubeEmbed: YoutubeEmbed,
          embed: Embed,
        },
        tunes: ['alignment'],
        data: this.content.get('body'),
      });
    };

    handleFetchModel(this.contents, cb);

    return this;
  },
});
