document.getElementById('show_file').onmousedown = function() {
        document.getElementById('file').style.display='block';
        document.getElementById('overlay').style.display='block'; 
}

document.getElementById('close_button_file').onmouseup = function() {
        document.getElementById('file').style.display='none';
        document.getElementById('overlay').style.display='none'; 
}	