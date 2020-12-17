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
const geometry = require('./Geometry.js');


export class LineStringModel extends geometry.GeometryModel {
  defaults() {
    return {
      //      ...super.defaults(),
      _view_name: 'LineStringView',
      _model_name: 'LineStringModel',

      points: [],
    };
  }
}

export class LineStringView extends geometry.GeometryView {
  create_obj() {
    this.obj = new H.geo.LineString(this.model.get('points'));
  }

  model_events() {
    this.listenTo(
      this.model,
      'change:points',
      function() {
        var len = this.model.get('points').length;
        var array = this.model.get('points');
        this.obj.pushPoint({
          lat: array[array.length - 3],
          lng: array[array.length - 2],
          alt: array[array.length - 1]
        });
      },
      this
    );
  }
}