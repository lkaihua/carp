package mytemplate

import (
	"fmt"
	"net/http"
	"net/url"
	"path/filepath"
	"text/template"
)

const template_prefix string = "folder_content_"
const template_gohtml string = ".gohtml"

type ViewCategory string

const (
	Default    ViewCategory = "default"
	ImageVideo ViewCategory = "image_and_video"
	Music      ViewCategory = "music"
)

func (v ViewCategory) String() string {
	return string(v)
}
func (v ViewCategory) TemplateName() string {
	return template_prefix + v.String() + template_gohtml
}

type DisplayEntry struct {
	Name      string
	EntryType string
	UrlString string
	FirstName string
	LastName  string // File extension string if it's a file, or "/" if it's a folder
}

func FolderContent(w http.ResponseWriter, r *http.Request, data *[]DisplayEntry) {
	templates := []string{
		filepath.Join("./templates", Default.TemplateName()),
		filepath.Join("./templates", ImageVideo.TemplateName()),
		filepath.Join("./templates", Music.TemplateName()),
		filepath.Join("./templates", "preview_modal"+template_gohtml),
	}
	parsedTemplate, _ := template.ParseFiles(templates...)

	template_name := Default.String()
	if queries, err := url.ParseQuery(r.URL.RawQuery); err == nil {
		if q, ok := queries["category"]; ok {
			switch q[0] {
			case Music.String():
				template_name = Music.String()
			case "image-video":
				template_name = ImageVideo.String()
			case "all":
				template_name = Default.String()
			default:
				template_name = Default.String()
			}
		}
	}
	template_name = template_prefix + template_name
	fmt.Println("[FolderContent] template is:", template_name)

	err := parsedTemplate.ExecuteTemplate(w, template_name, *data)
	if err != nil {
		fmt.Println("[FolderContent] error in execute Template:", template_name)
		http.Error(w, http.StatusText(500), 500)
	}
}
