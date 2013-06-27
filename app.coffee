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
    indent: 6
    offset: 5
  element:
    border:
      color: "#555"
      size: 1
    size: 40
    opacity: .1
    hover:
      opacity: .4
      time: 300
    color: "red"

  icon:
    path: "/delphi/icon/"
    size: 24
  conf:
    path: "/delphi_utf/conf/"

  link:
    color:
      vars: 'blue'
      events: '#F00'
    size: 2
    opacity: 0.7


create_line = false

paper = Raphael(119, 88, 762, 443)

paper.canvas.onmousemove = (e)->
  if create_line
    stop_x = e.layerX
    stop_y = e.layerY
    path = create_line.attr 'path'
    start_x = path[0][1]
    start_y = path[0][2]
    path = "M#{start_x},#{start_y},S#{start_x+start_x/stop_x},#{stop_y + stop_y/start_y},#{stop_x},#{stop_y}"
    create_line.attr 'path', path

paper.canvas.onmousedown = (e)->
  if create_line and e.which == 3
    create_line.remove()
    create_line = false
  false


paper.canvas.oncontextmenu = -> false

paper.canvas.id = "canvas"


# Класс отвечает за создание элемета
class Element
  @drag: false
  constructor: (@name, x, y, @params = {}, @id, @ini)->
    #утсанавливаем переменные как свойство класса @ = this
    @x = parseInt(x)
    @y = parseInt(y)
    @ini = ini

    if name == 'HubEx'
      @size = 15
      @icon_size = 5
    else
      @size = conf.element.size
      @icon_size = conf.icon.size

  #тут мы рисем точки
  draw_dots: (params, property)->
    #i = 0

    # для каждого типа точки своя перменная счётчик
    i = [0,0,0,0,0,0,0,0,0,0,0]

    for param of params
      # описание элемента|тип элемента
      str = params[param].split('|')

      #цифры хорошо но буквами понятнее bot - низ, top -верх
      types = ['', 'do', 'on', 'top', 'bot', 'bot']
      type_num = parseInt str[1] || 2
      type= types[type_num]

      #если точка скрыта и тип непоказывать то пропускаем 1 ход цикла
      if param[0] is "*" and (str[2] != "2" or str[1] != "3") or (i[type_num] >= 4)
        continue



      #отступ точки от верхнего края элемента по х
      offset_x = 0

      if type == 'on'# если это событие идём к правому краю
        offset_x = conf.element.size

      # описание элемента
      text = str[0]

      # тперь находим координату х, отсутп элемнта по х и отсутп точки от края элемента
      # тут тоже самое @y + conf.dot.offset, дабьше переменная i для нашего типа точки * на отсутп между точками
      #
      dot_x = offset_x + @x
      dot_y = @y + conf.dot.offset + i[type_num] * conf.dot.indent

      dot_color = conf.dot.color
      border_color = conf.dot.border.color


      # если точки для данных то меняем цвет и координаты
      if type == 'top' or  type == 'bot'
        dot_x = @x + conf.dot.offset - 1 + i[type_num] * conf.dot.indent
        dot_y = @y


        dot_color = conf.dot.color2
        border_color = conf.dot.border.color2

        if type == 'top'
          dot_y+=conf.element.size


      #
      if property and property[param] != undefined
        #dot_color = property[param].split('|') # нестандартные цвета из свойств
        dot_color = "#FFFF00"
        border_color = "#DAA520"

      if param[0] is "*"
        param = param.substr(1)
        dot_color = "#00CCCC"
        border_color = "#229999"



      # рисуем круг
      dot = paper.circle( dot_x,dot_y, conf.dot.radius.min).attr
        fill: dot_color
        stroke: border_color
        "stroke-width": 1
      dot.dot_type = type
      dot.text = "#{param}: #{text}"
      dot.default_color = dot_color # нужна для востановления цвета после анимации
      dot.name = param
      dot.eid = @id
      dot.el = @element

      # helper dots / подскзаки для точек и жлемента
      dot.hover( (e)-> # если мышка наведена
        this.attr
          fill: conf.dot.hover_color
          r: conf.dot.radius.max

        Helper.setText(this.text)
        Helper.move(e.layerX, e.layerY)
        Helper.show()

      ,-> #мышка ушла с точки
        this.attr
          fill: this.default_color
          r: conf.dot.radius.min
        Helper.hide()
      )

      dot.click( (e)->

        if create_line
          this_type = this.dot_type
          if (create_line.dot_type == "on" and this_type != "do") or (create_line.dot_type == "top" and this_type != "bot") or  (create_line.dot_type == "do" and this_type != "on") or (create_line.dot_type == "bot" and this_type != "top")
            return false

          this.el.push create_line
          create_line.element.push create_line

          create_line = false
          return false



        start_x = this.attr 'cx'
        start_y = this.attr 'cy'

        stop_x = e.layerX
        stop_y = e.layerY

        create_line = paper.path("M#{start_x},#{start_y},S#{start_x+start_x/stop_x},#{stop_y + stop_y/start_y},#{stop_x},#{stop_y}")

        color = conf.link.color.events
        create_line.dot_type = this.dot_type
        create_line.element = @el

        if this.dot_type != "on" and this.dot_type != "do"
          color = conf.link.color.vars


        create_line.attr
          stroke: color
          "stroke-width": conf.link.size
          fill: "none"
          opacity: conf.link.opacity

      )


      # прикрепляем точки к элементу, прикреалёные точки в raphael перемещяются автоматически вместе с элементом
      # прим помоши метода translate, в методе move есть пример
      @element.push dot
      i[type_num]++

    # парсим связи и добаляем все links
    for param in @params
      if param.name.substr(0, 4) is "link"
        link = param.name.substr(5, param.name.length - 6)
        #if link.substr(0, 2) == 'on'
        link = link.replace(/\)\(/g, ',').replace(/\[\(/g, '').replace(/\)\]/g, '').split ','
        link.eid = @id
        links.push link
  save: ->
    # иконка элемента
    @icon = paper.image("#{conf.icon.path}#{@name}.ico", @x + (@size - 32)/2 + 4 , @y + (@size - 32)/2 + 4, @icon_size, @icon_size)

    # квадрат, сам элемент
    @rect = paper.rect(@x, @y, @size, @size, 3).attr
      fill: @icon
      "fill-opacity": conf.element.opacity
      "stroke-width": conf.element.border.size
      stroke: conf.element.border.color
    @rect.eid = @id
    @rect.name = @name

    # говорим что хотим обЪединить что то с элементом
    @element = paper.set()
    @element.eid = @id

    # событие при наведени имыши, пожсказка к элементу
    @rect.hover( (e)->
      Helper.setText " #{this.name} "
      Helper.move(e.layerX, e.layerY)
      Helper.show()
    ,->
      Helper.hide()
    )



    dots = @ini.Methods
    #for prop of @ini.Property
    #  if prop[0] is "+"
    #    dots[prop] = @ini.Property[prop]


    # отрисоываем точки
    @draw_dots(dots, @ini.Property)

    # объединяем элементы (будут перемещятся вместе при помощи метода translate)
    @element.push @rect, @icon #, line

    element = @element
    # drag & drop / перетаскивание
    start = ->

      this.ox = 0
      this.oy = 0
      # меторд translate перемащяет элементы на остнове относительныз изменений координат
      # поэтмо сохраняем их

      #find all lines and save path stop
      el = elements[this.eid].element.items
      for e in el
        if e.type is "path" # если линия
          if e.stop_id == this.eid #определяем это точка конца лини или начала
            path_num = 0
          else
            path_num = 1

          path = e.attr('path')[path_num]
          e.path_num = path_num

          if path_num == 1
            e.stop = x: path[3], y: path[4]
          else
            e.stop = x: path[1], y: path[2]

          e.cached = path: path

          # в path 3 координаты, x1,x2 в path[0], 2 другие идит друг задоугом в parh[1]


      if this.type != 'circle' #если тчока то аницации точки
        this.animate("fill-opacity": conf.element.hover.opacity, conf.element.hover.time, ">")

      $("#props").empty() #очиащем таблицу со свойствми
      for prop in elements[this.eid].params
        if prop.name.substr(0, 4) != "link"

          if prop.name == "Data" and prop.value == "Null()"
            prop.value = ""
          else if prop.name == "Color"

            #prop.value = parseInt(prop.value)+16777201
          else if prop.name == "Icon" and prop.value == "[]"
            prop.value = "[]"

          value_string = "<input type=\"\" value=\"#{prop.value}\"/>"

          color = ""
          if prop.name == "Color"
            color = colors[prop.value].rgb
            name = colors[prop.value].name
            value_string = "<select style=\"background-color: #{color}\"><option selected>#{name}</option></select>"
          if prop.name == "Font"
            value_string = "<input id=\"font\" value=\"#{prop.value}\" />"



          $("#props").append("<tr>
           <td>#{prop.name}</td>
           <td class=\"value\">
             #{value_string}
           </td>
          </tr>")

          if prop.name == "Font"
            $("#font").fontSelector(value: 'Arial')




    move = (dx, dy, x, y, e)->

      #console.log x,y
      # автоматичкески пермещает все прикреплёные обЪекты
      #@attr 'x', @attr('x') + dx - this.ox
      #@attr 'y', @attr('y') + dy - this.oy


      element.translate(  dx - this.ox, dy - this.oy)


      this.ox = dx;
      this.oy = dy;

      #untranslate line path
      # противоположную координату лини нам пермещять не надо, отменяем


      el = elements[this.eid].element.items
      for e in el
        if e.type is "path"
          path = e.attr 'path'

          path[e.path_num][1] =  e.stop.x - dx
          path[e.path_num][2] =  e.stop.y - dy

          if path[e.path_num][0] == "S"
            path[e.path_num][3] =  e.stop.x - dx
            path[e.path_num][4] =  e.stop.y - dy

            #path[e.path_num][3] =  e.stop.x - dx
            #path[e.path_num][4] =  e.stop.y - dy

            #start_x+start_x/stop_x}
            path[1][1]+= path[1][3] / path[0][1]
            #stop_y + stop_y/start_y
            path[1][2]+= path[1][4] /  path[0][2]

            ##start_x = path[0][1]
            ##start_y = path[0][2]

            ##stop_x = path[1][3]
            ##stop_y = path[1][4]


            ##path = "M#{start_x},#{start_y},S#{start_x+start_x/stop_x},#{stop_y + stop_y/start_y},#{stop_x},#{stop_y}"
          e.attr path: path

      #

    up = ->


      if this.type != 'circle'
        this.animate( "fill-opacity": conf.element.opacity, 500, ">")

    # set group params
    paper.set(@element).drag(move, start, up).toBack()

    ####

    paper.renderfix()
    paper.safari()


  #paper.path("M12,14c-50,100,50,110,0,190").attr({fill: "none", "stroke-width": 2})


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
  @getConf: (name)->
    result = ""
    $.ajax( url: "#{conf.conf.path}#{name}.ini", async: false, dataType : "text" ).success( (data)->
      result = parseINIString( data)
    )
    result
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

                  result = @getConf(name)

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

elements = []

@clearAll = ->
  elements = []
  links = []
  Sha.elements = []
  paper.clear()

@drawAll = ->

  sha = $('textarea#sha_viewer').val()
  elements = Sha.parse(sha)

  for el in elements
    elements[el.id] = new Element el.name, el.x, el.y, el.params, el.id, el.ini
    elements[el.id].save()

  for link in links
    if not elements[link.eid]
      console.error "dots undefined #{link.eid}"
      continue
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

            #l = paper.path("M#{start_x},#{start_y},S#{stop_x*0.90},#{stop_y/0.90},#{stop_x},#{stop_y}")
            l = paper.path("M#{start_x},#{start_y},S#{start_x+start_x/stop_x},#{stop_y + stop_y/start_y},#{stop_x},#{stop_y}")

            color = conf.link.color.events
            if item.name.substr(0, 2) != "on"
              color = conf.link.color.vars

            l.attr
              stroke: color
              "stroke-width": conf.link.size
              fill: "none"
              opacity: conf.link.opacity

            l.start_id = link.eid
            l.stop_id = stop_id

            elements[link.eid].element.push l
            elements[stop_id].element.push l

            item2.toFront()
            item.toFront()


            continue
      continue

drawAll()

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



$.get '/delphi_utf/all.json',
(data)->
  i = 0
  for el in data
    if i >= 30
      break
    $('.elements').append("<img class=\"btn\" data-name=\"#{el}\" src=\"/delphi/icon/#{el}.ico\"/>")
    i++



$('.elements img').live 'click', ->
  id = Math.random() * (10000000 - 1000000) + 1000000
  name = $(this).data('name')
  result = Sha.getConf(name)
  elements[id] = new Element name, 0, 0, {}, id, result
  elements[id].save()

colors = `{"0":{"rgb":"#000000","name":"clBlack"},"128":{"rgb":"#800000","name":"clMaroon"},"255":{"rgb":"#FF0000","name":"clRed"},"32768":{"rgb":"#008000","name":"clGreen"},"32896":{"rgb":"#808000","name":"clOlive"},"65280":{"rgb":"#00FF00","name":"clLime"},"65535":{"rgb":"#FFFF00","name":"clYellow"},"8388608":{"rgb":"#000080","name":"clNavy"},"8388736":{"rgb":"#800080","name":"clPurple"},"8421376":{"rgb":"#008080","name":"clTeal"},"8421504":{"rgb":"#808080","name":"clGray"},"10789024":{"rgb":"#A0A0A4","name":"clMedGray"},"12632256":{"rgb":"#C0C0C0","name":"clSilver"},"12639424":{"rgb":"#C0DCC0","name":"clMoneyGreen"},"15780518":{"rgb":"#A6CAF0","name":"clSkyBlue"},"15793151":{"rgb":"#FFFBF0","name":"clCream"},"16711680":{"rgb":"#0000FF","name":"clBlue"},"16711935":{"rgb":"#FF00FF","name":"clFuchsia"},"16776960":{"rgb":"#00FFFF","name":"clAqua"},"16777215":{"rgb":"#FFFFFF","name":"clWhite"},"R,G,B":{"name":"###"},"-16777206":{"rgb":"#B4B4B4","name":"clActiveBorder"},"-16777214":{"rgb":"#99B4D1","name":"clActiveCaption"},"-16777204":{"rgb":"#ABABAB","name":"clAppWorkSpace"},"-16777215":{"rgb":"#000000","name":"clBackground"},"-16777201":{"rgb":"#F0F0F0","name":"clBtnFace"},"-16777196":{"rgb":"#FFFFFF","name":"clBtnHighlight"},"-16777200":{"rgb":"#A0A0A0","name":"clBtnShadow"},"-16777198":{"rgb":"#000000","name":"clBtnText"},"-16777207":{"rgb":"#000000","name":"clCaptionText"},"-16777189":{"rgb":"#B9D1EA","name":"clGradientActiveCaption"},"-16777188":{"rgb":"#D7E4F2","name":"clGradientInactiveCaption"},"-16777199":{"rgb":"#6D6D6D","name":"clGrayText"},"-16777203":{"rgb":"#3399FF","name":"clHighlight"},"-16777202":{"rgb":"#FFFFFF","name":"clHighlightText"},"-16777190":{"rgb":"#0066CC","name":"clHotLight"},"-16777205":{"rgb":"#F4F7FC","name":"clInactiveBorder"},"-16777213":{"rgb":"#BFCDDB","name":"clInactiveCaption"},"-16777197":{"rgb":"#434E54","name":"clInactiveCaptionText"},"-16777192":{"rgb":"#FFFFE1","name":"clInfoBk"},"-16777193":{"rgb":"#000000","name":"clInfoText"},"-16777212":{"rgb":"#F0F0F0","name":"clMenu"},"-16777186":{"rgb":"#F0F0F0","name":"clMenuBar"},"-16777187":{"rgb":"#3399FF","name":"clMenuHighlight"},"-16777209":{"rgb":"#000000","name":"clMenuText"},"-16777216":{"rgb":"#C8C8C8","name":"clScrollBar"},"-16777195":{"rgb":"#696969","name":"cl3DDkShadow"},"-16777194":{"rgb":"#E3E3E3","name":"cl3DLight"},"-16777211":{"rgb":"#FFFFFF","name":"clWindow"},"-16777210":{"rgb":"#646464","name":"clWindowFrame"},"-16777208":{"rgb":"#000000","name":"clWindowText"}}`



`/**
* Font selector plugin
* turns an ordinary input field into a list of web-safe fonts
* Usage: $('select').fontSelector();
*
* Author     : James Carmichael
* Website    : www.siteclick.co.uk
* License    : MIT
*/
jQuery.fn.fontSelector = function() {

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
        return false;
      });



    });

  });

}`