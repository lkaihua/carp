package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	qrterminal "github.com/mdp/qrterminal/v3"
	qrcode "github.com/skip2/go-qrcode"

	"github.com/lkaihua/carp/src/packages/myhttp"
	"github.com/lkaihua/carp/src/packages/utils"
)

var rootDir string
var startTime time.Time
var frontendPort string

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
	// todo: make this configurable
	frontendPort = "5173"
	directory := flag.String("d", ".", "the directory of static file to host")
	flag.Parse()

	rootDir = *directory
	startTime = time.Now()

	http.HandleFunc("/~/", indexHandler)
	http.HandleFunc("/info/", infoHandler)
	http.HandleFunc("/qr/", qrHandler)

	ipAddress := utils.GetOutboundIP()
	serverURL := fmt.Sprintf("http://%s:%s", ipAddress, *port)
	frontendURL := fmt.Sprintf("http://%s:%s", ipAddress, frontendPort)

	log.Printf("Serving Folder [%s] on IP [%s] Port [%s]\n", *directory, ipAddress, *port)
	log.Printf("Serving %s\n", serverURL)
	log.Println("Scan QR code to access on mobile:")

	// Configure QR code: smaller size and no white margin
	config := qrterminal.Config{
		Level:     qrterminal.M,
		Writer:    os.Stdout,
		BlackChar: qrterminal.BLACK,
		WhiteChar: qrterminal.WHITE,
		QuietZone: 0,
	}
	qrterminal.GenerateWithConfig(frontendURL, config)

	log.Fatal(http.ListenAndServe(":"+*port, nil))
}

// func serveFile(w http.ResponseWriter, r *http.Request) {
// 	fmt.Println("[serveFile]", r.URL.Path)
// 	filePath := r.URL.Path
// 	myhttp.ServeFile(w, r, rootDir+filePath)
// }

func setCORSHeaders(w http.ResponseWriter) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "HEAD, GET, POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
}

func indexHandler(w http.ResponseWriter, r *http.Request) {
	setCORSHeaders(w)

	// if queries, err := url.ParseQuery(r.URL.RawQuery); err == nil {
	// 	if _, ok := queries["file"]; ok {
	// 		serveFile(w, r)
	// 		log.Printf("Serving file: %s", r.URL.Path)
	// 		return
	// 	}
	// }

	path := r.URL.Path[3:] // trim off leading `/~/`

	log.Printf("Serving: %s", rootDir+path)
	myhttp.ServeFile(w, r, rootDir+path)
}

func infoHandler(w http.ResponseWriter, r *http.Request) {
	setCORSHeaders(w)
	w.Header().Set("Content-Type", "application/json")

	ipAddress := utils.GetOutboundIP()

	info := map[string]interface{}{
		"ipAddress":   ipAddress,
		"startTime":   startTime.Format(time.RFC3339),
		"localFolder": rootDir,
	}

	json.NewEncoder(w).Encode(info)
}

func qrHandler(w http.ResponseWriter, r *http.Request) {
	setCORSHeaders(w)

	// Get the URL from query parameter
	url := r.URL.Query().Get("url")
	if url == "" {
		http.Error(w, "Missing 'url' query parameter", http.StatusBadRequest)
		return
	}

	// Generate QR code
	png, err := qrcode.Encode(url, qrcode.Medium, 256)
	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to generate QR code: %v", err), http.StatusInternalServerError)
		return
	}

	// Set content type and write the image
	w.Header().Set("Content-Type", "image/png")
	w.Header().Set("Cache-Control", "public, max-age=3600")
	w.Write(png)
}
