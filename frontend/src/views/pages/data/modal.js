import Backbone from 'backbone';
import Nunjucks from 'nunjucks';
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
        footnotes: Footnotes,
        textvariant: TextVariant,
        alert: Alert,
        alignment: Alignement,
        image: Image,
        button: Button,
        link: Link,
        embed: Embed,
        math: MathTex,
      },
      tunes: ['alignment'],
      data: this.element.body
    });

    return this;
  },

  _isMetaRefActive: function (metadata, meta) {
    const metaRef = metadata.find((item) => item.key === meta.key);
    return metaRef.is_active;
  },
});
