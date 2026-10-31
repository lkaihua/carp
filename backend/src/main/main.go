package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	qrcode "github.com/skip2/go-qrcode"

	"github.com/lkaihua/carp/src/packages/myhttp"
	"github.com/lkaihua/carp/src/packages/utils"
)

var rootDir string
var startTime time.Time
var frontendDistDir string

func main() {
	port := flag.String("p", envOrDefault("CARP_PORT", "8100"), "port to serve on")
	sharedDir := flag.String("d", envOrDefault("CARP_SHARE_DIR", "."), "folder to share")
	frontendDist := flag.String("fd", "", "directory containing the built React app")
	flag.Parse()

	var err error
	rootDir, err = filepath.Abs(*sharedDir)
	if err != nil {
		log.Fatal(err)
	}
	info, err := os.Stat(rootDir)
	if err != nil || !info.IsDir() {
		log.Fatalf("share folder must be an existing directory: %s", rootDir)
	}
	if *frontendDist != "" {
		frontendDistDir, err = filepath.Abs(*frontendDist)
		if err != nil {
			log.Fatal(err)
		}
		if _, err := os.Stat(filepath.Join(frontendDistDir, "index.html")); err != nil {
			log.Fatalf("built frontend not found in %s: %v", frontendDistDir, err)
		}
	}
	startTime = time.Now()

	ipAddress := utils.GetOutboundIP()
	serverURL := fmt.Sprintf("http://%s:%s", ipAddress, *port)
	log.Printf("Serving Folder [%s] on IP [%s] Port [%s]\n", rootDir, ipAddress, *port)
	log.Printf("Serving %s\n", serverURL)

	log.Fatal(http.ListenAndServe(":"+*port, newHTTPHandler()))
}

func newHTTPHandler() http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("/~/", indexHandler)
	mux.HandleFunc("/info/", infoHandler)
	mux.HandleFunc("/qr/", qrHandler)
	if frontendDistDir != "" {
		mux.Handle("/", http.FileServer(http.Dir(frontendDistDir)))
	}
	return mux
}

func envOrDefault(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}

func setCORSHeaders(w http.ResponseWriter) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "HEAD, GET, POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
}

func indexHandler(w http.ResponseWriter, r *http.Request) {
	if frontendDistDir != "" && strings.Contains(r.Header.Get("Accept"), "text/html") {
		http.ServeFile(w, r, filepath.Join(frontendDistDir, "index.html"))
		return
	}
	setCORSHeaders(w)

	path := r.URL.Path[3:] // trim off leading `/~/`

	log.Printf("Serving: %s", filepath.Join(rootDir, path))
	myhttp.ServeFile(w, r, filepath.Join(rootDir, path))
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
