/*
  Copyright (C) 2019 - 2020 HERE Europe B.V.
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
const object = require('./Object.js');
const widgets = require('@jupyter-widgets/base');
const _ = require('lodash');

export class IconModel extends object.ObjectModel {
  defaults() {
    return {
      _view_name: 'IconView',
      _model_name: 'IconModel',

      bitmap: '',
      height: 256,
      width: 256,
      anchor: null,
    };
  }
}


export class IconView extends object.ObjectView {
  create_obj() {
    var options = {
      size: {
        h: this.model.get('height'),
        w: this.model.get('width')
      }
    };
    if (this.model.get('anchor')) {
      options['anchor'] = this.model.get('anchor');
    }
    this.obj = new H.map.Icon(this.model.get('bitmap'), options);
  }

  mapjs_events() {
    //
  }

  model_events() {
    //
  }

}