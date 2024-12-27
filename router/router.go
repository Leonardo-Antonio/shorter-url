package router

import "github.com/gorilla/mux"

func SetRouters(mux *mux.Router) {
	routerStatus(mux)
	routerURL(mux)
	newInfo(mux)
	newPages(mux)
}
