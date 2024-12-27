package router

import (
	"net/http"

	"github.com/Leonardo-Antonio/url_shortener/handlers/url"
	"github.com/gorilla/mux"
)

func routerURL(mux *mux.Router) {
	handler := url.New()
	mux.HandleFunc("/api/urls/shorteners", handler.CreateShortener).Methods(http.MethodPost)
	mux.HandleFunc("/api/urls/tiny/{id}", handler.RedirectByShortener).Methods(http.MethodGet)
}
