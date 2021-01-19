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
const control = require('./Control.js');
const _ = require('lodash');


export class ScaleBarModel extends control.ControlModel {
  defaults() {
    return {
      //      ...super.defaults(),
      _view_name: 'ScaleBarView',
      _model_name: 'ScaleBarModel',

      name: "ScaleBar",
      alignment: "RIGHT_BOTTOM",
    };
  }
}

export class ScaleBarView extends control.ControlView {
  create_obj() {
    var options = {
      alignment: _.get(H.ui.LayoutAlignment, this.model.get('alignment'))
    };

    this.obj = new H.ui.ScaleBar(options);
  }

  model_events() {
    //
  }
}