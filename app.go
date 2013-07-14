package main

import (
	"html/template"
	"net/http"
)

func indexHandler(w http.ResponseWriter, r *http.Request) {
	renderTemplate(w, "index")
}

var templates = template.Must(template.ParseFiles("index.html"))
func renderTemplate(w http.ResponseWriter, tmpl string) {
	t, _ := template.ParseFiles(tmpl + ".html")
    t.Execute(w, nil)
}

func main() {;
	http.HandleFunc("/", indexHandler)
	http.ListenAndServe(":8080", http.FileServer(http.Dir(".")))
}