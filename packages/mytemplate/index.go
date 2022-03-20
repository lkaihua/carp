package mytemplate

import (
	"log"
	"net/http"
	"path/filepath"
	"text/template"

	"github.com/lkaihua/carp-web-gallery/packages/mypath"
)

type Category struct {
	Value       string
	DisplayText string
}
type IndexView struct {
	Title      string
	Dir        string
	Breadcrumb []mypath.BreadcrumbLevel
	Categories []Category
	// ActiveCategory string
}

func Index(w http.ResponseWriter, indexView *IndexView) {
	templates := []string{
		filepath.Join("templates", "index.gohtml"),
		filepath.Join("templates", "top_breadcrumb.gohtml"),
		filepath.Join("templates", "category_selector.gohtml"),
		// filepath.Join("templates", "footer.gohtml"),
	}
	parsedTemplate, err := template.ParseFiles(templates...)
	if err != nil {
		// Log the detailed error
		log.Println("[Index] template parse error:" + err.Error())
		// Return a generic "Internal Server Error" message
		http.Error(w, http.StatusText(500), 500)
		return
	}

	err = parsedTemplate.ExecuteTemplate(w, "index", indexView)
	if err != nil {
		log.Println(err.Error())
		http.Error(w, http.StatusText(500), 500)
	}
}

func Footer(w http.ResponseWriter) {
	templates := []string{
		filepath.Join("templates", "footer.gohtml"),
	}
	parsedTemplate, err := template.ParseFiles(templates...)
	if err != nil {
		// Log the detailed error
		log.Println("[Footer] template parse error:" + err.Error())
		// Return a generic "Internal Server Error" message
		http.Error(w, http.StatusText(500), 500)
		return
	}

	err = parsedTemplate.ExecuteTemplate(w, "footer", nil)
	if err != nil {
		log.Println(err.Error())
		http.Error(w, http.StatusText(500), 500)
	}
}
