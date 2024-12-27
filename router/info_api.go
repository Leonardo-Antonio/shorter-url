package router

import (
	"net/http"

	"github.com/Leonardo-Antonio/url_shortener/handlers/info"
	"github.com/gorilla/mux"
)

func newInfo(mux *mux.Router) {
	mux.HandleFunc("/api/info", info.New().Info).Methods(http.MethodGet)
}
