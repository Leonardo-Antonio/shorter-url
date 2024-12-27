package memory

func Set(groupId string, data URL) {
	mutex.Lock()
	storage[groupId] = append(storage[groupId], data)
	mutex.Unlock()
}
