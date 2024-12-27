package memory

func Clear() {
	mutex.Lock()
	storage = make(map[string][]URL)
	mutex.Unlock()
}
