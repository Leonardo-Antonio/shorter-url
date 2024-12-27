package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"runtime/debug"
	"strconv"
	"time"

	"github.com/Leonardo-Antonio/url_shortener/db/memory"
	"github.com/Leonardo-Antonio/url_shortener/router"
	"github.com/gorilla/mux"
)

func main() {
	mux := mux.NewRouter()
	assetsDir := http.Dir("./assets/")
	mux.PathPrefix("/assets/").Handler(http.StripPrefix("/assets/", http.FileServer(assetsDir)))
	router.SetRouters(mux)

	go func() {
		for {
			run()
		}
	}()

	port := os.Getenv("PORT")
	log.Println("server in port http://0.0.0.0:" + port)
	log.Fatalln(http.ListenAndServe(":"+port, mux))
}

func run() {
	ticketDurationString := os.Getenv("TTL_MINS_URLS")
	tduration, err := strconv.Atoi(ticketDurationString)
	if err != nil {
		panic("error get value of env [TTL_MINS_URLS]")
	}

	tickerStorage := time.NewTicker(time.Duration(tduration) * time.Minute)
	defer func() {
		if r := recover(); r != nil {
			fmt.Println("Recover from panic\n", string(debug.Stack()))
		}
		tickerStorage.Stop()
	}()

	for {
		select {
		case <-tickerStorage.C:
			memory.Clear()
			log.Println("clear all data urls", memory.GetAll())
		default:
			continue
		}
	}
}
