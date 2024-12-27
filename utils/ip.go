package utils

import (
	"net/http"
	"strings"
)

func RemoteIPAddress(r *http.Request) string {

	xFF := r.Header.Get("x-forwarded-for")

	if xFF == "" {
		return ""
	}
	xFFs := strings.Split(xFF, ",")

	if len(xFFs) == 0 || xFFs[0] == "" {
		return ""
	}

	return xFFs[0]
}
