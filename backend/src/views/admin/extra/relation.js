import Backbone from 'backbone';
import Nunjucks from 'nunjucks';
import Toastr from 'toastr';

import Config from '../../../config';
import Router from '../../../router';
import { handleFetch, handleFetchModel } from '../../../utils/auth';
import { getType } from '../../../utils/string';

export default Backbone.View.extend({
  template: Nunjucks,

  events: {
    'input #content-relation .status': 'onStatusInput',
    'click #content-relation .more': 'onMoreClick',
    'click #content-relation .move-up': 'onMoveUpClick',
    'click #content-relation .move-down': 'onMoveDownClick',
    'click #content-relation .submit': 'onSubmitClick',
  },

  initialize: function () {
    this.router = Router.prototype.getInstance();

    this.listenTo(this.router.dispatcher, 'content:relation:update', (options) => this.render(options));
  },

  render: function (options) {
    this.setElement('#tab-extra-1');

    this.content = options ? options.content || this.content : this.content;
    this.relations = options ? options.relations || this.relations : this.relations;

    this.relations.url = Config.api.server + Config.api.backend.contents_relations.replace('{id}', this.content.get('id'));

    const cb = () => {
      this.relations.sort();
      this.$el.html(this.template.render('admin/extra/relation.html', {
        relations: this.relations,
        getType: getType,
      }));
    };

    handleFetchModel(this.relations, cb);

    return this;
  },

  onStatusInput: function (e) {
    const element = e.currentTarget;
    const id = element.attributes['data-id'].nodeValue;
    const relation = this.relations.get(id);
    relation.set({ status: element.checked ? 1 : 0 });

    this._updateRelation(relation);
  },

  onMoreClick: function (e) {
    e.preventDefault();
    this.router.navigate(e.currentTarget.attributes.href.nodeValue, { trigger: true });
  },

  onMoveUpClick: function (e) {
    e.preventDefault();

    const element = e.currentTarget;
    const id = element.attributes['data-id'].nodeValue;
    const relation = this.relations.get(id);
    const position = relation.get('position');

    if (position < 0) return;

    relation.set({ position: position - 1 });
    this._updateRelation(relation);
  },

  onMoveDownClick: function (e) {
    e.preventDefault();

    const element = e.currentTarget;
    const id = element.attributes['data-id'].nodeValue;
    const relation = this.relations.get(id);
    const position = relation.get('position');

    if (position > this.relations.length) return;

    relation.set({ position: position + 1 });
    this._updateRelation(relation);
  },

  onSubmitClick: function (e) {
    e.preventDefault();

    const element = document.getElementById('relation-id');
    const body = {
      relation_id: Number(element.value),
      position: this.relations.length,
      status: 1
    };

    handleFetch({
      url: Config.api.server + Config.api.backend.contents_relations.replace('{id}', this.content.get('id')),
      method: 'POST',
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
      body: JSON.stringify(body),
      callback: () => this.router.dispatcher.trigger('content:relation:update', { content: this.content, relations: this.relations }),
    });
  },

  _updateRelation: function (relation) {
    const body = {
      position: relation.get('position'),
      status: relation.get('status'),
    };

    handleFetch({
      url: Config.api.server + Config.api.backend.contents_relations.replace('{id}', this.content.get('id')) + '/' + relation.get('id'),
      method: 'PUT',
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
      body: JSON.stringify(body),
      callback: () => {
        Toastr.success('La relation a été mise à jour avec succès.');
        this.router.dispatcher.trigger('content:relation:update', { content: this.content, relations: this.relations });
      },
    });
  },
});
