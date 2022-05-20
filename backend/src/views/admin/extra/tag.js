import Backbone from 'backbone';
import Nunjucks from 'nunjucks';
import Toastr from 'toastr';

import Config from '../../../config';
import Router from '../../../router';
import { handleFetch, handleFetchModel } from '../../../utils/auth';

export default Backbone.View.extend({
  template: Nunjucks,

  events: {
    'click #content-tag .edit': 'onEditClick',
    'click #content-tag .submit': 'onSubmitClick',
  },

  initialize: function () {
    this.editId = null;
    this.editMode = false;

    this.router = Router.prototype.getInstance();

    this.listenTo(this.router.dispatcher, 'content:tag:update', () => this.render());
  },

  render: function (options) {
    this.setElement('#tab-extra-2');

    this.content = options ? options.content || this.content : this.content;
    this.tags = options ? options.tags || this.tags : this.tags;

    this.tags.url = Config.api.server + Config.api.backend.contents_tags.replace('{id}', this.content.get('id'));

    const cb = () => this.$el.html(this.template.render('admin/extra/tag.html', { tags: this.tags, editMode: this.editMode }));
    handleFetchModel(this.tags, cb);

    return this;
  },

  onEditClick: function (e) {
    e.preventDefault();

    const element = e.currentTarget;

    document.getElementById('tag-label').value = element.innerHTML;

    this.editId = element.attributes['data-id'].nodeValue;
    this.editMode = true;
  },

  onSubmitClick: function (e) {
    e.preventDefault();

    const element = document.getElementById('tag-label');
    const body = { label: element.value };

    handleFetch({
      url: Config.api.server + Config.api.backend.contents_tags.replace('{id}', this.content.get('id')) + (this.editMode ? `/${this.editId}` : ''),
      method: (this.editMode ? 'PUT' : 'POST'),
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
      body: JSON.stringify(body),
      callback: () => {
        if (this.editMode)
          Toastr.success('Le tag a été mis à jour avec succès.');
        else
          Toastr.success('Le tag a été créé avec succès.');

        this.editId = null;
        this.editMode = false;
        document.getElementById('tag-label').value = '';
        this.router.dispatcher.trigger('content:tag:update');
      },
    });
  },
});
