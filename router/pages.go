package router

import (
	"net/http"

	"github.com/gorilla/mux"
)

func newPages(mux *mux.Router) {
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "public/pages/index.html")
	})
}
