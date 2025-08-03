package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"
	"net/url"

	"github.com/lkaihua/carp/src/packages/myhttp"
	"github.com/lkaihua/carp/src/packages/utils"
)

var rootDir string
var staticDir string = "src/static/"

// Let's start a file server that returns the current folder content in JSON format
func main() {
	/*
		Serve is a very simple static file server in go
		Usage:
			-p="8100": port to serve on
			-d=".":    the directory of static files to host
		Navigating to http://localhost:8100 will display the index.html or directory
		listing file.
	*/

	port := flag.String("p", "8100", "port to serve on")
	directory := flag.String("d", ".", "the directory of static file to host")
	flag.Parse()

	rootDir = *directory
	http.HandleFunc("/", indexHandler)

	ipAddress := utils.GetOutboundIP()

	log.Printf("Serving Folder [%s] on IP [%s] Port [%s]\n", *directory, ipAddress, *port)
	log.Printf("Serving http://%s:%s\n", ipAddress, *port)
	log.Fatal(http.ListenAndServe(":"+*port, nil))
}

func serveFile(w http.ResponseWriter, r *http.Request) {
	fmt.Println("[serveFile]", r.URL.Path)
	filePath := r.URL.Path
	myhttp.ServeFile(w, r, rootDir+filePath)
}

func indexHandler(w http.ResponseWriter, r *http.Request) {

	// CORS headers
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if queries, err := url.ParseQuery(r.URL.RawQuery); err == nil {
		if _, ok := queries["file"]; ok {
			serveFile(w, r)
			log.Printf("Serving file: %s", r.URL.Path)
			return
		}
	}

	log.Printf("Serving: %s", rootDir+r.URL.Path)
	myhttp.ServeFile(w, r, rootDir+r.URL.Path)
}
