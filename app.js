//@ sourceMappingURL=app.map
// Generated by CoffeeScript 1.6.1
(function() {
  var Element, Helper, Sha, bbox, conf, el, elements, item, item2, items, l, link, paper, sha, start_x, start_y, stop_id, stop_name, stop_x, stop_y, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref, _ref1;

  conf = {
    dot: {
      radius: {
        min: 2.5,
        max: 5
      },
      color: "#090",
      color2: "#900",
      border: {
        color: "#040",
        color2: "#400",
        size: 1
      },
      hover_color: "red",
      indent: 5,
      offset: 5
    },
    element: {
      border: {
        color: "#555",
        size: 1
      },
      size: 32
    },
    icon: {
      path: "/delphi/icon/",
      size: 24
    }
  };

  paper = Raphael(10, 10, 1000, 1000);

  Element = (function() {

    function Element(name, x, y, params, id, ini) {
      this.name = name;
      this.params = params != null ? params : {};
      this.id = id;
      this.ini = ini;
      this.x = parseInt(x);
      this.y = parseInt(y);
      this.ini = ini;
      if (name === 'HubEx') {
        this.size = 15;
        this.icon_size = 5;
      } else {
        this.size = conf.element.size;
        this.icon_size = conf.icon.size;
      }
    }

    Element.prototype.draw_dots = function(params, property) {
      var border_color, dot, dot_color, dot_x, dot_y, i, link, offset_x, param, str, text, type, type_num, types, _i, _len, _ref, _results;
      i = [0, 0, 0, 0, 0, 0, 0];
      for (param in params) {
        if (param.substr(0, 1) === "*") {
          continue;
        }
        str = params[param].split('|');
        types = ['', 'do', 'on', 'top', 'bot'];
        type_num = parseInt(str[1]);
        type = types[type_num];
        offset_x = 0;
        if (type === 'on') {
          offset_x = conf.element.size;
        }
        text = str[0];
        dot_x = offset_x + this.x;
        dot_y = this.y + conf.dot.offset + i[type_num] * conf.dot.indent;
        dot_color = conf.dot.color;
        border_color = conf.dot.border.color;
        if (type === 'top' || type === 'bot') {
          dot_x = this.x + conf.dot.offset - 1 + i[type_num] * conf.dot.indent;
          dot_y = this.y;
          dot_color = conf.dot.color2;
          border_color = conf.dot.border.color2;
          if (type === 'top') {
            dot_y += conf.element.size;
          }
        }
        if (property[param] !== void 0) {
          dot_color = "#FFFF00";
          border_color = "#DAA520";
        }
        dot = paper.circle(dot_x, dot_y, conf.dot.radius.min).attr({
          fill: dot_color,
          stroke: border_color,
          "stroke-width": 1
        });
        dot.text = "" + param + ": " + text;
        dot.default_color = dot_color;
        dot.name = param;
        dot.eid = this.id;
        dot.hover(function(e) {
          this.attr({
            fill: conf.dot.hover_color,
            r: conf.dot.radius.max
          });
          Helper.setText(this.text);
          Helper.move(e.layerX, e.layerY);
          return Helper.show();
        }, function() {
          this.attr({
            fill: this.default_color,
            r: conf.dot.radius.min
          });
          return Helper.hide();
        });
        this.element.push(dot);
        i[type_num]++;
      }
      _ref = this.params;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        param = _ref[_i];
        if (param.name.substr(0, 4) === "link") {
          link = param.name.substr(5, param.name.length - 6);
          if (link.substr(0, 2) === 'on') {
            link = link.replace(/\)\(/g, ',').replace(/\[\(/g, '').replace(/\)\]/g, '').split(',');
            link.eid = this.id;
            _results.push(links.push(link));
          } else {
            _results.push(void 0);
          }
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    Element.prototype.save = function() {
      var element, move, start, up;
      this.icon = paper.image("" + conf.icon.path + this.name + ".ico", this.x + 4, this.y + 4, this.icon_size, this.icon_size);
      this.rect = paper.rect(this.x, this.y, this.size, this.size, 3).attr({
        fill: this.icon,
        "fill-opacity": 0,
        "stroke-width": conf.element.border.size,
        stroke: conf.element.border.color
      });
      this.rect.eid = this.id;
      this.element = paper.set();
      this.element.eid = this.id;
      this.draw_dots(this.ini.Methods, this.ini.Property);
      this.element.push(this.rect, this.icon);
      element = this.element;
      start = function() {
        var e, el, path, path_num, _i, _len;
        this.ox = 0;
        this.oy = 0;
        el = elements[this.eid].element.items;
        for (_i = 0, _len = el.length; _i < _len; _i++) {
          e = el[_i];
          if (e.type === "path") {
            if (e.stop_id === this.eid) {
              path_num = 0;
            } else {
              path_num = 1;
            }
            path = e.attr('path')[path_num];
            e.path_num = path_num;
            if (path_num === 1) {
              e.stop = {
                x: path[3],
                y: path[4]
              };
            } else {
              e.stop = {
                x: path[1],
                y: path[2]
              };
            }
          }
        }
        if (this.type !== 'circle') {
          return this.animate({
            "fill-opacity": .3
          }, 300, ">");
        }
      };
      move = function(dx, dy) {
        var e, el, path, _i, _len, _results;
        element.translate(dx - this.ox, dy - this.oy);
        this.ox = dx;
        this.oy = dy;
        el = elements[this.eid].element.items;
        _results = [];
        for (_i = 0, _len = el.length; _i < _len; _i++) {
          e = el[_i];
          if (e.type === "path") {
            path = e.attr('path');
            path[e.path_num][1] = e.stop.x - dx;
            path[e.path_num][2] = e.stop.y - dy;
            if (path[e.path_num][0] === "S") {
              path[e.path_num][2] = path[e.path_num][2] / 0.97;
              path[e.path_num][3] = e.stop.x - dx;
              path[e.path_num][4] = e.stop.y - dy;
            }
            _results.push(e.attr({
              path: path
            }));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      };
      up = function() {
        if (this.type !== 'circle') {
          return this.animate({
            "fill-opacity": 0
          }, 300, ">");
        }
      };
      return paper.set(this.element).drag(move, start, up).toBack();
    };

    return Element;

  })();

  Helper = (function() {
    var helper;

    helper = null;

    Helper.get = function() {
      if (this.helper == null) {
        paper.setStart();
        paper.rect(0, 0, 1, 20, 4).attr({
          "fill": "#aaa"
        });
        paper.text(0, 10, "").attr({
          "fill": "black"
        });
        this.helper = paper.setFinish().toFront().hide();
      }
      return this.helper;
    };

    Helper.setText = function(text) {
      this.text = text;
      this.get().attr('text', text);
      this.get().attr('width', text.length * 6);
      return this.get().show();
    };

    Helper.move = function(layerX, layerY) {
      this.get()[0].attr('x', layerX + conf.dot.radius.max * 2);
      this.get()[0].attr('y', layerY - conf.dot.radius.max * 2);
      this.get()[1].attr('x', layerX + conf.dot.radius.max * 2 + this.text.length * 3);
      return this.get()[1].attr('y', layerY - conf.dot.radius.max * 2 + 9);
    };

    Helper.hide = function() {
      return this.get().hide();
    };

    Helper.show = function() {
      return this.get().show();
    };

    function Helper() {}

    return Helper;

  })();

  this.links = [];

  Sha = (function() {

    function Sha() {}

    Sha.elements = [];

    Sha.parse = function(sha) {
      var element, element_start, i, id, j, make, make_start, name, param, params, params_start, prop, quote, result, selection, x, y, _ref;
      for (i in sha) {
        if (!make && !selection && sha.substr(i, 4) === 'Make') {
          make_start = true;
        } else {
          if (make_start && !selection && sha[i] === '(') {
            make_start = i;
          } else {
            if (!make && make_start && sha[i] === ')') {
              make = sha.substr(make_start, i - make_start).substr(1);
            }
          }
        }
        if (!selection && sha.substr(i, 3) === 'Add') {
          selection = true;
        } else {
          if (selection && !element && !element_start && sha[i] === '(') {
            element_start = i;
          } else {
            if (selection && !element && element_start && sha[i] === ')') {
              element = sha.substr(element_start, i - element_start).substr(1);
            } else {
              if (selection && element && sha[i] === '{') {
                params_start = i;
              } else {
                if (selection && element && sha[i] === '"') {
                  quote = !quote;
                } else {
                  if (selection && element && !quote && sha[i] === '}') {
                    params = sha.substr(params_start, i - params_start).substr(1).split('\n');
                    prop = [];
                    for (j in params) {
                      if (params[j].trim('   \t\r') === "") {
                        continue;
                      }
                      param = params[j].trim('   \t\r').split('=', 2);
                      prop.push({
                        name: param[0],
                        value: param[1]
                      });
                    }
                    _ref = element.split(","), name = _ref[0], id = _ref[1], x = _ref[2], y = _ref[3];
                    result = "";
                    $.ajax({
                      url: "/delphi/conf/" + name + ".ini",
                      async: false,
                      dataType: "text"
                    }).success(function(data) {
                      return result = parseINIString(data);
                    });
                    this.elements.push({
                      name: name,
                      id: id,
                      x: x,
                      y: y,
                      params: prop,
                      ini: result
                    });
                    selection = false;
                    quote = false;
                    element = false;
                    element_start = false;
                    params_start = false;
                  }
                }
              }
            }
          }
        }
      }
      return this.elements;
    };

    return Sha;

  })();

  $(function() {});

  sha = $('textarea#sha_viewer').val();

  elements = Sha.parse(sha);

  for (_i = 0, _len = elements.length; _i < _len; _i++) {
    el = elements[_i];
    elements[el.id] = new Element(el.name, el.x, el.y, el.params, el.id, el.ini);
    elements[el.id].save();
  }

  for (_j = 0, _len1 = links.length; _j < _len1; _j++) {
    link = links[_j];
    items = elements[link.eid].element.items;
    for (_k = 0, _len2 = items.length; _k < _len2; _k++) {
      item = items[_k];
      if (item.name && item.name === link[0]) {
        bbox = item.getBBox();
        start_x = bbox.x + conf.dot.radius.min;
        start_y = bbox.y + conf.dot.radius.min;
        _ref = link[1].split(':'), stop_id = _ref[0], stop_name = _ref[1];
        _ref1 = elements[stop_id].element.items;
        for (_l = 0, _len3 = _ref1.length; _l < _len3; _l++) {
          item2 = _ref1[_l];
          if (item2.name && item2.name === stop_name) {
            bbox = item2.getBBox();
            stop_x = bbox.x + conf.dot.radius.min;
            stop_y = bbox.y + conf.dot.radius.min;
            l = paper.path("M" + start_x + "," + start_y + ",S" + (stop_x - 10) + "," + (stop_y / 0.95) + "," + stop_x + "," + stop_y);
            l.attr({
              stroke: "blue",
              "stroke-width": 2,
              fill: "none"
            });
            l.start_id = link.eid;
            l.stop_id = stop_id;
            elements[link.eid].element.push(l);
            elements[stop_id].element.push(l);
            item2.toFront();
            item.toFront();
            break;
          }
        }
      }
      break;
    }
  }

}).call(this);
