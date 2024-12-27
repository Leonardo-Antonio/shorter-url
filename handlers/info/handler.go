package info

import (
	"encoding/json"
	"net/http"
	"os"

	"github.com/Leonardo-Antonio/url_shortener/dto"
)

type handler struct{}

func New() *handler {
	return &handler{}
}

func (_h *handler) Info(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(dto.Response{
		Success: true,
		Message: "ok",
		Data: map[string]string{
			"info": os.Getenv("TTL_MINS_URLS"),
		},
	})
}
