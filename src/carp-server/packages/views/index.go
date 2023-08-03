package views

import (
	"log"
	"net/http"

	"github.com/lkaihua/carp/src/carp-server/packages/models"
	"github.com/lkaihua/carp/src/carp-server/packages/utils"
)

type IndexView struct {
	Dir        string
	Breadcrumb []BreadcrumbLevel
	View       models.ViewType
}

func Index(w http.ResponseWriter, indexView IndexView) {
	parsedTemplate, err := utils.LoadTemplates("index", "breadcrumb", "footer")
	if err != nil {
		log.Println("[Index] template parse error:" + err.Error())
		return
	}
	err = parsedTemplate.ExecuteTemplate(w, "index", indexView)
	if err != nil {
		log.Println("[Index] template execute error:" + err.Error())
		return
	}
}
