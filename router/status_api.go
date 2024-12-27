package router

import (
	"net/http"

	"github.com/Leonardo-Antonio/url_shortener/handlers/status"
	"github.com/gorilla/mux"
)

func routerStatus(mux *mux.Router) {
	mux.HandleFunc("/status", status.New().Status).Methods(http.MethodGet)
}
