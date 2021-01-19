/*
  Copyright (C) 2019 - 2021 HERE Europe B.V.
  SPDX-License-Identifier: MIT

  Permission is hereby granted, free of charge, to any person obtaining
  a copy of this software and associated documentation files (the
  'Software'), to deal in the Software without restriction, including
  without limitation the rights to use, copy, modify, merge, publish,
  distribute, sublicense, and/or sell copies of the Software, and to
  permit persons to whom the Software is furnished to do so, subject to
  the following conditions:

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
  CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
  TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
  SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
const element = require('./Element.js');
const widgets = require('@jupyter-widgets/base');

export class InfoBubbleModel extends element.ElementModel {
  defaults() {
    return {
      //      ...super.defaults(),
      _view_name: 'InfoBubbleView',
      _model_name: 'InfoBubbleModel',

      position: null,
      content: '',
    };
  }
}

InfoBubbleModel.serializers = _.extend({
  position: {
    deserialize: widgets.unpack_models
  },
}, widgets.DOMWidgetModel.serializers);

export class InfoBubbleView extends element.ElementView {
  create_obj() {
    return this.create_child_view(this.model.get('position')).then((view) => {
      this.obj = new H.ui.InfoBubble(view.obj, {
        content: this.model.get('content')
      });
    });
  }

  model_events() {
    //
  }
}