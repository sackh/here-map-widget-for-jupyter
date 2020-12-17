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
const layer = require('./Layer.js');
var flatten = require('flat');


export class GeoJSONLayerModel extends layer.LayerModel {
  defaults() {
    return {
      //      ...super.defaults(),
      _view_name: 'GeoJSONLayerView',
      _model_name: 'GeoJSONLayerModel',

      data: {},
      url: '',
      style: {},
      disable_legacy_mode: true,
      evt_type: 'tap',
      hover_style: {},
      show_bubble: false,
    };
  }
}

export class GeoJSONLayerView extends layer.LayerView {
  create_obj() {
    this.bubble = null;
    var style = feature => {
      const model_style = this.model.get('style');
      const feature_style = feature.data.style || {};
      var s = Object.assign({}, model_style, feature_style);
      if (typeof feature.setStyle !== "undefined") {
        feature.setStyle(s);
      }
    }
    const options = {
      // This function is called each time parser detects a new map object
      style: style,
      disableLegacyMode: this.model.get('disable_legacy_mode')
    };
    var map_v = this.map_view;
    if (this.model.get('url') === '') {
      var reader = new H.data.geojson.Reader("", options);
      reader.parseData(this.model.get('data'));
      this.parsedData = this.model.get('data');
    } else {
      var reader = new H.data.geojson.Reader(this.model.get('url'), options);
      reader.parse();
    }
    //  saving the parsed data in object

    reader.addEventListener("statechange", (evt) => {
      if (evt.state === H.data.AbstractReader.State.READY) {
        var data = reader.getParsedObjects();
        this.parsedData = data[0].toGeoJSON();
      }
      if (evt.state === H.data.AbstractReader.State.ERROR) {
        console.warn('GeoJSON parsing error');
      }
    });
    var map = this.map_view.obj;
    reader.getLayer().getProvider().addEventListener("tap", (evnt) => {
      var feature = evnt.target.toGeoJSON();
      this.send({
        event: evnt.type,
        position: map.screenToGeo(evnt.currentPointer.viewportX, evnt.currentPointer.viewportY),
        feature: feature,
        properties: feature.properties ? feature.properties : {},
        id: feature.id
      });
    });
    reader.getLayer().getProvider().addEventListener("pointermove", (evnt) => {
      if (Object.keys(this.model.get('hover_style')).length !== 0)
        evnt.target.setStyle(this.model.get('hover_style'))
      var feature = evnt.target.toGeoJSON();
      this.send({
        event: evnt.type,
        position: map.screenToGeo(evnt.currentPointer.viewportX, evnt.currentPointer.viewportY),
        feature: feature,
        properties: feature.properties ? feature.properties : {},
        id: feature.id
      });
      evnt.target.addEventListener("pointerleave", (targetEvent) => {
        const feature = targetEvent.target.toGeoJSON();
        const model_style = this.model.get('style');
        const feature_style = feature.properties ? feature.properties.style || {} : {};
        var s = Object.assign({}, model_style, feature_style);
        if (targetEvent.target.setStyle && typeof targetEvent.target.setStyle === 'function')
          targetEvent.target.setStyle(s);
      });
    });
    this.obj = reader.getLayer();
  }

  mapjs_events() {
    var evt_flag = false;
    const provider = this.obj.getProvider();
    var evt_type = this.model.get('evt_type');
    var map = this.map_view.obj;
    var ui = this.map_view.ui;
    const handle = this;
    if (this.model.get('show_bubble')) {
      provider.addEventListener(evt_type, function(evt) {
        var position = map.screenToGeo(evt.currentPointer.viewportX, evt.currentPointer.viewportY),
          data = evt.target.getData();
        var flattenData = flatten(data);
        var rows = Object.keys(flattenData).map((key) =>
          `<tr><td>${key}:</td><td>${flattenData[key]}</td></tr>`
        );
        if (!handle.bubble) {
          handle.bubble = new H.ui.InfoBubble(position, {
            content: `<div style="max-height:300px; overflow:auto"><table style="font-size:10px">${rows.join('')}</table></div>`
          });
          ui.addBubble(handle.bubble);

        } else {
          handle.bubble.setContent(`<div style="max-height:300px; overflow:auto"><table style="font-size:10px">${rows.join('')}</table></div>`);
          handle.bubble.setPosition(position);
          handle.bubble.open();
        }
        map.setCenter(position, true);
      }, false);
    }
  }
  model_events() {
    this.listenTo(
      this.model,
      'change:data',
      function() {
        this.map_view.obj.removeLayer(this.obj);
        this.create_obj();
        this.map_view.obj.addLayer(this.obj);
      },
      this
    );
  }
}