package url

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/Leonardo-Antonio/url_shortener/db/memory"
	"github.com/Leonardo-Antonio/url_shortener/dto"
	"github.com/Leonardo-Antonio/url_shortener/utils"
	"github.com/google/uuid"
	"github.com/gorilla/mux"
)

type RequestURLShortener struct {
	URL string `json:"url"`
}

func (_h *handler) CreateShortener(w http.ResponseWriter, r *http.Request) {
	var request RequestURLShortener
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(dto.Response{
			Success: false,
			Message: err.Error(),
		})
		return
	}

	id := strings.Split(uuid.NewString(), "-")[0]
	urlShort := fmt.Sprintf("/api/urls/tiny/%s", id)
	memory.Set(id, memory.URL{
		IP:        utils.RemoteIPAddress(r),
		URLOrigen: request.URL,
		URLShort:  urlShort,
		CreatedAt: uint64(time.Now().UTC().UnixMilli()),
	})

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(dto.Response{
		Success: true,
		Message: "ok",
		Data: map[string]string{
			"urlOrigin":    request.URL,
			"urlShortener": urlShort,
		},
	})
}

func (_h *handler) RedirectByShortener(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]

	urls := memory.Get(id)
	if len(urls) == 0 {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(dto.Response{
			Success: false,
			Message: "no url shortener",
		})
		return
	}

	http.Redirect(w, r, urls[0].URLOrigen, http.StatusPermanentRedirect)
}
