conf =
  dot:
      radius:
          min: 2.5
          max: 5
      color: "#090"
      color2: "#009"
      border:
          color: "#040"
          color2: "#004"
          size: 1
      hover_color: "red"
      indent: 6.5
      offset: 5
  element:
      border:
          color: "#555"
          size: 1
      size: 36
      opacity: .25
      hover:
          opacity: .5
          time: 300
      color: "red"
      glow:
          enable: true
          color: "#0F0"
          width: 5
          opacity: 0.5
      selected:
          color: "yellow"
  icon:
      path: "delphi/icon/"
      size: 24
  conf:
      path: "delphi_utf/conf/"
  link:
      color:
          vars: 'blue'
          events: '#F00'
          new_var: '#3399FF'
          new_event: '#FF6600'
          random: true
      glow:
          enable: true
          color: "#0F0"
          width: 5
          opacity: 0.5
      size: 2
      active_size: 4
      opacity: 0.7
      new_link_opacity: 1
      min_random_color: 0x777777
      path: (start_x, start_y, stop_x, stop_y, type) ->
        x = Math.abs(stop_x - start_x)/2
        y = Math.abs(stop_y - start_y)/2

        if type == 2
          if -15 < (stop_x - start_x) > 15
            if -20 < (stop_y - start_y) > 20
                x = 10

          return "M#{start_x},#{start_y},#{start_x+x},#{start_y},#{stop_x-x},#{stop_y},L#{stop_x},#{stop_y}"
        else
          if -15 < (stop_y - start_y) > 15
            if -20 < (stop_x - start_x) > 20
              y = 10
          #else
          #  y = 10
          return "M#{start_x},#{start_y},#{start_x},#{start_y-y},#{stop_x},#{stop_y+y},L#{stop_x},#{stop_y}"

        #"M#{start_x},#{start_y},L#{stop_x},#{stop_y}"
        #"M#{start_x},#{start_y},S#{start_x+start_x/stop_x},#{stop_y + stop_y/start_y},#{stop_x},#{stop_y}"
        #"M#{start_x},#{start_y},S#{start_x+Math.abs(start_x-stop_x)/2},#{start_y + Math.abs(start_y-stop_y)/2},#{stop_x},#{stop_y}"

        #"M#{start_x},#{start_y},#{start_x+Math.abs(start_x-stop_x)/2},#{start_y + Math.abs(start_y-stop_y)/2},#{stop_x},#{stop_y}"

        #"M#{start_x},#{start_y},S#{start_x+Math.abs(start_x-stop_x)/2},#{start_y + Math.abs(start_y-stop_y)/2},S#{stop_x-Math.abs(start_x-stop_x)/2},#{stop_y - Math.abs(start_y-stop_y)/2},#{stop_x},#{stop_y}"

  paper:
      offset:
          x: 229
          y: 56
      size:
          width: 619
          heigth: 895
      id: "canvas"
      contextmenu: false

  helper:
      color:
          fill: "khaki"
          text: "black"

class Scheme
  @create_line: false
  @selected_element: null
  @links: {}
  instance = null
  @elements = {}
  @get: () ->
      instance ?= new PrivateClass()

  @getPaper: -> @get().getPaper()

  class PrivateClass
    paper: null
    constructor: ->
        @paper = Paper::create()
    getPaper: -> @paper
  @addElement: (name, id, x, y, params)->
      el = new Element(name, id, x, y, params)
      @elements[el.id]  = el
      @links[el.id] = el.links
      el
  @clear: ->
      @create_line = false
      @links = {}
      @getPaper().clear()


  @parse: (sha) ->
    elements = []
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

                    elements.push
                        name: name
                        id: id
                        x: x
                        y: y
                        params: prop

                    selection = false
                    quote = false
                    element = false
                    element_start = false
                    params_start = false
    elements
  @load: (sha)->
      for element in @parse(sha)
          if element.name != "HubEx"
              @addElement(element.name, element.id, element.x, element.y, element.params)


      for id of @links
          elinks = @links[id]
          for link in elinks
              for dot in @elements[id].dots
                  if dot.name != link.start
                      continue
                  [start_x, start_y] = Paper::getDotPosition dot
                  start_dot = dot

              stop = link.stop
              if @elements[stop[0]]
                for dot in @elements[stop[0]].dots
                  if dot.name != stop[1]
                      continue
                  [stop_x, stop_y] = Paper::getDotPosition dot
                  stop_dot = dot

              l = Paper::drawLink link.start, start_x, start_y, stop_x, stop_y, @elements[id], @elements[ stop[0] ]
              l.dot1 = start_dot
              l.dot2 = stop_dot
              start_dot.link = l
              stop_dot.link = l





class Element
  constructor: (@name, @id, @x, @y, @params)->
    @x = parseInt(x)
    @y = parseInt(y)

    if name.substr(0, 3) == 'Hub'
        @size = 20
        @icon_size = 16
    else
        @size = conf.element.size
        @icon_size = conf.icon.size

    @ini = @getConf(name)

    @methods = @ini.Methods
    @props = {}
    @dots = []

    #console.log @ini.Methods

    #load default parameters
    for key of @ini.Methods
        [hint, type, show] = @ini.Methods[key].split('|')
        name = key
        hide = false
        plus = false



        if key.indexOf('*') != -1 #and show != "2"
            hide = true
        if key.indexOf('+') != -1
            plus = true

        if name[0] is '*' or name[0] is '+'
            name = name.substr(1)

        if name.indexOf('%') != -1
            start = name.indexOf('%')
            name = name.split("%")[0]

        # Todo: plus,hide or type?
        @props[name] = hint: hint, type: type, plus: plus, hide: hide


    if @ini.Type
        if @ini.Type.Sub
            subs = @ini.Type.Sub.split ","
            type = 0
            for sub_ in subs
                type++
                if sub_ != ""
                    sub = sub_.split "|"

                    ini_sub = @ini.Property[ sub[0] ].split("|")
                    if @props[ sub[0] ]
                        count = parseInt @props[ sub[0] ].value
                    else
                        count = parseInt ini_sub[2]


                    for i in [1..count]
                        @props[ sub[1] + i ] = hint: "", type: type, plus: false, hide: false


    @links = []
    # set scheme parameters and parse links
    for param in @params
        if param.name.substr(0, 4) == 'link'
            link = param.name.substr(5, param.name.length - 6)
            link = link.replace(/\)\(/g, ',').replace(/\[\(/g, '').replace(/\)\]/g, '').replace(/,\[\]/, '').split ','
            start = link[0]
            stop = link[1].split ':'
            path = link.slice 2

            @links.push start: start, stop: stop, path: path
        else
            if @props[param.name]
                @props[param.name].value = param.value
                @props[param.name].hide = false
            else
                #console.log param
                @props[param.name] = value: param.value, hide: false, plus: false, hint: param.name, type: 0




    @element = Paper::drawElement(@size, @icon_size, @name, @x, @y, @id)


    i = [0,0,0,0,0,0,0,0,0,0,0]
    DOT = do: 1, on: 2, top: 4, bot: 3

    for key of @props
          prop = @props[key]
          if prop.hide
              continue
          type = parseInt prop.type

          x = @x
          y = @y

          if type == DOT.top or type == DOT.bot
              x = x + i[type] * conf.dot.indent + conf.dot.offset
              color = conf.dot.color2
              border_color = conf.dot.border.color2
              if type == DOT.bot
                  y+=@size


          else
              if type == DOT.do or type == DOT.on
                  y = y + i[type] * conf.dot.indent + conf.dot.offset
                  color = conf.dot.color
                  border_color = conf.dot.border.color
                  if type == DOT.on
                      x+=@size
              else
                  continue

          dot = Paper::drawDot(color, border_color, x, y, key, prop.hint, @element, type)
          @dots.push dot
          i[type]++

          #x2 = @x + @size - conf.dot.offset
          #y2 = @y + @size - conf.dot.offset
          #if x > x2 and type < 3
              #@element[0].attr 'heigth',  @size + conf.dot.indent + x - x2
          #else if y > y2 and type > 2
            #@element[0].attr 'width',   @size + conf.dot.indent + y - y2


          #console.log @props, @ini
    Paper::bindElementEvents(@element, @props)




  getConf: (name)->
      result = @config
      if !@conf
          $.ajax( url: "#{conf.conf.path}#{name}.ini", async: false, dataType : "text" ).success (data)->
              result = parseINIString data

      result


class RaphaelAdapter
  create: ->


      paper = Raphael("poligon", conf.paper.size.width, conf.paper.size.heigth)
      #paper = Raphael(conf.paper.offset.x, conf.paper.offset.y, conf.paper.size.width, conf.paper.size.heigth)
      #paper.canvas.id = conf.paper.canvas
      paper.canvas.oncontextmenu = -> conf.paper.contextmenu

      paper.canvas.onmousemove =  (e)->
          if Scheme.create_line
              path = Scheme.create_line.attr 'path'
              Scheme.create_line.attr 'path', conf.link.path(path[0][1], path[0][2], e.layerX, e.layerY, Scheme.create_line.dot_type)
      paper.canvas.onmousedown = (e)->
          if Scheme.create_line and e.which == 3
              Scheme.create_line.remove()
              Scheme.create_line = false

      paper

  drawElement: (size, icon_size, name, x, y, id)->
      icon = Scheme.getPaper().image("#{conf.icon.path}#{name}.ico", x + (size - icon_size)/2 , y + (size - icon_size)/2, icon_size, icon_size)
      rect = Scheme.getPaper().rect(x, y, size, size, 3).attr
          fill: icon
          "fill-opacity": conf.element.opacity
          "stroke-width": conf.element.border.size
          stroke: conf.element.border.color


      element = Scheme.getPaper().set()
      element.eid = id

      rect.hover( (e)->
          Helper.setText " #{name} "
          #console.log e
          Helper.move(e.offsetX , e.offsetY)
          Helper.show()
      ,->
          Helper.hide()
      )

      rect.el = element
      element.push rect, icon

      if conf.element.glow.enable
          glow = rect.glow color: conf.element.glow.color, width: conf.element.glow.width, opacity: conf.element.glow.opacity
          element.push glow

  drawDot: (color, border_color, x, y, prop_name, prop_hint, element, type)->
      hint = "#{prop_name}: #{prop_hint}"
      dot = Scheme.getPaper().circle( x, y, conf.dot.radius.min).attr
          fill: color
          stroke: border_color
          "stroke-width": 1
      element.push dot

      dot.text = hint
      dot.name = prop_name
      dot.default_color = color
      dot.dot_type = type
      dot.el = element

      dot.hover( (e)->
          Paper::hover_dot_animate( this, 'on')
          Helper.setText(this.text)
          Helper.move(e.offsetX, e.offsetY)
          Helper.show()
          if this.link
              this.link.attr "stroke-width": conf.link.active_size
              Paper::hover_dot_animate( this.link.dot1, 'on')
              if this.link.dot2
                  Paper::hover_dot_animate( this.link.dot2, 'on')
      ,->
          Paper::hover_dot_animate( this, 'off')
          if this.link
              this.link.attr "stroke-width": conf.link.size
              Paper::hover_dot_animate( this.link.dot1, 'off')
              if this.link.dot2
                  Paper::hover_dot_animate( this.link.dot2, 'off')
          Helper.hide()
      )

      dot.click (e)->

        if this.link
            return false

        if Scheme.create_line
            this_type = this.dot_type
            mass = [0, 1, -1, 2, -2]

            if mass[Scheme.create_line.dot_type] + mass[this_type] != 0
                return false

            this.el.push Scheme.create_line

            bbox = this.getBBox()
            start_x = bbox.x + conf.dot.radius.min * 2
            start_y = bbox.y + conf.dot.radius.min * 2

            path = Scheme.create_line.attr 'path'

            last = path[1].length - 1
            path[1][last - 1] = start_x #this.attr 'cx'
            path[1][last] = start_y #this.attr 'cy'



            Scheme.create_line.attr 'path', path
            color = conf.link.color.events
            if this.dot_type > 2
                color = conf.link.color.vars

            if conf.link.color.random
                color = getRandonColor()


            Scheme.create_line.attr
                "stroke-dasharray": ""
                "stroke-width": conf.link.size
                "stroke": color
                opacity: conf.link.opacity


            Scheme.create_line.toBack()
            dot.link = Scheme.create_line
            Scheme.create_line.dot2 = dot
            # Scheme.create_line.start_rid = dot.el[0].id
            #Scheme.create_line.el.push Scheme.create_line


            Scheme.create_line = false

            return false

        else
            bbox = this.getBBox()
            start_x = bbox.x + conf.dot.radius.min * 2
            start_y = bbox.y + conf.dot.radius.min * 2

            stop_x = e.layerX
            stop_y = e.layerY

            Scheme.create_line = Scheme.getPaper().path conf.link.path(start_x, start_y, stop_x, stop_y, Scheme.create_line.dot_type)
            color = conf.link.color.new_event
            Scheme.create_line.dot_type = this.dot_type
            Scheme.create_line.dot1 = dot
            Scheme.create_line.el = dot.el
            Scheme.create_line.start_rid = dot.el[0].id
            dot.el.push Scheme.create_line
            dot.link = Scheme.create_line

            if this.dot_type > 2
                color = conf.link.color.new_var

            if conf.link.color.random
                color = getRandonColor()


            Scheme.create_line.attr
                stroke: color
                "stroke-width": conf.link.size + 1
                fill: "none"
                "stroke-dasharray": "- "
                opacity: conf.link.new_link_opacity


            Scheme.create_line.hover( (e)->
                this.attr "stroke-width": conf.link.active_size
            ,->
                this.attr "stroke-width": conf.link.size
            )

            Scheme.create_line.toBack()

      dot





  bindElementEvents: (element, props)->
      start = ->
        if this.type != 'circle'
            this.animate("fill-opacity": conf.element.hover.opacity, conf.element.hover.time, ">")

            if !@lx
                @lx = 0
                @ly = 0
                @ox = 0
                @oy = 0
                @pos = true


            if this.el
              for el in this.el
                if el.type == "path"
                    el.old_path = el.attr "path"


            PropsPanel::setProps props


      move = (dx, dy)->
          @lx = dx + @ox
          @ly = dy + @oy
          @pos = !@pos
          if @pos and !!!window.chrome #((@lx != 0 and @lx % 2 == 0) or (@ly != 0 and @ly % 2 == 0)) and !!!window.chrome
              return false
          if this.type != 'circle'
            @lx = dx + @ox
            @ly = dy + @oy
            element.transform( "t#{@lx},#{@ly}" )

            if this.el
              for l in this.el
                  if l.type != "path"
                      continue

                  path = l.attr 'path'
                  last = path.length - 1

                  l.attr 'transform', ""
                  # отменяем перемещение противоположного конца связи
                  #last = l.old_path[1].length - 1

                  #last = path[1].length - 1


                  if l.dot1.dot_type == 1 or l.dot1.dot_type == 2
                      dot_type = 2
                  else
                      dot_type = 1

                  if l.start_rid != this.id
                      path[last][1] = l.old_path[last][1] + dx
                      path[last][2] = l.old_path[last][2] + dy
                  else
                      path[0][1] = l.old_path[0][1] + dx
                      path[0][2] = l.old_path[0][2] + dy

                  path = conf.link.path(path[0][1], path[0][2], path[last][1], path[last][2], dot_type)


                  l.attr 'path': path
      up = ->
          if this.type != 'circle'
              this.animate( "fill-opacity": conf.element.opacity, 500, ">")


              @ox = @lx
              @oy = @ly

              # делаем полную трасировку
              if this.el
                for el in this.el
                  if el.type == "path"
                      path = el.attr "path"
                      #last = path[1].length - 1
                      dot1 = el.dot1.getBBox()
                      dot2 = el.dot2.getBBox()
                      size = conf.dot.radius.min

                      if el.dot1.dot_type == 1 or el.dot1.dot_type == 2
                          dot_type = 2
                      else
                          dot_type = 1
                      el.attr "path", conf.link.path(dot1.x + size, dot1.y + size, dot2.x + size, dot2.y + size, dot_type)
                      #el.attr "path", conf.link.path(path[0][1], path[0][2], path[1][last-1], path[1][last])

      Scheme.getPaper().set(element).drag(move, start, up)

      element.click ->
        if this.type != 'circle'
          if Scheme::selected_element
              Scheme::selected_element.attr 'stroke', conf.element.border.color
          Scheme::selected_element = this
          this.attr 'stroke': conf.element.selected.color

  getDotPosition: (dot)->
      [dot.attr('cx'), (dot.attr 'cy')]

  drawLink: (name, start_x, start_y, stop_x, stop_y, el, el2)->

      color = conf.link.color.events

      if name.substr(0, 2) != "on" and name.substr(0, 2) != "do"
          color = conf.link.color.vars
          dot_type = 1
      else
          dot_type = 2

      l = Scheme.getPaper().path conf.link.path(start_x, start_y, stop_x, stop_y, dot_type)



      if conf.link.color.random
          color = getRandonColor()


      l.attr
          stroke: color
          "stroke-width": conf.link.size
          fill: "none"
          opacity: conf.link.opacity
      l.toBack()

      l.hover( (e)->
          this.attr "stroke-width": conf.link.active_size
          Paper::hover_dot_animate( this.dot1, 'on')
          Paper::hover_dot_animate( this.dot2, 'on')
      ,->
          this.attr "stroke-width": conf.link.size
          Paper::hover_dot_animate( this.dot1, 'off')
          Paper::hover_dot_animate( this.dot2, 'off')
      )

      l.start_rid = el.element[0].id

      #if conf.link.glow.enable
      #    glow = l.glow color: conf.link.glow.color, width: conf.link.glow.width, opacity: conf.link.glow.opacity
      #    el.element.push glow
      #    el2.element.push glow

      el.element.push l
      if el2
        el2.element.push l

      l

  hover_dot_animate: (dot, type = 'on')->
      if type == 'on'
          dot.attr
              fill: conf.dot.hover_color
              r: conf.dot.radius.max
      else
          dot.attr
                fill: dot.default_color
                r: conf.dot.radius.min


class Paper extends RaphaelAdapter


class PropsPanel
    setProps: (props)->
      $("#props").empty() #очиащем таблицу со свойствми
      # Todo: свойства не совсем верны
      for name of props
        prop = props[name]

        if name and name.substr(0, 2) != "on" and  name.substr(0, 2) != "do"

          if prop.value and prop.value[0] == '"'
            prop.value =  prop.value.substr(1, prop.value.length - 2)

          if prop.value == "Null()" or prop.value == undefined
            prop.value = ""
          else if name == "Color"
            prop.value = parseInt(prop.value)+16777201
          else if prop.name == "Icon" and prop.value == "[]"
            prop.value = "[]"


          value_string = "<input type=\"text\" value=\"#{prop.value}\"/>"

          color = ""
          if name == "Color"
            if prop.value
              color = WIN_COLORS[prop.value].rgb
              name = WIN_COLORS[prop.value].name
            else
              color = "white"
              name = "white"

            value_string = "<select style=\"background-color: #{color}\"><option selected>#{name}</option></select>"
          if name == "Font"
            checkbox_types = "0": "", "1": "checked"

            [font, size, bold, italic, underline] = prop.value.substr(1,  prop.value.length - 2 ).split(',')

            value_string = "
            <span class=\"font_name\" style=\"font-family: #{font}\">#{font}</span>,<span class=\"font_size\">#{size}</span><button style=\"margin-left: 4px;\" class=\"button font_selector_btn\"><a href=\"#\"> Изменить </a></button>
            <div class=\"font_selector\" style=\"display: none;\">
                <div>Font: <input class=\"font\" value=\"#{font}\" /></div>
                <div>Size: <input type=\"number\" class=\"size\" value=\"#{size}\" /></div>
                <div>Bold: <input type=\"checkbox\" class=\"bold\" #{checkbox_types[bold]} /></div>
                <div>Italic: <input type=\"checkbox\" class=\"italic\" #{checkbox_types[italic]} /></div>
                <div>Underline: <input type=\"checkbox\" class=\"underline\" #{checkbox_types[underline]} /></div>
            </div>"


          $("#props").append("<div>
                               <span style=\"vertical-align: top;\">#{name}</span>
                               <span class=\"value\">
                               #{value_string}
                               </span>
                               </div>")

          if name == "Font"
              $(".font").fontSelector((font)->
                  $('.font_name').css "font-family", font
                  $('.font_name').text font.split(',')[0]
              )
              $('.font_selector_btn').toggle(
                ->
                  $(@).parent().find('.font_selector').slideDown()
                  $(@).html('<a href="#"> Скрыть </a>')
                ,->
                    $(@).parent().find('.font_selector').slideUp()
                    $(@).html('<a href="#">  Изменить </a>')

              )

              $('.font_selector .size').bind('keyup mouseup', ->
                  $('.font_size').text( $(@).val() )

              )




getRandonColor = ->
    col = Math.random()*0xFFFFFF<<0
    if col > conf.link.min_random_color
        col -= conf.link.min_random_color
    color = '#'+col.toString(16)
    if color.length - 1 % 3 != 0
        color = color.substr(0, 4)
    return color

Scheme.load $('textarea#sha_viewer').val()

$('#redraw').click ->
    Scheme.clear()
    Scheme.load $('textarea#sha_viewer').val()

$.ajax(
  url:'https://api.bitbucket.org/1.0/repositories/onefive/onefive.bitbucket.org/events?limit=1&start=0&type=pushed'
  type:'get'
  dataType:'jsonp'
).success (d)->

    last_commit = d.events[0].description.commits[0].description
    $('#last_commit').html "<a href=\"https://bitbucket.org/OneFive/onefive.bitbucket.org\">last commit</a>: #{last_commit}"

#------------------------------------


#DOT HELPER Todo: move to adapter
class Helper
  helper = null

  @get: ->
    if not helper?
      Scheme.getPaper().setStart()
      Scheme.getPaper().rect(0, 0, 1, 20, 4).attr("fill": conf.helper.color.fill)
      Scheme.getPaper().text(0, 10, "").attr("fill": conf.helper.color.text)
      helper = Scheme.getPaper().setFinish().toFront().hide()

    helper
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

handleFileSelect = (evt)->
  files = evt.target.files
  f = files[0]

  if f.name.indexOf('.sha') == -1
    alert "Это не схема!"
    return 0
  else
    reader = new FileReader()

  reader.onload = ((theFile)->
    (e)->
      span = document.getElementById('sha_viewer')
      span.innerHTML = e.target.result

      clearAll()
      drawAll()
  )(f)

  reader.readAsText(f,"WINDOWS-1251");

document.getElementById('files').addEventListener('change', handleFileSelect, false)




class ElementsPanel
  elements = []
  last_gid = 0

  @create: ->
      # Todo: add from elements.sqlite
      $.ajax(url:'/delphi_utf/Elements.json', dataType: 'json')
      .success (data)->
        html = ""
        for g in data.groups
            if g[1] != ""
                html+= "<div class=\"group\" id=\"g#{g[0]}\" data-id=\"#{g[0]}\"><div class=\"name\">#{g[2]}</div><div class=\"elements\"></div></div></div>"

        $('.elements').append(html)
        elements = data.elements
        ElementsPanel.element_panel_select(1)

      ElementsPanel.bind_events()
      true

  @element_panel_select = (gid)->
      $('.elements > .group > .elements > *').slideUp().empty()
      if last_gid == gid
          last_gid = -1
          return false

      elements_ = ""
      for el in elements
          if el[3] == gid
              elements_+="<span class=\"el\"><img data-name=\"#{el[1]}\" src=\"/delphi/icon/#{el[1]}.ico\"/></span>"


      $("#g#{gid} > .elements").append(elements_).hide().slideDown()
      last_gid = gid

  @bind_events = ->
      $('.elements > .group').live 'click', ->
          ElementsPanel.element_panel_select($(@).data('id'))

      $('.elements img').live 'click', ->
          id = Math.round( Math.random() * (10000000 - 1000000) + 1000000 )
          name = $(this).data('name')
          Scheme.addElement(name, id, 350, 350, {} )
          return false



$('#left_menu_min').toggle ->
      $('#left_menu').animate({left: "-=200px"})
      $('#conte').animate({left: "-=121px"})
      $(@).animateRotate(0, 90)
      .animate({left: "-=57", top: "+=120", opacity: "-=0.3"})


  ,->
      $('#left_menu').animate({left: "+=200px"})
      $('#conte').animate({left: "+=121px"})
      $(@).animateRotate(90, 0)
      .animate({left: "+=57", top: "-=120", opacity: "+=0.3"})



$('#right_menu_min').toggle ->
    $(@).animateRotate(0, -90)
    .animate({right: "-=95", top: "+=120", opacity: "-=0.3"}, "slow", ->
        $(@).animate(right: "+=50", 'width': "-=100")
    )
    $('#right_menu').animate({right: "-=250px"})
,->
    $(@).animate( 'width': "+=100", 100, ->
        $(@).animateRotate(-90, 0)
        .animate({right: "+=45", top: "-=120", opacity: "+=0.3"})
        $('#right_menu').animate({right: "+=250px"})
    )



ElementsPanel.create()



WIN_COLORS = `{"0":{"rgb":"#000000","name":"clBlack"},"128":{"rgb":"#800000","name":"clMaroon"},"255":{"rgb":"#FF0000","name":"clRed"},"32768":{"rgb":"#008000","name":"clGreen"},"32896":{"rgb":"#808000","name":"clOlive"},"65280":{"rgb":"#00FF00","name":"clLime"},"65535":{"rgb":"#FFFF00","name":"clYellow"},"8388608":{"rgb":"#000080","name":"clNavy"},"8388736":{"rgb":"#800080","name":"clPurple"},"8421376":{"rgb":"#008080","name":"clTeal"},"8421504":{"rgb":"#808080","name":"clGray"},"10789024":{"rgb":"#A0A0A4","name":"clMedGray"},"12632256":{"rgb":"#C0C0C0","name":"clSilver"},"12639424":{"rgb":"#C0DCC0","name":"clMoneyGreen"},"15780518":{"rgb":"#A6CAF0","name":"clSkyBlue"},"15793151":{"rgb":"#FFFBF0","name":"clCream"},"16711680":{"rgb":"#0000FF","name":"clBlue"},"16711935":{"rgb":"#FF00FF","name":"clFuchsia"},"16776960":{"rgb":"#00FFFF","name":"clAqua"},"16777215":{"rgb":"#FFFFFF","name":"clWhite"},"R,G,B":{"name":"###"},"-16777206":{"rgb":"#B4B4B4","name":"clActiveBorder"},"-16777214":{"rgb":"#99B4D1","name":"clActiveCaption"},"-16777204":{"rgb":"#ABABAB","name":"clAppWorkSpace"},"-16777215":{"rgb":"#000000","name":"clBackground"},"-16777201":{"rgb":"#F0F0F0","name":"clBtnFace"},"-16777196":{"rgb":"#FFFFFF","name":"clBtnHighlight"},"-16777200":{"rgb":"#A0A0A0","name":"clBtnShadow"},"-16777198":{"rgb":"#000000","name":"clBtnText"},"-16777207":{"rgb":"#000000","name":"clCaptionText"},"-16777189":{"rgb":"#B9D1EA","name":"clGradientActiveCaption"},"-16777188":{"rgb":"#D7E4F2","name":"clGradientInactiveCaption"},"-16777199":{"rgb":"#6D6D6D","name":"clGrayText"},"-16777203":{"rgb":"#3399FF","name":"clHighlight"},"-16777202":{"rgb":"#FFFFFF","name":"clHighlightText"},"-16777190":{"rgb":"#0066CC","name":"clHotLight"},"-16777205":{"rgb":"#F4F7FC","name":"clInactiveBorder"},"-16777213":{"rgb":"#BFCDDB","name":"clInactiveCaption"},"-16777197":{"rgb":"#434E54","name":"clInactiveCaptionText"},"-16777192":{"rgb":"#FFFFE1","name":"clInfoBk"},"-16777193":{"rgb":"#000000","name":"clInfoText"},"-16777212":{"rgb":"#F0F0F0","name":"clMenu"},"-16777186":{"rgb":"#F0F0F0","name":"clMenuBar"},"-16777187":{"rgb":"#3399FF","name":"clMenuHighlight"},"-16777209":{"rgb":"#000000","name":"clMenuText"},"-16777216":{"rgb":"#C8C8C8","name":"clScrollBar"},"-16777195":{"rgb":"#696969","name":"cl3DDkShadow"},"-16777194":{"rgb":"#E3E3E3","name":"cl3DLight"},"-16777211":{"rgb":"#FFFFFF","name":"clWindow"},"-16777210":{"rgb":"#646464","name":"clWindowFrame"},"-16777208":{"rgb":"#000000","name":"clWindowText"}}`


`$.fn.animateRotate = function(startAngle, angle, duration, easing, complete){
    return this.each(function(){
        var elem = $(this);

        $({deg: startAngle}).animate({deg: angle}, {
            duration: duration,
            easing: easing,
            step: function(now){
                elem.css({
                    transform: "rotate(" + now + "deg)"
                });
            },
            complete: complete || $.noop
        });
    });
};`

`/**
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

}`