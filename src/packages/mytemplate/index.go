package mytemplate

import (
	"fmt"
	"net/http"
	"path/filepath"

	"github.com/lkaihua/carp/src/packages/mypath"
	"github.com/lkaihua/carp/src/packages/utils"
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

func Header(w http.ResponseWriter, indexView *IndexView) {
	templates, err := utils.GetAllFiles(filepath.Join("src", "templates"), ".html")
	if err != nil {
		fmt.Println("[FolderContent] error in get all files for Template:", err)
		return
	}
	parsedTemplate, err := NewTemplate().ParseFiles(templates...)
	if err != nil {
		fmt.Println("[FolderContent] Error reading templates folder:", err)
		return
	}

	Render(w, parsedTemplate, "header", indexView)
}

func Footer(w http.ResponseWriter) {
	templates, err := utils.GetAllFiles(filepath.Join("src", "templates"), ".html")

	if err != nil {
		fmt.Println("[FolderContent] error in get all files for Template:", err)
		return
	}
	parsedTemplate, _ := NewTemplate().ParseFiles(templates...)

	Render(w, parsedTemplate, "footer", nil)
}
