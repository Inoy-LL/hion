//@ sourceMappingURL=app.map
// Generated by CoffeeScript 1.6.1
(function() {
  var Element, conf, dots_helper, elements_sorted, paper;

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

    function Element(name, x, y, params, id, parameters_set) {
      this.name = name;
      this.x = x;
      this.y = y;
      this.params = params != null ? params : {};
      this.id = id;
      this.parameters_set = parameters_set;
      this.x = parseInt(this.x);
      this.y = parseInt(this.y);
      if (name === 'HubEx') {
        this.size = 15;
        this.icon_size = 5;
      } else {
        this.size = conf.element.size;
        this.icon_size = conf.icon.size;
      }
    }

    Element.prototype.draw_dots = function(type, params) {
      var border_color, dot, dot_color, dot_x, dot_y, i, offset_x, param, str, text, _results;
      i = 0;
      _results = [];
      for (param in params) {
        if (param.substr(0, 2) !== type && param.substr(0, 1) !== type) {
          continue;
        }
        offset_x = 0;
        if (type === 'on') {
          offset_x = conf.element.size;
        }
        str = params[param].split('|');
        text = str[0];
        dot_x = offset_x + this.x;
        dot_y = this.y + conf.dot.offset + i * conf.dot.indent;
        dot_color = conf.dot.color;
        border_color = conf.dot.border.color;
        if (param.substr(0, 1) === '@' || param.substr(0, 1) === '+') {
          dot_x = this.x + conf.dot.offset - 1 + i * conf.dot.indent;
          dot_y = this.y;
          dot_color = conf.dot.color2;
          border_color = conf.dot.border.color2;
          param = param.substr(1);
          if (type === '+') {
            dot_y += conf.element.size;
          }
        }
        dot = paper.circle(dot_x, dot_y, conf.dot.radius.min).attr({
          fill: dot_color,
          stroke: border_color,
          "stroke-width": 1
        });
        dot.text = "" + param + ": " + text;
        dot.hover(function(e) {
          this.attr({
            fill: conf.dot.hover_color,
            r: conf.dot.radius.max
          });
          dots_helper.attr('text', this.text);
          dots_helper.attr('width', this.text.length * 6);
          dots_helper[0].attr('x', e.layerX + conf.dot.radius.max * 2);
          dots_helper[0].attr('y', e.layerY - conf.dot.radius.max * 2);
          dots_helper[1].attr('x', e.layerX + conf.dot.radius.max * 2 + this.text.length * 3);
          dots_helper[1].attr('y', e.layerY - conf.dot.radius.max * 2 + 9);
          return dots_helper.show();
        }, function() {
          return this.attr({
            fill: dot_color,
            r: conf.dot.radius.min
          }, dots_helper.hide());
        });
        this.element.push(dot);
        _results.push(i++);
      }
      return _results;
    };

    Element.prototype.save = function() {
      var move, start, up;
      this.icon = paper.image("" + conf.icon.path + this.name + ".ico", this.x + 4, this.y + 4, this.icon_size, this.icon_size);
      this.rect = paper.rect(this.x, this.y, this.size, this.size, 3).attr({
        fill: this.icon,
        "fill-opacity": 0,
        "stroke-width": conf.element.border.size,
        stroke: conf.element.border.color
      });
      this.element = paper.set();
      this.draw_dots('do', elements_sorted[this.id].ini.Methods);
      this.draw_dots('on', elements_sorted[this.id].ini.Methods);
      this.draw_dots('@', elements_sorted[this.id].ini.Property);
      this.draw_dots('+', elements_sorted[this.id].ini.Property);
      this.element.push(this.rect, this.icon);
      start = function() {
        this.ox = 0;
        this.oy = 0;
        if (this.type !== 'circle') {
          return this.animate({
            "fill-opacity": .3
          }, 300, ">");
        }
      };
      move = function(dx, dy) {
        this.element.translate(dx - this.ox, dy - this.oy);
        this.ox = dx;
        return this.oy = dy;
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

  paper.setStart();

  paper.rect(0, 0, 1, 20, 4).attr({
    "fill": "#aaa"
  });

  paper.text(0, 10, "").attr({
    "fill": "black"
  });

  dots_helper = paper.setFinish().toFront().hide();

  elements_sorted = {};

  $(function() {
    var el, element, i, params, result, _i, _len, _results;
    for (i in elements) {
      element = elements[i].element;
      params = elements[i].params;
      result = "";
      $.ajax({
        url: "/delphi/conf/" + element[0] + ".ini",
        async: false,
        dataType: "text"
      }).success(function(data) {
        return result = parseINIString(data);
      });
      elements_sorted[element[1]] = {
        name: element[0],
        id: element[1],
        params: params,
        ini: result
      };
    }
    _results = [];
    for (_i = 0, _len = elements.length; _i < _len; _i++) {
      el = elements[_i];
      element = new Element(el.element[0], el.element[2], el.element[3], el.params, el.element[1], el.params);
      _results.push(element.save());
    }
    return _results;
  });

}).call(this);
