package memory

func Get(groupId string) []URL {
	mutex.RLock()
	found := storage[groupId]
	mutex.RUnlock()
	return found
}

func GetAll() map[string][]URL {
	mutex.RLock()
	found := storage
	mutex.RUnlock()
	return found
}
