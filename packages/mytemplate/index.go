package mytemplate

import (
	"html/template"
	"log"
	"net/http"
	"path/filepath"

	"github.com/lkaihua/carp-web-gallery/packages/mypath"
	"github.com/lkaihua/carp-web-gallery/packages/utils"
)

type Category struct {
	Value       string
	DisplayText string
}
type IndexData struct {
	Title      string
	Dir        string
	Breadcrumb []mypath.BreadcrumbLevel
	Categories []Category
	// ActiveCategory string
}

const template_folder string = "./templates"

func ParseTemplate() (*template.Template, error) {
	// templates := []string{
	// 	filepath.Join("templates", "index.html"),
	// 	filepath.Join("templates", "top_breadcrumb.html"),
	// 	filepath.Join("templates", "category_selector.html"),
	// 	filepath.Join("templates", "footer.html"),
	// }
	allTemplates, err := utils.GetAllFiles(filepath.Join(template_folder), utils.Html(""))
	if err != nil {
		log.Println("[ParseTemplate] Get files error:" + err.Error())
		return nil, err
	}

	parsedTemplate, err := NewTemplate().ParseFiles(allTemplates...)
	if err != nil {
		// Log the detailed error
		log.Println("[ParseTemplate] template parse error:" + err.Error())
		return nil, err
	}

	return parsedTemplate, nil
}

func Index(w http.ResponseWriter, template *template.Template, indexData *IndexData) {
	err := template.ExecuteTemplate(w, "index", indexData)
	if err != nil {
		log.Println(err.Error())
		http.Error(w, http.StatusText(500), 500)
	}
}

func Footer(w http.ResponseWriter, template *template.Template) {
	err := template.ExecuteTemplate(w, "footer", nil)
	if err != nil {
		log.Println(err.Error())
	}
}
