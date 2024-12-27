package memory

import "sync"

type URL struct {
	IP        string `json:"ip"`
	URLShort  string `json:"urlShort"`
	URLOrigen string `json:"urlOrigen"`
	CreatedAt uint64 `json:"createdAt"`
}

var (
	storage = make(map[string][]URL)
	mutex   = &sync.RWMutex{}
)
