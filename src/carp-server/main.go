package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"
	"net/url"
	"strings"

	"github.com/lkaihua/carp/src/carp-server/packages/carphttp"
	"github.com/lkaihua/carp/src/carp-server/packages/carptemplate"
	"github.com/lkaihua/carp/src/carp-server/packages/types"
	"github.com/lkaihua/carp/src/carp-server/packages/utils"
)

const defaultPort string = "8100"
const defaultRootDir string = "./example_files/"
const publicDir string = "./public/"

var rootDir string

func main() {
	/*
		Serve is a very simple static file server in go
		Usage:
			-p="8100": port to serve on
			-d=".":    the directory of static files to host
		Navigating to http://localhost:8100 will display the index.html or directory
		listing file.
	*/

	port := flag.String("p", defaultPort, "port to serve on")
	directory := flag.String("d", defaultRootDir, "the directory of static file to host")
	flag.Parse()

	rootDir = *directory
	http.HandleFunc("/", serverHandler)

	ipAddress := utils.GetOutboundIPAddress()

	log.Printf("Serving Folder [%s] on IP [%s] Port [%s]\n", *directory, ipAddress, *port)
	log.Printf("Serving http://%s:%s\n", ipAddress, *port)
	log.Fatal(http.ListenAndServe(":"+*port, nil))
}

// Serve a file
func serveFile(w http.ResponseWriter, r *http.Request) {
	fmt.Println("[serveFile]", r.URL.Path)
	carphttp.ServeFile(w, r, rootDir+r.URL.Path)
}

// Serve a folder
func serveFolder(w http.ResponseWriter, r *http.Request) {
	fmt.Println("[serveFolder]", r.URL.Path)
	carphttp.ServeFile(w, r, rootDir+r.URL.Path)
}

// Serve public static files for carp web UI
func servePublic(w http.ResponseWriter, r *http.Request) {
	fmt.Println("[servePublic]", r.URL.Path)
	carphttp.ServeFile(w, r, publicDir+r.URL.Path)
}

func serverHandler(w http.ResponseWriter, r *http.Request) {
	view := types.ViewTypeAll

	// Query strings can be used to force serving a file, a folder, or public assets of carp web UI
	if queries, err := url.ParseQuery(r.URL.RawQuery); err == nil {
		if _, ok := queries["public"]; ok {
			servePublic(w, r)
			return
		}
		if _, ok := queries["file"]; ok {
			serveFile(w, r)
			return
		}
		// if value, ok := queries["category"]; ok {
		// 	activeCategory = value[0]
		// }

		if views, ok := queries["view"]; ok {
			switch strings.ToLower(views[0]) {
			case types.ViewTypeImageVideo.String():
				view = types.ViewTypeImageVideo
			case types.ViewTypeMusic.String():
				view = types.ViewTypeMusic
			}
		}

	}

	fmt.Println("[indexHandler] output html <body> for: ", r.URL.Path)
	// Html Body
	serveFolder(w, r)

	breadcrumb := carptemplate.Breadcrumb(r.URL.Path)

	// categories := []mytemplate.Category{
	// 	{Value: "all", DisplayText: "All"},
	// 	{Value: "image-video", DisplayText: "Image & Video"},
	// 	{Value: "music", DisplayText: "Music"},
	// }

	// Html Header
	fmt.Println("[indexHandler] output html <header> for: ", r.URL.Path)
	carptemplate.Index(w, carptemplate.IndexView{
		Title:      "Carp-" + r.URL.Path,
		Dir:        rootDir,
		Breadcrumb: breadcrumb,
		View:       view,
	})

	// Html Footer
	fmt.Println("[indexHandler] output html <footer> for: ", r.URL.Path)
	// mytemplate.Footer(w)
}
