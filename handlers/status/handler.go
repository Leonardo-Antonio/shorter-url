package status

import (
	"encoding/json"
	"net/http"
)

type handler struct{}

func New() *handler {
	return &handler{}
}

func (_h *handler) Status(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
}
