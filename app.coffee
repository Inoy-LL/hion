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



class Element
  constructor: (@name, x, y, @params = {}, @id, @ini)->
    @x = parseInt(x)
    @y = parseInt(y)
    @ini = ini

    if name == 'HubEx'
      @size = 15
      @icon_size = 5
    else
      @size = conf.element.size
      @icon_size = conf.icon.size

  draw_dots: (params, property)->
    #i = 0

    i = [0,0,0,0,0,0,0]

    for param of params

      if param.substr(0,1) == "*"
        continue


      str = params[param].split('|')
      types = ['', 'do', 'on', 'top', 'bot']

      type_num = parseInt str[1]
      type = types[ type_num ]

      offset_x = 0

      if type == 'on'
        offset_x = conf.element.size



      text = str[0]

      dot_x = offset_x + @x
      dot_y = @y + conf.dot.offset + i[type_num] * conf.dot.indent

      dot_color = conf.dot.color
      border_color = conf.dot.border.color

      if type == 'top' or  type == 'bot'
        dot_x = @x + conf.dot.offset - 1 + i[type_num] * conf.dot.indent
        dot_y = @y


        dot_color = conf.dot.color2
        border_color = conf.dot.border.color2

        if type == 'top'
          dot_y+=conf.element.size


      if property[param] != undefined
        #dot_color = property[param].split('|') # нестандартные цвета из свойств
        dot_color = "#FFFF00"
        border_color = "#DAA520"




      dot = paper.circle( dot_x,dot_y, conf.dot.radius.min).attr
        fill: dot_color
        stroke: border_color
        "stroke-width": 1
      dot.text = "#{param}: #{text}"
      dot.default_color = dot_color
      dot.name = param
      dot.eid = @id


      # helper dots
      dot.hover( (e)->
        this.attr
          fill: conf.dot.hover_color
          r: conf.dot.radius.max

        Helper.setText(this.text)
        Helper.move(e.layerX, e.layerY)
        Helper.show()

      ,->
        this.attr
          fill: this.default_color
          r: conf.dot.radius.min
        Helper.hide()
      )

      @element.push dot
      i[type_num]++

    for param in @params
      if param.name.substr(0, 4) is "link"
        link = param.name.substr(5, param.name.length - 6)
        if link.substr(0, 2) == 'on'
          link = link.replace(/\)\(/g, ',').replace(/\[\(/g, '').replace(/\)\]/g, '').split ','
          link.eid = @id
          links.push link
  save: ->
    @icon = paper.image("#{conf.icon.path}#{@name}.ico", @x + 4, @y + 4, @icon_size, @icon_size)

    @rect = paper.rect(@x, @y, @size, @size, 3).attr
      fill: @icon
      "fill-opacity": 0
      "stroke-width": conf.element.border.size
      stroke: conf.element.border.color
    @rect.eid = @id

    @element = paper.set()

    @draw_dots(@ini.Methods, @ini.Property)

    #
    @element.push @rect, @icon #, line

    element = @element
    # drag & drop
    start = ->
      this.ox = 0
      this.oy = 0

      el = elements[this.eid].element.items
      for e in el
        if e.type is "path"
          xy = e.attr('path')[1]
          this.line = e: e, x: xy[1], y: xy[2]

      if this.type != 'circle'
        this.animate("fill-opacity": .3, 300, ">")

    move = (dx, dy)->

      element.translate(  dx - this.ox, dy - this.oy);
      this.ox = dx;
      this.oy = dy;

      if this.line
        path = this.line.e.attr('path')
        path[1][1] = this.line.x
        path[1][2] = this.line.y

        console.log this.line

        this.line.e.attr 'path': path


    up = ->
      if this.type != 'circle'
        this.animate( "fill-opacity": 0, 300, ">")

    # set group params
    paper.set(@element).drag(move, start, up).toBack()


#DOT HELPER
class Helper
  helper = null

  @get: ->
    if not @helper?
      paper.setStart()
      paper.rect(0, 0, 1, 20, 4).attr("fill": "#aaa")
      paper.text(0, 10, "").attr("fill": "black")
      @helper = paper.setFinish().toFront().hide()

    @helper
  @setText: (text)->
    @text = text
    @get().attr 'text', text
    @get().attr 'width', text.length * 6
    @get().show()

  @move: (layerX, layerY)->
    @get()[0].attr 'x', layerX + conf.dot.radius.max*2
    @get()[0].attr 'y', layerY - conf.dot.radius.max*2

    @get()[1].attr 'x', layerX + conf.dot.radius.max*2 + @text.length * 3
    @get()[1].attr 'y', layerY - conf.dot.radius.max*2 + 9

  @hide: ->
    @get().hide()
  @show: ->
    @get().show()

  constructor: ()->

@links = []

class Sha
  @elements = []
  @parse: (sha)->
    for i of sha
      if not make and not selection and sha.substr(i, 4) is 'Make'
        make_start = true
      else
        if make_start and not selection and sha[i] is '('
          make_start = i
        else
          if not make and make_start and sha[i] is ')'
            make = sha.substr(make_start, i - make_start).substr 1


      if not selection and sha.substr(i, 3) is 'Add'
        selection = true
      else
        if selection and not element and not element_start and sha[i] is '('
          element_start = i
        else
          if selection and not element and element_start and sha[i] is ')'
            element = sha.substr(element_start, i - element_start).substr 1
          else
            if selection and element and sha[i] is '{'
              params_start = i
            else
              if selection and element and sha[i] is '"'
                quote = not quote
              else
                if selection and element and not quote and sha[i] is '}'
                  params = sha.substr(params_start, i - params_start).substr(1).split '\n'
                  prop = []
                  for j of params
                    if params[j].trim('   \t\r') == ""
                      continue
                    param = params[j].trim('   \t\r').split('=', 2)

                    prop.push
                      name: param[0]
                      value: param[1]


                  [name, id, x, y] = element.split ","

                  result = ""
                  $.ajax( url: "/delphi/conf/#{name}.ini", async: false, dataType : "text" ).success( (data)->
                    result = parseINIString( data)
                  )

                  @elements.push
                    name: name
                    id: id
                    x: x
                    y: y
                    params: prop
                    ini: result



                  selection = false
                  quote = false
                  element = false
                  element_start = false
                  params_start = false
    @elements


$ ->

sha = $('textarea#sha_viewer').val()
elements = Sha.parse(sha)

for el in elements
    elements[el.id] = new Element el.name, el.x, el.y, el.params, el.id, el.ini
    elements[el.id].save()

for link in links
  items = elements[link.eid].element.items
  for item in items
    if item.name and item.name == link[0]
       bbox = item.getBBox()
       start_x = bbox.x + conf.dot.radius.min
       start_y = bbox.y + conf.dot.radius.min
       [stop_id, stop_name] = link[1].split ':'

       for item2 in elements[stop_id].element.items
         if item2.name and item2.name == stop_name
          bbox = item2.getBBox()
          stop_x = bbox.x + conf.dot.radius.min
          stop_y = bbox.y + conf.dot.radius.min

          l = paper.path("M#{start_x}, #{start_y} L#{stop_x}, #{stop_y}")
          l.attr
            stroke: "blue"
            "stroke-width": 2
            fill: "none"

          elements[link.eid].element.push l

          item2.toFront()
          item.toFront()



          break
    break
