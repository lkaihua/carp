package carptemplate

import (
	"log"
	"net/http"
	"path/filepath"

	"github.com/lkaihua/carp/src/carp-server/packages/types"
)

type IndexView struct {
	Title      string
	Dir        string
	Breadcrumb []BreadcrumbLevel
	View       types.ViewType
}

func Index(w http.ResponseWriter, indexView IndexView) {
	templates := []string{
		filepath.Join("src", "carp-server", "packages", "carptemplate", "index", "index.html"),
		filepath.Join("src", "carp-server", "packages", "carptemplate", "breadcrumb", "breadcrumb.html"),

		// filepath.Join("src", "templates", "category_selector.html"),
		// filepath.Join("templates", "footer.html"),
	}
	parsedTemplate, err := NewTemplate().ParseFiles(templates...)
	if err != nil {
		// Log the detailed error
		log.Println("[Index] template parse error:" + err.Error())
		// Return a generic "Internal Server Error" message
		// http.Error(w, http.StatusText(500), 500)
		return
	}

	err = parsedTemplate.ExecuteTemplate(w, "index", indexView)
	if err != nil {
		log.Println("[Index] error:" + err.Error())
		// http.Error(w, http.StatusText(500), 500)
		return
	}
}
