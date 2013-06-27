//@ sourceMappingURL=app.map
// Generated by CoffeeScript 1.6.1
(function() {
  var Element, Helper, Sha, conf, elements, handleFileSelect, paper;

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
      indent: 6,
      offset: 5
    },
    element: {
      border: {
        color: "#555",
        size: 1
      },
      size: 40,
      opacity: .1,
      hover: {
        opacity: .4,
        time: 300
      },
      color: "red"
    },
    icon: {
      path: "/delphi/icon/",
      size: 24
    },
    conf: {
      path: "/delphi_utf/conf/"
    },
    link: {
      color: {
        vars: 'blue',
        events: '#F00'
      },
      size: 2,
      opacity: 0.7
    }
  };

  paper = Raphael(119, 88, 762, 443);

  paper.canvas.id = "canvas";

  Element = (function() {

    Element.drag = false;

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
      i = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      for (param in params) {
        str = params[param].split('|');
        if (param[0] === "*" && str[2] !== "2") {
          continue;
        }
        types = ['', 'do', 'on', 'top', 'bot', 'bot'];
        type_num = parseInt(str[1] || 2);
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
        if (property && property[param] !== void 0) {
          dot_color = "#FFFF00";
          border_color = "#DAA520";
        }
        if (param[0] === "*") {
          param = param.substr(1);
          dot_color = "#00CCCC";
          border_color = "#229999";
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
          link = link.replace(/\)\(/g, ',').replace(/\[\(/g, '').replace(/\)\]/g, '').split(',');
          link.eid = this.id;
          _results.push(links.push(link));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    Element.prototype.save = function() {
      var dots, element, move, start, up;
      this.icon = paper.image("" + conf.icon.path + this.name + ".ico", this.x + (this.size - 32) / 2 + 4, this.y + (this.size - 32) / 2 + 4, this.icon_size, this.icon_size);
      this.rect = paper.rect(this.x, this.y, this.size, this.size, 3).attr({
        fill: this.icon,
        "fill-opacity": conf.element.opacity,
        "stroke-width": conf.element.border.size,
        stroke: conf.element.border.color
      });
      this.rect.eid = this.id;
      this.rect.name = this.name;
      this.element = paper.set();
      this.element.eid = this.id;
      this.rect.hover(function(e) {
        Helper.setText(" " + this.name + " ");
        Helper.move(e.layerX, e.layerY);
        return Helper.show();
      }, function() {
        return Helper.hide();
      });
      dots = this.ini.Methods;
      this.draw_dots(dots, this.ini.Property);
      this.element.push(this.rect, this.icon);
      element = this.element;
      start = function() {
        var e, el, path, path_num, _i, _j, _len, _len1, _ref, _results;
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
            e.cached = {
              path: path
            };
          }
        }
        if (this.type !== 'circle') {
          this.animate({
            "fill-opacity": conf.element.hover.opacity
          }, conf.element.hover.time, ">");
        }
        $("#props").empty();
        _ref = elements[this.eid].params;
        _results = [];
        for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
          el = _ref[_j];
          if (el.name.substr(0, 4) !== "link") {
            if (el.name === "Data" && el.value === "Null()") {
              el.value = "";
            } else if (el.name === "Color") {

            } else if (el.name === "Icon" && el.value === "[]") {
              el.value = "[]";
            }
            _results.push($("#props").append("<tr>           <td>" + el.name + "</td>           <td class=\"value\">             <input type=\"\" value=\"" + el.value + "\"/>           </td>          </tr>"));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      };
      move = function(dx, dy, x, y, e) {
        var el, path, _i, _len, _results;
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
              path[e.path_num][3] = e.stop.x - dx;
              path[e.path_num][4] = e.stop.y - dy;
              path[1][1] += path[1][3] / path[0][1];
              path[1][2] += path[1][4] / path[0][2];
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
            "fill-opacity": conf.element.opacity
          }, 500, ">");
        }
      };
      paper.set(this.element).drag(move, start, up).toBack();
      paper.renderfix();
      return paper.safari();
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

    Sha.getConf = function(name) {
      var result;
      result = "";
      $.ajax({
        url: "" + conf.conf.path + name + ".ini",
        async: false,
        dataType: "text"
      }).success(function(data) {
        return result = parseINIString(data);
      });
      return result;
    };

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
                    result = this.getConf(name);
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

  elements = [];

  this.clearAll = function() {
    var links;
    elements = [];
    links = [];
    Sha.elements = [];
    return paper.clear();
  };

  this.drawAll = function() {
    var bbox, color, el, item, item2, items, l, link, sha, start_x, start_y, stop_id, stop_name, stop_x, stop_y, _i, _j, _len, _len1, _results;
    sha = $('textarea#sha_viewer').val();
    elements = Sha.parse(sha);
    for (_i = 0, _len = elements.length; _i < _len; _i++) {
      el = elements[_i];
      elements[el.id] = new Element(el.name, el.x, el.y, el.params, el.id, el.ini);
      elements[el.id].save();
    }
    _results = [];
    for (_j = 0, _len1 = links.length; _j < _len1; _j++) {
      link = links[_j];
      if (!elements[link.eid]) {
        console.error("dots undefined " + link.eid);
        continue;
      }
      items = elements[link.eid].element.items;
      _results.push((function() {
        var _k, _l, _len2, _len3, _ref, _ref1, _results1;
        _results1 = [];
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
                l = paper.path("M" + start_x + "," + start_y + ",S" + (start_x + start_x / stop_x) + "," + (stop_y + stop_y / start_y) + "," + stop_x + "," + stop_y);
                color = conf.link.color.events;
                if (item.name.substr(0, 2) !== "on") {
                  color = conf.link.color.vars;
                }
                l.attr({
                  stroke: color,
                  "stroke-width": conf.link.size,
                  fill: "none",
                  opacity: conf.link.opacity
                });
                l.start_id = link.eid;
                l.stop_id = stop_id;
                elements[link.eid].element.push(l);
                elements[stop_id].element.push(l);
                item2.toFront();
                item.toFront();
                continue;
              }
            }
          }
          continue;
        }
        return _results1;
      })());
    }
    return _results;
  };

  drawAll();

  handleFileSelect = function(evt) {
    var f, files, reader;
    files = evt.target.files;
    f = files[0];
    if (f.name.indexOf('.sha') === -1) {
      alert("Это не схема!");
      return 0;
    } else {
      reader = new FileReader();
    }
    reader.onload = (function(theFile) {
      return function(e) {
        var span;
        span = document.getElementById('sha_viewer');
        span.innerHTML = e.target.result;
        clearAll();
        return drawAll();
      };
    })(f);
    return reader.readAsText(f, "WINDOWS-1251");
  };

  document.getElementById('files').addEventListener('change', handleFileSelect, false);

  $.get('/delphi_utf/all.json', function(data) {
    var el, i, _i, _len, _results;
    i = 0;
    _results = [];
    for (_i = 0, _len = data.length; _i < _len; _i++) {
      el = data[_i];
      if (i >= 30) {
        break;
      }
      $('.elements').append("<img class=\"btn\" data-name=\"" + el + "\" src=\"/delphi/icon/" + el + ".ico\"/>");
      _results.push(i++);
    }
    return _results;
  });

  $('.elements img').live('click', function() {
    var id, name, result;
    id = Math.random() * (10000000 - 1000000) + 1000000;
    name = $(this).data('name');
    result = Sha.getConf(name);
    elements[id] = new Element(name, 0, 0, {}, id, result);
    return elements[id].save();
  });

}).call(this);
