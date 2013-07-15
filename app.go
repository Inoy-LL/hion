package main

import (
	"compress/gzip"
	"html/template"
	"io"
	"net/http"
	"strings"
)

type gzipResponseWriter struct {
	io.Writer
	http.ResponseWriter
}

func (w gzipResponseWriter) Write(b []byte) (int, error) {
	return w.Writer.Write(b)
}

func makeGzipHandler(fn http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if !strings.Contains(r.Header.Get("Accept-Encoding"), "gzip") {
			fn(w, r)
			return
		}
		w.Header().Set("Content-Encoding", "gzip")
		gz := gzip.NewWriter(w)
		defer gz.Close()
		gzr := gzipResponseWriter{Writer: gz, ResponseWriter: w}
		fn(gzr, r)
	}
}

func indexHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/plain")
	renderTemplate(w, "index")
}

var templates = template.Must(template.ParseFiles("index.html"))

func renderTemplate(w http.ResponseWriter, tmpl string) {
	t, _ := template.ParseFiles(tmpl + ".html")
	t.Execute(w, nil)
}

func main() {
	http.HandleFunc("/", makeGzipHandler(indexHandler))
	http.ListenAndServe(":8080", http.FileServer(http.Dir(".")))
}
