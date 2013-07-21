package main

import "gorilla/mux"
import "net/http"
import "github.com/gorilla/rpc"
import "github.com/gorilla/rpc/json"

func indexHandler(w http.ResponseWriter, r *http.Request) {
	

}


func main() {
    r := mux.NewRouter()
    r.HandleFunc("/", indexHandler)
    http.Handle("/", r)
}

func init() {
    s := rpc.NewServer()
    s.RegisterCodec(json.NewCodec(), "application/json")
    // [...]
    http.Handle("/rpc", s)
}