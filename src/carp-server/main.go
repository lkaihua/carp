package main

import (
	"context"
	"flag"
	"log"
	"net/http"
	"net/url"

	"github.com/lkaihua/carp/src/carp-server/packages/carphttp"
	"github.com/lkaihua/carp/src/carp-server/packages/models"
	"github.com/lkaihua/carp/src/carp-server/packages/utils"
	"github.com/lkaihua/carp/src/carp-server/packages/views"
)

const defaultPort string = "8100"
const defaultRootDir string = "./example_root/"

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

func serverHandler(w http.ResponseWriter, r *http.Request) {
	// Add root dir as a Value in the new context in the http request
	ctx := context.WithValue(r.Context(), "rootDir", rootDir)
	r = r.WithContext(ctx)

	var view models.ViewType

	// Query strings can be used to force serving a file, a folder, or public assets of carp web UI
	if queries, err := url.ParseQuery(r.URL.RawQuery); err == nil {
		if _, ok := queries["public"]; ok {
			carphttp.ServePublic(w, r)
			return
		}
		if _, ok := queries["file"]; ok {
			carphttp.Serve(w, r)
			return
		}
		// if value, ok := queries["category"]; ok {
		// 	activeCategory = value[0]
		// }

		if views, ok := queries["view"]; ok {
			view = models.GetViewType(views[0])
		}

	}

	// This can redirect if the url does not end with "/" and therefor put in the beginning of output sequence
	carphttp.Serve(w, r)

	// Stop rendering if the request format is json
	if queries, err := url.ParseQuery(r.URL.RawQuery); err == nil {
		if formats, ok := queries["format"]; ok {
			if models.GetOutputFormat(formats[0]) == models.JsonFormat {
				return
			}
		}
	}

	// fmt.Println("[indexHandler] output html <body> for: ", r.URL.Path)
	// Output the rest of the page
	breadcrumb := views.Breadcrumb(r.URL.Path)
	views.Index(w, views.IndexView{
		Dir:        rootDir,
		Breadcrumb: breadcrumb,
		View:       view,
	})
}
