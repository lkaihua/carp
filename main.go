package main

import (
	"flag"
	"fmt"
	"html/template"
	"log"
	"net/http"
	"net/url"
	"path/filepath"
	"strings"

	"github.com/lkaihua/carp-web-gallery/packages/myhttp"
	"github.com/lkaihua/carp-web-gallery/packages/mypath"
	"github.com/lkaihua/carp-web-gallery/packages/mytemplate"
)

type Category struct {
	Value       string
	DisplayText string
}
type IndexView struct {
	Title          string
	Dir            string
	Breadcrumb     []mypath.BreadcrumbLevel
	Categories     []Category
	ActiveCategory string
}

var rootDir string
var staticDir string = "./static/"

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

	log.Printf("Serving %s on HTTP port: %s\n", *directory, *port)
	log.Fatal(http.ListenAndServe(":"+*port, nil))
}

func serveFile(w http.ResponseWriter, r *http.Request) {
	fmt.Println("[serveFile]", r.URL.Path)
	filePath := r.URL.Path
	myhttp.ServeFile(w, r, rootDir+filePath)
}
func serveStatic(w http.ResponseWriter, r *http.Request) {
	fmt.Println("[serveStatic]", r.URL.Path)
	filePath := strings.TrimPrefix(r.URL.Path, "/static/")
	myhttp.ServeFile(w, r, staticDir+filePath)
}

func indexHandler(w http.ResponseWriter, r *http.Request) {
	activeCategory := "all"

	if queries, err := url.ParseQuery(r.URL.RawQuery); err == nil {
		if _, ok := queries["static"]; ok {
			serveStatic(w, r)
			return
		}
		if _, ok := queries["file"]; ok {
			serveFile(w, r)
			return
		}
		if value, ok := queries["category"]; ok {
			activeCategory = value[0]
		}
	}

	/*
		// lp := filepath.Join("templates", "list.html")
		// bp := filepath.Join("templates", "body.html")
		// fp := filepath.Join("templates", filepath.Clean(r.URL.Path))

		// Return a 404 if the template doesn't exist
		info, err := os.Stat(fp)
		if err != nil {
			if os.IsNotExist(err) {
				http.NotFound(w, r)
				return
			}
		}
		// Return a 404 if the request is for a directory
		if info.IsDir() {
			http.NotFound(w, r)
			return
		}
	*/

	templates := []string{
		filepath.Join("templates", "index_list.gohtml"),
	}
	parsedTemplate, err := template.ParseFiles(templates...)

	if err != nil {
		// Log the detailed error
		log.Println(err.Error())
		// Return a generic "Internal Server Error" message
		http.Error(w, http.StatusText(500), 500)
		return
	}

	breadcrumb := mypath.Breadcrumb(r.URL.Path)
	// save point: 2022-03-05
	// next step: each breadcrumb should have one its Name and Path

	categories := []Category{
		{Value: "all", DisplayText: "All"},
		{Value: "image-video", DisplayText: "Image & Video"},
		{Value: "music", DisplayText: "Music"},
	}

	d := IndexView{
		Title:          "Carp - " + r.URL.Path,
		Dir:            rootDir,
		Breadcrumb:     breadcrumb,
		Categories:     categories,
		ActiveCategory: activeCategory,
	}
	// Html Header
	mytemplate.IndexList()
	err = parsedTemplate.ExecuteTemplate(w, "index_list", &d)

	if err != nil {
		log.Println(err.Error())
		http.Error(w, http.StatusText(500), 500)
	}

	// Html Body
	myhttp.ServeFile(w, r, rootDir+r.URL.Path)

	// Html Footer
	parsedTemplate.ExecuteTemplate(w, "index_list_footer", nil)
}
