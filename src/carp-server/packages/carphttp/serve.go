package carphttp

import (
	"log"
	"net/http"
	"strings"
)

const publicDir string = "./public/"

// Serve a file
func Serve(w http.ResponseWriter, r *http.Request) {
	rootDir := r.Context().Value("rootDir").(string)
	log.Println("[Serve] URL: [", r.URL.Path, "]")
	ServeFile(w, r, rootDir+r.URL.Path)
}

// Serve public static files for carp web UI
func ServePublic(w http.ResponseWriter, r *http.Request) {
	log.Println("[ServePublic]", r.URL.Path)
	ServeFile(w, r, publicDir+strings.TrimPrefix(r.URL.Path, "/public/"))
}
