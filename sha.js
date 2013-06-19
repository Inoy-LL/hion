function parseINIString(data){
    var regex = {
        section: /^\s*\[\s*([^\]]*)\s*\]\s*$/,
        param: /^\s*([\+\*@\w\.\-\_]+)\s*=\s*(.*?)\s*$/,
        comment: /^\s*;.*$/
    };
    var value = {};
    var lines = data.split(/\r\n|\r|\n/);
    var section = null;
    lines.forEach(function(line){
        if(regex.comment.test(line)){
            return;
        }else if(regex.param.test(line)){
            var match = line.match(regex.param);
            if(section){
                value[section][match[1]] = match[2];
            }else{
                value[match[1]] = match[2];
            }
        }else if(regex.section.test(line)){
            var match = line.match(regex.section);
            value[match[1]] = {};
            section = match[1];
        }else if(line.length == 0 && section){
            section = null;
        };
    });
    return value;
}


var sha = $('textarea#sha_viewer').val();


// Parse sha
var elements = [];

var selection = false;
var quote = false;
var element = false;
var element_start = false;
var params_start = false;
var make_start = false;
var make = false;

for(var i in sha){
    if(!make && !selection && sha.substr(i, 4) == 'Make') {
        make_start = true;
    } else
    if(make_start && !selection && sha[i] == '(') {
        make_start = i;
    } else
    if(!make && make_start && sha[i] == ')') {
        make = sha.substr(make_start, i - make_start).substr(1)
    }

    if(!selection && sha.substr(i, 3) == 'Add') {
        selection = true;
    } else
    if(selection && !element && !element_start && sha[i] == '(') {
        element_start = i;
    } else
    if(selection &&  !element && element_start && sha[i] == ')') {
        element = sha.substr(element_start, i - element_start).substr(1);
    }else
    if(selection && element && sha[i] == '{') {
        params_start = i;
    } else
    if(selection && element && sha[i] == '"') {
        quote = !quote;
    } else
    if(selection && element && !quote && sha[i] == '}') {
        //console.log(sha.substr(params_start, i-params_start))
        params = sha.substr(params_start, i-params_start).substr(1).split('\n');
        var prop = [];
        for(var j in params) {
            param = params[j].trim('   \t\r').split('=', 2)
            if(param[0])
                prop.push({ name: param[0], value: param[1]})
        }

        elements.push({
            element: element.split(","),
            params: prop
        })

        selection = false,quote = false,element = false,element_start = false,params_start = false;
    }
}


/**
 *
 *  UTF-8 data encode / decode
 *  http://www.webtoolkit.info/
 *
 **/

var Utf8 = {

    // public method for url encoding
    encode : function (string) {
        string = string.replace(/rn/g,"n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    },

    // public method for url decoding
    decode : function (utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;

        while ( i < utftext.length ) {

            c = utftext.charCodeAt(i);

            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            }
            else if((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i+1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                c2 = utftext.charCodeAt(i+1);
                c3 = utftext.charCodeAt(i+2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }

        }

        return string;
    }

}