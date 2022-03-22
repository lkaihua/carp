package mytemplate

import (
	"fmt"
	"net/http"
	"net/url"
	"path/filepath"
	"text/template"

	"github.com/lkaihua/carp-web-gallery/packages/types"
)

const template_prefix string = "folder_content_"
const template_gohtml string = ".html"

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
	EntryType types.EntryType
	UrlString string
	FirstName string
	LastName  string // File extension string if it's a file, or "/" if it's a folder
	// ModTime
}

func FolderContent(w http.ResponseWriter, r *http.Request, data *[]DisplayEntry) {
	templates := []string{
		filepath.Join("./templates", Default.TemplateName()),
		filepath.Join("./templates", ImageVideo.TemplateName()),
		filepath.Join("./templates", Music.TemplateName()),
		filepath.Join("./templates", "preview_modal"+template_gohtml),
		filepath.Join("./templates", "music_player"+template_gohtml),
	}
	parsedTemplate, _ := template.ParseFiles(templates...)

	countAll := len(*data)
	countMap := make(map[types.EntryType]int)
	for _, v := range *data {
		countMap[v.EntryType] += 1
	}
	countImageVideo := countMap[types.EntryTypeImage] + countMap[types.EntryTypeVideo]
	countMusic := countMap[types.EntryTypeMusic]

	template_name := Default.String()
	if queries, err := url.ParseQuery(r.URL.RawQuery); err == nil {
		if q, ok := queries["category"]; ok {
			switch q[0] {
			case "music":
				template_name = Music.String()
			case "image-video":
				template_name = ImageVideo.String()
			case "all":
				template_name = Default.String()
			default:
				template_name = Default.String()
			}
		} else {
			// Decide the category based on the file percentage
			if countAll > 0 {
				if countImageVideo >= countAll/2 {
					template_name = ImageVideo.String()
				} else if countMusic >= countAll/2 {
					template_name = Music.String()
				} else {
					template_name = Default.String()
				}
			}
		}
	}

	template_name = template_prefix + template_name
	fmt.Println("[FolderContent] template is:", template_name)

	err := parsedTemplate.ExecuteTemplate(w, template_name, struct {
		DisplayEntries                        []DisplayEntry
		CountAll, CountImageVideo, CountMusic int
	}{
		DisplayEntries:  *data,
		CountAll:        countAll,
		CountImageVideo: countImageVideo,
		CountMusic:      countMusic,
	})

	if err != nil {
		fmt.Println("[FolderContent] error in execute Template:", template_name, err)
		http.Error(w, http.StatusText(500), 500)
	}
}
