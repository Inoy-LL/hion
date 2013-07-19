//@ sourceMappingURL=app.map
// Generated by CoffeeScript 1.6.1
(function() {
  var Element, ElementsPanel, Helper, Paper, PropsPanel, RaphaelAdapter, Scheme, WIN_COLORS, conf, getRandonColor, handleFileSelect,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  conf = {
    dot: {
      radius: {
        min: 2.5,
        max: 5
      },
      color: "#090",
      color2: "#009",
      border: {
        color: "#040",
        color2: "#004",
        size: 1
      },
      hover_color: "red",
      indent: 6.5,
      offset: 5
    },
    element: {
      border: {
        color: "#555",
        size: 1
      },
      size: 36,
      opacity: .25,
      hover: {
        opacity: .5,
        time: 300
      },
      color: "red",
      glow: {
        enable: true,
        color: "#0F0",
        width: 5,
        opacity: 0.5
      },
      selected: {
        color: "yellow"
      }
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
        events: '#F00',
        new_var: '#3399FF',
        new_event: '#FF6600',
        random: true
      },
      glow: {
        enable: true,
        color: "#0F0",
        width: 5,
        opacity: 0.5
      },
      size: 2,
      active_size: 4,
      opacity: 0.7,
      new_link_opacity: 1,
      min_random_color: 0x777777,
      path: function(start_x, start_y, stop_x, stop_y, type) {
        var x, y, _ref, _ref1, _ref2, _ref3;
        x = Math.abs(stop_x - start_x) / 2;
        y = Math.abs(stop_y - start_y) / 2;
        if (type === 2) {
          if ((-15 < (_ref = stop_x - start_x) && _ref > 15)) {
            if ((-20 < (_ref1 = stop_y - start_y) && _ref1 > 20)) {
              x = 10;
            }
          }
          return "M" + start_x + "," + start_y + "," + (start_x + x) + "," + start_y + "," + (stop_x - x) + "," + stop_y + ",L" + stop_x + "," + stop_y;
        } else {
          if ((-15 < (_ref2 = stop_y - start_y) && _ref2 > 15)) {
            if ((-20 < (_ref3 = stop_x - start_x) && _ref3 > 20)) {
              y = 10;
            }
          }
          return "M" + start_x + "," + start_y + "," + start_x + "," + (start_y - y) + "," + stop_x + "," + (stop_y + y) + ",L" + stop_x + "," + stop_y;
        }
      }
    },
    paper: {
      offset: {
        x: 229,
        y: 56
      },
      size: {
        width: 619,
        heigth: 895
      },
      id: "canvas",
      contextmenu: false
    },
    helper: {
      color: {
        fill: "#eee",
        text: "black"
      }
    }
  };

  Scheme = (function() {
    var PrivateClass, instance;

    function Scheme() {}

    Scheme.create_line = false;

    Scheme.selected_element = null;

    Scheme.links = {};

    instance = null;

    Scheme.elements = {};

    Scheme.get = function() {
      return instance != null ? instance : instance = new PrivateClass();
    };

    Scheme.getPaper = function() {
      return this.get().getPaper();
    };

    PrivateClass = (function() {

      PrivateClass.prototype.paper = null;

      function PrivateClass() {
        this.paper = Paper.prototype.create();
      }

      PrivateClass.prototype.getPaper = function() {
        return this.paper;
      };

      return PrivateClass;

    })();

    Scheme.addElement = function(name, id, x, y, params) {
      var el;
      el = new Element(name, id, x, y, params);
      this.elements[el.id] = el;
      this.links[el.id] = el.links;
      return el;
    };

    Scheme.clear = function() {
      this.create_line = false;
      this.links = {};
      return this.getPaper().clear();
    };

    Scheme.parse = function(sha) {
      var element, element_start, elements, i, id, j, make, make_start, name, param, params, params_start, prop, quote, selection, x, y, _ref;
      elements = [];
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
                    elements.push({
                      name: name,
                      id: id,
                      x: x,
                      y: y,
                      params: prop
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
      return elements;
    };

    Scheme.load = function(sha) {
      var dot, element, elinks, id, l, link, start_dot, start_x, start_y, stop, stop_dot, stop_x, stop_y, _i, _len, _ref, _results;
      _ref = this.parse(sha);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        element = _ref[_i];
        if (element.name !== "HubEx") {
          this.addElement(element.name, element.id, element.x, element.y, element.params);
        }
      }
      _results = [];
      for (id in this.links) {
        elinks = this.links[id];
        _results.push((function() {
          var _j, _k, _l, _len1, _len2, _len3, _ref1, _ref2, _ref3, _ref4, _results1;
          _results1 = [];
          for (_j = 0, _len1 = elinks.length; _j < _len1; _j++) {
            link = elinks[_j];
            _ref1 = this.elements[id].dots;
            for (_k = 0, _len2 = _ref1.length; _k < _len2; _k++) {
              dot = _ref1[_k];
              if (dot.name !== link.start) {
                continue;
              }
              _ref2 = Paper.prototype.getDotPosition(dot), start_x = _ref2[0], start_y = _ref2[1];
              start_dot = dot;
            }
            stop = link.stop;
            if (this.elements[stop[0]]) {
              _ref3 = this.elements[stop[0]].dots;
              for (_l = 0, _len3 = _ref3.length; _l < _len3; _l++) {
                dot = _ref3[_l];
                if (dot.name !== stop[1]) {
                  continue;
                }
                _ref4 = Paper.prototype.getDotPosition(dot), stop_x = _ref4[0], stop_y = _ref4[1];
                stop_dot = dot;
              }
            }
            l = Paper.prototype.drawLink(link.start, start_x, start_y, stop_x, stop_y, this.elements[id], this.elements[stop[0]]);
            l.dot1 = start_dot;
            l.dot2 = stop_dot;
            start_dot.link = l;
            _results1.push(stop_dot.link = l);
          }
          return _results1;
        }).call(this));
      }
      return _results;
    };

    return Scheme;

  })();

  Element = (function() {

    function Element(name, id, x, y, params) {
      var DOT, border_color, color, count, dot, hide, hint, i, ini_sub, key, link, param, path, plus, prop, show, start, stop, sub, sub_, subs, type, _i, _j, _k, _len, _len1, _ref, _ref1;
      this.name = name;
      this.id = id;
      this.x = x;
      this.y = y;
      this.params = params;
      this.x = parseInt(x);
      this.y = parseInt(y);
      if (name.substr(0, 3) === 'Hub') {
        this.size = 20;
        this.icon_size = 16;
      } else {
        this.size = conf.element.size;
        this.icon_size = conf.icon.size;
      }
      this.ini = this.getConf(name);
      this.methods = this.ini.Methods;
      this.props = {};
      this.dots = [];
      for (key in this.ini.Methods) {
        _ref = this.ini.Methods[key].split('|'), hint = _ref[0], type = _ref[1], show = _ref[2];
        name = key;
        hide = false;
        plus = false;
        if (key.indexOf('*') !== -1) {
          hide = true;
        }
        if (key.indexOf('+') !== -1) {
          plus = true;
        }
        if (name[0] === '*' || name[0] === '+') {
          name = name.substr(1);
        }
        if (name.indexOf('%') !== -1) {
          start = name.indexOf('%');
          name = name.split("%")[0];
        }
        this.props[name] = {
          hint: hint,
          type: type,
          plus: plus,
          hide: hide
        };
      }
      if (this.ini.Type) {
        if (this.ini.Type.Sub) {
          subs = this.ini.Type.Sub.split(",");
          type = 0;
          for (_i = 0, _len = subs.length; _i < _len; _i++) {
            sub_ = subs[_i];
            type++;
            if (sub_ !== "") {
              sub = sub_.split("|");
              ini_sub = this.ini.Property[sub[0]].split("|");
              if (this.props[sub[0]]) {
                count = parseInt(this.props[sub[0]].value);
              } else {
                count = parseInt(ini_sub[2]);
              }
              for (i = _j = 1; 1 <= count ? _j <= count : _j >= count; i = 1 <= count ? ++_j : --_j) {
                this.props[sub[1] + i] = {
                  hint: "",
                  type: type,
                  plus: false,
                  hide: false
                };
              }
            }
          }
        }
      }
      this.links = [];
      _ref1 = this.params;
      for (_k = 0, _len1 = _ref1.length; _k < _len1; _k++) {
        param = _ref1[_k];
        if (param.name.substr(0, 4) === 'link') {
          link = param.name.substr(5, param.name.length - 6);
          link = link.replace(/\)\(/g, ',').replace(/\[\(/g, '').replace(/\)\]/g, '').replace(/,\[\]/, '').split(',');
          start = link[0];
          stop = link[1].split(':');
          path = link.slice(2);
          this.links.push({
            start: start,
            stop: stop,
            path: path
          });
        } else {
          if (this.props[param.name]) {
            this.props[param.name].value = param.value;
            this.props[param.name].hide = false;
          } else {
            this.props[param.name] = {
              value: param.value,
              hide: false,
              plus: false,
              hint: param.name,
              type: 0
            };
          }
        }
      }
      this.element = Paper.prototype.drawElement(this.size, this.icon_size, this.name, this.x, this.y, this.id);
      i = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      DOT = {
        "do": 1,
        on: 2,
        top: 4,
        bot: 3
      };
      for (key in this.props) {
        prop = this.props[key];
        if (prop.hide) {
          continue;
        }
        type = parseInt(prop.type);
        x = this.x;
        y = this.y;
        if (type === DOT.top || type === DOT.bot) {
          x = x + i[type] * conf.dot.indent + conf.dot.offset;
          color = conf.dot.color2;
          border_color = conf.dot.border.color2;
          if (type === DOT.bot) {
            y += this.size;
          }
        } else {
          if (type === DOT["do"] || type === DOT.on) {
            y = y + i[type] * conf.dot.indent + conf.dot.offset;
            color = conf.dot.color;
            border_color = conf.dot.border.color;
            if (type === DOT.on) {
              x += this.size;
            }
          } else {
            continue;
          }
        }
        dot = Paper.prototype.drawDot(color, border_color, x, y, key, prop.hint, this.element, type);
        this.dots.push(dot);
        i[type]++;
      }
      Paper.prototype.bindElementEvents(this.element, this.props);
    }

    Element.prototype.getConf = function(name) {
      var result;
      result = this.config;
      if (!this.conf) {
        $.ajax({
          url: "" + conf.conf.path + name + ".ini",
          async: false,
          dataType: "text"
        }).success(function(data) {
          return result = parseINIString(data);
        });
      }
      return result;
    };

    return Element;

  })();

  RaphaelAdapter = (function() {

    function RaphaelAdapter() {}

    RaphaelAdapter.prototype.create = function() {
      var paper;
      paper = Raphael("poligon", conf.paper.size.width, conf.paper.size.heigth);
      paper.canvas.oncontextmenu = function() {
        return conf.paper.contextmenu;
      };
      paper.canvas.onmousemove = function(e) {
        var path;
        if (Scheme.create_line) {
          path = Scheme.create_line.attr('path');
          return Scheme.create_line.attr('path', conf.link.path(path[0][1], path[0][2], e.layerX, e.layerY, Scheme.create_line.dot_type));
        }
      };
      paper.canvas.onmousedown = function(e) {
        if (Scheme.create_line && e.which === 3) {
          Scheme.create_line.remove();
          return Scheme.create_line = false;
        }
      };
      return paper;
    };

    RaphaelAdapter.prototype.drawElement = function(size, icon_size, name, x, y, id) {
      var element, glow, icon, rect;
      icon = Scheme.getPaper().image("" + conf.icon.path + name + ".ico", x + (size - icon_size) / 2, y + (size - icon_size) / 2, icon_size, icon_size);
      rect = Scheme.getPaper().rect(x, y, size, size, 3).attr({
        fill: icon,
        "fill-opacity": conf.element.opacity,
        "stroke-width": conf.element.border.size,
        stroke: conf.element.border.color
      });
      element = Scheme.getPaper().set();
      element.eid = id;
      rect.hover(function(e) {
        Helper.setText(" " + name + " ");
        Helper.move(e.pageX - conf.paper.offset.x, e.pageY - conf.paper.offset.y);
        return Helper.show();
      }, function() {
        return Helper.hide();
      });
      rect.el = element;
      element.push(rect, icon);
      if (conf.element.glow.enable) {
        glow = rect.glow({
          color: conf.element.glow.color,
          width: conf.element.glow.width,
          opacity: conf.element.glow.opacity
        });
        return element.push(glow);
      }
    };

    RaphaelAdapter.prototype.drawDot = function(color, border_color, x, y, prop_name, prop_hint, element, type) {
      var dot, hint;
      hint = "" + prop_name + ": " + prop_hint;
      dot = Scheme.getPaper().circle(x, y, conf.dot.radius.min).attr({
        fill: color,
        stroke: border_color,
        "stroke-width": 1
      });
      element.push(dot);
      dot.text = hint;
      dot.name = prop_name;
      dot.default_color = color;
      dot.dot_type = type;
      dot.el = element;
      dot.hover(function(e) {
        Paper.prototype.hover_dot_animate(this, 'on');
        Helper.setText(this.text);
        Helper.move(e.pageX - conf.paper.offset.x, e.pageY - conf.paper.offset.y);
        Helper.show();
        if (this.link) {
          this.link.attr({
            "stroke-width": conf.link.active_size
          });
          Paper.prototype.hover_dot_animate(this.link.dot1, 'on');
          if (this.link.dot2) {
            return Paper.prototype.hover_dot_animate(this.link.dot2, 'on');
          }
        }
      }, function() {
        Paper.prototype.hover_dot_animate(this, 'off');
        if (this.link) {
          this.link.attr({
            "stroke-width": conf.link.size
          });
          Paper.prototype.hover_dot_animate(this.link.dot1, 'off');
          if (this.link.dot2) {
            Paper.prototype.hover_dot_animate(this.link.dot2, 'off');
          }
        }
        return Helper.hide();
      });
      dot.click(function(e) {
        var bbox, last, mass, path, start_x, start_y, stop_x, stop_y, this_type;
        if (this.link) {
          return false;
        }
        if (Scheme.create_line) {
          this_type = this.dot_type;
          mass = [0, 1, -1, 2, -2];
          if (mass[Scheme.create_line.dot_type] + mass[this_type] !== 0) {
            return false;
          }
          this.el.push(Scheme.create_line);
          bbox = this.getBBox();
          start_x = bbox.x + conf.dot.radius.min * 2;
          start_y = bbox.y + conf.dot.radius.min * 2;
          path = Scheme.create_line.attr('path');
          last = path[1].length - 1;
          path[1][last - 1] = start_x;
          path[1][last] = start_y;
          Scheme.create_line.attr('path', path);
          color = conf.link.color.events;
          if (this.dot_type > 2) {
            color = conf.link.color.vars;
          }
          if (conf.link.color.random) {
            color = getRandonColor();
          }
          Scheme.create_line.attr({
            "stroke-dasharray": "",
            "stroke-width": conf.link.size,
            "stroke": color,
            opacity: conf.link.opacity
          });
          Scheme.create_line.toBack();
          dot.link = Scheme.create_line;
          Scheme.create_line.dot2 = dot;
          Scheme.create_line = false;
          return false;
        } else {
          bbox = this.getBBox();
          start_x = bbox.x + conf.dot.radius.min * 2;
          start_y = bbox.y + conf.dot.radius.min * 2;
          stop_x = e.layerX;
          stop_y = e.layerY;
          Scheme.create_line = Scheme.getPaper().path(conf.link.path(start_x, start_y, stop_x, stop_y, Scheme.create_line.dot_type));
          color = conf.link.color.new_event;
          Scheme.create_line.dot_type = this.dot_type;
          Scheme.create_line.dot1 = dot;
          Scheme.create_line.el = dot.el;
          Scheme.create_line.start_rid = dot.el[0].id;
          dot.el.push(Scheme.create_line);
          dot.link = Scheme.create_line;
          if (this.dot_type > 2) {
            color = conf.link.color.new_var;
          }
          if (conf.link.color.random) {
            color = getRandonColor();
          }
          Scheme.create_line.attr({
            stroke: color,
            "stroke-width": conf.link.size + 1,
            fill: "none",
            "stroke-dasharray": "- ",
            opacity: conf.link.new_link_opacity
          });
          Scheme.create_line.hover(function(e) {
            return this.attr({
              "stroke-width": conf.link.active_size
            });
          }, function() {
            return this.attr({
              "stroke-width": conf.link.size
            });
          });
          return Scheme.create_line.toBack();
        }
      });
      return dot;
    };

    RaphaelAdapter.prototype.bindElementEvents = function(element, props) {
      var move, start, up;
      start = function() {
        var el, _i, _len, _ref;
        if (this.type !== 'circle') {
          this.animate({
            "fill-opacity": conf.element.hover.opacity
          }, conf.element.hover.time, ">");
          if (!this.lx) {
            this.lx = 0;
            this.ly = 0;
            this.ox = 0;
            this.oy = 0;
            this.pos = true;
          }
          if (this.el) {
            _ref = this.el;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              el = _ref[_i];
              if (el.type === "path") {
                el.old_path = el.attr("path");
              }
            }
          }
          return PropsPanel.prototype.setProps(props);
        }
      };
      move = function(dx, dy) {
        var dot_type, l, last, path, _i, _len, _ref, _results;
        this.lx = dx + this.ox;
        this.ly = dy + this.oy;
        this.pos = !this.pos;
        if (this.pos && !!!window.chrome) {
          return false;
        }
        if (this.type !== 'circle') {
          this.lx = dx + this.ox;
          this.ly = dy + this.oy;
          element.transform("t" + this.lx + "," + this.ly);
          if (this.el) {
            _ref = this.el;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              l = _ref[_i];
              if (l.type !== "path") {
                continue;
              }
              path = l.attr('path');
              last = path.length - 1;
              l.attr('transform', "");
              if (l.dot1.dot_type === 1 || l.dot1.dot_type === 2) {
                dot_type = 2;
              } else {
                dot_type = 1;
              }
              if (l.start_rid !== this.id) {
                path[last][1] = l.old_path[last][1] + dx;
                path[last][2] = l.old_path[last][2] + dy;
              } else {
                path[0][1] = l.old_path[0][1] + dx;
                path[0][2] = l.old_path[0][2] + dy;
              }
              path = conf.link.path(path[0][1], path[0][2], path[last][1], path[last][2], dot_type);
              _results.push(l.attr({
                'path': path
              }));
            }
            return _results;
          }
        }
      };
      up = function() {
        var dot1, dot2, dot_type, el, path, size, _i, _len, _ref, _results;
        if (this.type !== 'circle') {
          this.animate({
            "fill-opacity": conf.element.opacity
          }, 500, ">");
          this.ox = this.lx;
          this.oy = this.ly;
          if (this.el) {
            _ref = this.el;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              el = _ref[_i];
              if (el.type === "path") {
                path = el.attr("path");
                dot1 = el.dot1.getBBox();
                dot2 = el.dot2.getBBox();
                size = conf.dot.radius.min;
                if (el.dot1.dot_type === 1 || el.dot1.dot_type === 2) {
                  dot_type = 2;
                } else {
                  dot_type = 1;
                }
                _results.push(el.attr("path", conf.link.path(dot1.x + size, dot1.y + size, dot2.x + size, dot2.y + size, dot_type)));
              } else {
                _results.push(void 0);
              }
            }
            return _results;
          }
        }
      };
      Scheme.getPaper().set(element).drag(move, start, up);
      return element.click(function() {
        if (this.type !== 'circle') {
          if (Scheme.prototype.selected_element) {
            Scheme.prototype.selected_element.attr('stroke', conf.element.border.color);
          }
          Scheme.prototype.selected_element = this;
          return this.attr({
            'stroke': conf.element.selected.color
          });
        }
      });
    };

    RaphaelAdapter.prototype.getDotPosition = function(dot) {
      return [dot.attr('cx'), dot.attr('cy')];
    };

    RaphaelAdapter.prototype.drawLink = function(name, start_x, start_y, stop_x, stop_y, el, el2) {
      var color, dot_type, l;
      color = conf.link.color.events;
      if (name.substr(0, 2) !== "on" && name.substr(0, 2) !== "do") {
        color = conf.link.color.vars;
        dot_type = 1;
      } else {
        dot_type = 2;
      }
      l = Scheme.getPaper().path(conf.link.path(start_x, start_y, stop_x, stop_y, dot_type));
      if (conf.link.color.random) {
        color = getRandonColor();
      }
      l.attr({
        stroke: color,
        "stroke-width": conf.link.size,
        fill: "none",
        opacity: conf.link.opacity
      });
      l.toBack();
      l.hover(function(e) {
        this.attr({
          "stroke-width": conf.link.active_size
        });
        Paper.prototype.hover_dot_animate(this.dot1, 'on');
        return Paper.prototype.hover_dot_animate(this.dot2, 'on');
      }, function() {
        this.attr({
          "stroke-width": conf.link.size
        });
        Paper.prototype.hover_dot_animate(this.dot1, 'off');
        return Paper.prototype.hover_dot_animate(this.dot2, 'off');
      });
      l.start_rid = el.element[0].id;
      el.element.push(l);
      if (el2) {
        el2.element.push(l);
      }
      return l;
    };

    RaphaelAdapter.prototype.hover_dot_animate = function(dot, type) {
      if (type == null) {
        type = 'on';
      }
      if (type === 'on') {
        return dot.attr({
          fill: conf.dot.hover_color,
          r: conf.dot.radius.max
        });
      } else {
        return dot.attr({
          fill: dot.default_color,
          r: conf.dot.radius.min
        });
      }
    };

    return RaphaelAdapter;

  })();

  Paper = (function(_super) {

    __extends(Paper, _super);

    function Paper() {
      return Paper.__super__.constructor.apply(this, arguments);
    }

    return Paper;

  })(RaphaelAdapter);

  PropsPanel = (function() {

    function PropsPanel() {}

    PropsPanel.prototype.setProps = function(props) {
      var bold, checkbox_types, color, font, italic, name, prop, size, underline, value_string, _ref, _results;
      $("#props").empty();
      _results = [];
      for (name in props) {
        prop = props[name];
        if (name && name.substr(0, 2) !== "on" && name.substr(0, 2) !== "do") {
          if (prop.value && prop.value[0] === '"') {
            prop.value = prop.value.substr(1, prop.value.length - 2);
          }
          if (prop.value === "Null()" || prop.value === void 0) {
            prop.value = "";
          } else if (name === "Color") {
            prop.value = parseInt(prop.value) + 16777201;
          } else if (prop.name === "Icon" && prop.value === "[]") {
            prop.value = "[]";
          }
          value_string = "<input type=\"text\" value=\"" + prop.value + "\"/>";
          color = "";
          if (name === "Color") {
            if (prop.value) {
              color = WIN_COLORS[prop.value].rgb;
              name = WIN_COLORS[prop.value].name;
            } else {
              color = "white";
              name = "white";
            }
            value_string = "<select style=\"background-color: " + color + "\"><option selected>" + name + "</option></select>";
          }
          if (name === "Font") {
            checkbox_types = {
              "0": "",
              "1": "checked"
            };
            _ref = prop.value.substr(1, prop.value.length - 2).split(','), font = _ref[0], size = _ref[1], bold = _ref[2], italic = _ref[3], underline = _ref[4];
            value_string = "            <span class=\"font_name\" style=\"font-family: " + font + "\">" + font + "</span>,<span class=\"font_size\">" + size + "</span><button style=\"margin-left: 4px;\" class=\"button font_selector_btn\"><a href=\"#\"> Изменить </a></button>            <div class=\"font_selector\" style=\"display: none;\">                <div>Font: <input class=\"font\" value=\"" + font + "\" /></div>                <div>Size: <input type=\"number\" class=\"size\" value=\"" + size + "\" /></div>                <div>Bold: <input type=\"checkbox\" class=\"bold\" " + checkbox_types[bold] + " /></div>                <div>Italic: <input type=\"checkbox\" class=\"italic\" " + checkbox_types[italic] + " /></div>                <div>Underline: <input type=\"checkbox\" class=\"underline\" " + checkbox_types[underline] + " /></div>            </div>";
          }
          $("#props").append("<tr>                               <td style=\"vertical-align: top;\">" + name + "</td>                               <td class=\"value\">                               " + value_string + "                               </td>                               </tr>");
          if (name === "Font") {
            $(".font").fontSelector(function(font) {
              $('.font_name').css("font-family", font);
              return $('.font_name').text(font.split(',')[0]);
            });
            $('.font_selector_btn').toggle(function() {
              $(this).parent().find('.font_selector').slideDown();
              return $(this).html('<a href="#"> Скрыть </a>');
            }, function() {
              $(this).parent().find('.font_selector').slideUp();
              return $(this).html('<a href="#">  Изменить </a>');
            });
            _results.push($('.font_selector .size').bind('keyup mouseup', function() {
              return $('.font_size').text($(this).val());
            }));
          } else {
            _results.push(void 0);
          }
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    return PropsPanel;

  })();

  getRandonColor = function() {
    var col, color;
    col = Math.random() * 0xFFFFFF << 0;
    if (col > conf.link.min_random_color) {
      col -= conf.link.min_random_color;
    }
    color = '#' + col.toString(16);
    if (color.length - 1 % 3 !== 0) {
      color = color.substr(0, 4);
    }
    return color;
  };

  Scheme.load($('textarea#sha_viewer').val());

  $('#redraw').click(function() {
    Scheme.clear();
    return Scheme.load($('textarea#sha_viewer').val());
  });

  Helper = (function() {
    var helper;

    function Helper() {}

    helper = null;

    Helper.get = function() {
      if (helper == null) {
        Scheme.getPaper().setStart();
        Scheme.getPaper().rect(0, 0, 1, 20, 4).attr({
          "fill": conf.helper.color.fill
        });
        Scheme.getPaper().text(0, 10, "").attr({
          "fill": conf.helper.color.text
        });
        helper = Scheme.getPaper().setFinish().toFront().hide();
      }
      return helper;
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

    return Helper;

  })();

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

  ElementsPanel = (function() {
    var elements, last_gid;

    function ElementsPanel() {}

    elements = [];

    last_gid = 0;

    ElementsPanel.create = function() {
      $.ajax({
        url: '/delphi_utf/Elements.json',
        dataType: 'json'
      }).success(function(data) {
        var g, html, _i, _len, _ref;
        html = "";
        _ref = data.groups;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          g = _ref[_i];
          if (g[1] !== "") {
            html += "<div class=\"group\" id=\"g" + g[0] + "\" data-id=\"" + g[0] + "\"><div class=\"name\">" + g[2] + "</div><div class=\"elements\"></div></div></div>";
          }
        }
        $('.elements').append(html);
        elements = data.elements;
        return ElementsPanel.element_panel_select(1);
      });
      ElementsPanel.bind_events();
      return true;
    };

    ElementsPanel.element_panel_select = function(gid) {
      var el, elements_, _i, _len;
      $('.elements > .group > .elements > *').slideUp().empty();
      if (last_gid === gid) {
        last_gid = -1;
        return false;
      }
      elements_ = "";
      for (_i = 0, _len = elements.length; _i < _len; _i++) {
        el = elements[_i];
        if (el[3] === gid) {
          elements_ += "<span class=\"el\"><img data-name=\"" + el[1] + "\" src=\"/delphi/icon/" + el[1] + ".ico\"/></span>";
        }
      }
      $("#g" + gid + " > .elements").append(elements_).hide().slideDown();
      return last_gid = gid;
    };

    ElementsPanel.bind_events = function() {
      $('.elements > .group').live('click', function() {
        return ElementsPanel.element_panel_select($(this).data('id'));
      });
      return $('.elements img').live('click', function() {
        var id, name;
        id = Math.round(Math.random() * (10000000 - 1000000) + 1000000);
        name = $(this).data('name');
        Scheme.addElement(name, id, 350, 350, {});
        return false;
      });
    };

    return ElementsPanel;

  })();

  $('#left_menu_min').toggle(function() {
    $(this).text("+ Элементы");
    return $('#left_menu').animate({
      left: "-=200px"
    });
  }, function() {
    $(this).text("- Элементы");
    return $('#left_menu').animate({
      left: "+=200px"
    });
  });

  ElementsPanel.create();

  WIN_COLORS = {"0":{"rgb":"#000000","name":"clBlack"},"128":{"rgb":"#800000","name":"clMaroon"},"255":{"rgb":"#FF0000","name":"clRed"},"32768":{"rgb":"#008000","name":"clGreen"},"32896":{"rgb":"#808000","name":"clOlive"},"65280":{"rgb":"#00FF00","name":"clLime"},"65535":{"rgb":"#FFFF00","name":"clYellow"},"8388608":{"rgb":"#000080","name":"clNavy"},"8388736":{"rgb":"#800080","name":"clPurple"},"8421376":{"rgb":"#008080","name":"clTeal"},"8421504":{"rgb":"#808080","name":"clGray"},"10789024":{"rgb":"#A0A0A4","name":"clMedGray"},"12632256":{"rgb":"#C0C0C0","name":"clSilver"},"12639424":{"rgb":"#C0DCC0","name":"clMoneyGreen"},"15780518":{"rgb":"#A6CAF0","name":"clSkyBlue"},"15793151":{"rgb":"#FFFBF0","name":"clCream"},"16711680":{"rgb":"#0000FF","name":"clBlue"},"16711935":{"rgb":"#FF00FF","name":"clFuchsia"},"16776960":{"rgb":"#00FFFF","name":"clAqua"},"16777215":{"rgb":"#FFFFFF","name":"clWhite"},"R,G,B":{"name":"###"},"-16777206":{"rgb":"#B4B4B4","name":"clActiveBorder"},"-16777214":{"rgb":"#99B4D1","name":"clActiveCaption"},"-16777204":{"rgb":"#ABABAB","name":"clAppWorkSpace"},"-16777215":{"rgb":"#000000","name":"clBackground"},"-16777201":{"rgb":"#F0F0F0","name":"clBtnFace"},"-16777196":{"rgb":"#FFFFFF","name":"clBtnHighlight"},"-16777200":{"rgb":"#A0A0A0","name":"clBtnShadow"},"-16777198":{"rgb":"#000000","name":"clBtnText"},"-16777207":{"rgb":"#000000","name":"clCaptionText"},"-16777189":{"rgb":"#B9D1EA","name":"clGradientActiveCaption"},"-16777188":{"rgb":"#D7E4F2","name":"clGradientInactiveCaption"},"-16777199":{"rgb":"#6D6D6D","name":"clGrayText"},"-16777203":{"rgb":"#3399FF","name":"clHighlight"},"-16777202":{"rgb":"#FFFFFF","name":"clHighlightText"},"-16777190":{"rgb":"#0066CC","name":"clHotLight"},"-16777205":{"rgb":"#F4F7FC","name":"clInactiveBorder"},"-16777213":{"rgb":"#BFCDDB","name":"clInactiveCaption"},"-16777197":{"rgb":"#434E54","name":"clInactiveCaptionText"},"-16777192":{"rgb":"#FFFFE1","name":"clInfoBk"},"-16777193":{"rgb":"#000000","name":"clInfoText"},"-16777212":{"rgb":"#F0F0F0","name":"clMenu"},"-16777186":{"rgb":"#F0F0F0","name":"clMenuBar"},"-16777187":{"rgb":"#3399FF","name":"clMenuHighlight"},"-16777209":{"rgb":"#000000","name":"clMenuText"},"-16777216":{"rgb":"#C8C8C8","name":"clScrollBar"},"-16777195":{"rgb":"#696969","name":"cl3DDkShadow"},"-16777194":{"rgb":"#E3E3E3","name":"cl3DLight"},"-16777211":{"rgb":"#FFFFFF","name":"clWindow"},"-16777210":{"rgb":"#646464","name":"clWindowFrame"},"-16777208":{"rgb":"#000000","name":"clWindowText"}};

  /**
* Font selector plugin
* turns an ordinary input field into a list of web-safe fonts
* Usage: $('select').fontSelector();
*
* Author     : James Carmichael
* Website    : www.siteclick.co.uk
* License    : MIT
*/
jQuery.fn.fontSelector = function(callback) {

  var fonts = new Array(
'Arial,Arial,Helvetica,sans-serif',
'Arial Black,Arial Black,Gadget,sans-serif',
'Comic Sans MS,Comic Sans MS,cursive',
'Courier New,Courier New,Courier,monospace',
'Georgia,Georgia,serif',
'Impact,Charcoal,sans-serif',
'Lucida Console,Monaco,monospace',
'Lucida Sans Unicode,Lucida Grande,sans-serif',
'Palatino Linotype,Book Antiqua,Palatino,serif',
'Tahoma,Geneva,sans-serif',
'Times New Roman,Times,serif',
'Trebuchet MS,Helvetica,sans-serif',
'Verdana,Geneva,sans-serif' );

    $("body").click(function(){
       $(".fontselector").hide();
    });

  return this.each(function(){

    // Get input field
    var sel = this;

    // Add a ul to hold fonts
    var ul = $('<ul class="fontselector" style="z-index: 500000"></ul>');
    $('body').prepend(ul);
    $(ul).hide();

    jQuery.each(fonts, function(i, item) {

      $(ul).append('<li><a href="#" class="font_' + i + '" style="font-family: ' + item + '">' + item.split(',')[0] + '</a></li>');

      // Prevent real select from working
      $(sel).click(function(ev) {

        ev.preventDefault();

        // Show font list
        $(ul).show();

        // Position font list
        $(ul).css({ top:  $(sel).offset().top + $(sel).height() + 4,
                    left: $(sel).offset().left});

        // Blur field
        $(this).blur();
        return false;
      });


      $(ul).find('a').click(function(ev) {
        ev.stopPropagation();
        var font = fonts[$(this).attr('class').split('_')[1]];
        $(sel).val(font);
        $(ul).hide();
        if(callback)
            callback(font)

        return false;
      });



    });

  });

};

}).call(this);
