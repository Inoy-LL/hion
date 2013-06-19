conf =
  dot:
    radius:
      min: 2.5
      max: 5

    color: "#090"
    color2: "#900"
    border:
      color: "#040"
      color2: "#400"
      size: 1
    hover_color: "red"
    indent: 5
    offset: 5
  element:
    border:
      color: "#555"
      size: 1
    size: 32
  icon:
    path: "/delphi/icon/"
    size: 24



paper = Raphael(10, 10, 1000, 1000)


createElement = (name, x, y, params = {}, id, parameters_set)->
  x = parseInt(x)
  y = parseInt(y)

  if name == 'HubEx'
    el_size = 15
    icon_size = 5
  else
    el_size = conf.element.size
    icon_size = conf.icon.size



  img = paper.image("#{conf.icon.path}#{name}.ico", x + 4, y + 4, icon_size, icon_size)

  el = paper.rect(x, y, el_size, el_size, 3).attr
    fill: img
    "fill-opacity": 0
    "stroke-width": conf.element.border.size
    stroke: conf.element.border.color


  console.log elements_sorted[id].params

  e = paper.set()

  draw_dots = (type, params)->
    i = 0

    for param of params
      if param.substr(0,2) != type and param.substr(0,1) != type
        continue


      offset_x = 0

      if type == 'on'
        offset_x = conf.element.size

      str = params[param].split('|')

      text = str[0]

      t = str[1]

      dot_x = offset_x + x
      dot_y = y + conf.dot.offset + i * conf.dot.indent

      dot_color = conf.dot.color
      border_color = conf.dot.border.color

      if param.substr(0,1) == '@' or  param.substr(0,1) == '+'
        dot_x = x + conf.dot.offset - 1 + i * conf.dot.indent
        dot_y = y

        dot_color = conf.dot.color2
        border_color = conf.dot.border.color2
        param = param.substr(1)

        if type == '+'
          dot_y+=conf.element.size

      dot = paper.circle( dot_x,dot_y, conf.dot.radius.min).attr
        fill: dot_color
        stroke: border_color
        "stroke-width": 1
      dot.text = "#{param}: #{text}"



      # helper dots
      dot.hover( (e)->
        this.attr
          fill: conf.dot.hover_color
          r: conf.dot.radius.max

        #helper_box = dots_helper.getBBox()
        # layer xy position + offset helper - this dot position
        #dots_helper.translate(  e.layerX + conf.dot.radius.max*2 - helper_box.x , e.layerY - conf.dot.radius.max*2  - helper_box.y)
        dots_helper.attr 'text', this.text
        dots_helper.attr 'width', this.text.length * 6

        dots_helper[0].attr 'x', e.layerX + conf.dot.radius.max*2
        dots_helper[0].attr 'y', e.layerY - conf.dot.radius.max*2

        dots_helper[1].attr 'x', e.layerX + conf.dot.radius.max*2 + this.text.length * 3
        dots_helper[1].attr 'y', e.layerY - conf.dot.radius.max*2 + 9


        dots_helper.show()
      ,->
        this.attr
            fill: dot_color
            r: conf.dot.radius.min
          dots_helper.hide()
      )

      e.push dot
      i++

  draw_dots('do', elements_sorted[id].ini.Methods)
  draw_dots('on', elements_sorted[id].ini.Methods)

  draw_dots('@', elements_sorted[id].ini.Property)
  draw_dots('+', elements_sorted[id].ini.Property)

  #

  #line = paper.path("M#{x},#{y+2}c-50,10,50,110,100,100").attr({fill: "none", "stroke-width": 2})

  e.push el, img #, line

  # drag & drop
  start = ->
    this.ox = 0
    this.oy = 0

    if this.type != 'circle'
      this.animate("fill-opacity": .3, 300, ">")

  move = (dx, dy)->
    e.translate(  dx - this.ox, dy - this.oy);
    this.ox = dx;
    this.oy = dy;


  up = ->
    if this.type != 'circle'
      this.animate( "fill-opacity": 0, 300, ">")

  # set group params
  paper.set(e).drag(move, start, up).toBack()


#DOT HELPER
paper.setStart()
paper.rect(0, 0, 1, 20, 4).attr("fill": "#aaa")
paper.text(0, 10, "").attr("fill": "black")
dots_helper = paper.setFinish().toFront().hide()


elements_sorted = {}

$ ->


  for i of elements
    element = elements[i].element
    params = elements[i].params

    result = ""

    $.ajax( url: "/delphi/conf/#{element[0]}.ini", async: false, dataType : "text" ).success( (data)->

      result = parseINIString( data)
    )

    elements_sorted[element[1]] = {name: element[0], id: element[1], params: params, ini: result}



  for el in elements
    console.log el
    createElement(el.element[0], el.element[2], el.element[3], el.params, el.element[1], el.params)

