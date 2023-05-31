package mytemplate

import (
	"fmt"
	"net/http"
	"net/url"
	"path/filepath"

	// "sort"

	"github.com/lkaihua/carp-web-gallery/packages/types"
	"github.com/lkaihua/carp-web-gallery/packages/utils"
)

const template_folder string = "folder_content"
const template_ext string = ".html"

type ViewCategory string

const (
	Default    ViewCategory = "default"
	Image      ViewCategory = "image"
	Video      ViewCategory = "video"
	ImageVideo ViewCategory = "image_video"
	Music      ViewCategory = "music"
)

func (v ViewCategory) String() string {
	return string(v)
}

type DisplayEntry struct {
	Name      string          `json:"name"`
	EntryType types.EntryType `j	son:"entryType"`
	UrlString string
	FirstName string
	LastName  string
	// File extension string if it's a file, or "/" if it's a folder
	IsCover       bool
	IsThumbnail   bool
	ModTimeString string
	ModTimeUnix   int64
	SizeString    string
	SizeInt       int64
	HasThumbnail  string
}

func FolderContent(w http.ResponseWriter, r *http.Request, data *[]DisplayEntry) {

	allTempaltes, err := utils.GetAllFiles(filepath.Join("./templates", template_folder), template_ext)
	if err != nil {
		fmt.Println("[FolderContent] error in get all files for Template:", err)
		return
	}

	templates := append([]string{
		filepath.Join("./templates", "music_player"+template_ext),
		filepath.Join("./templates", "preview_modal"+template_ext),
	}, allTempaltes...)
	parsedTemplate, _ := NewTemplate().ParseFiles(templates...)

	countAll := len(*data)
	countMap := make(map[types.EntryType]int)
	hasCover := ""
	currentImageUrl := ""
	for _, v := range *data {
		countMap[v.EntryType] += 1
		if v.IsCover {
			hasCover = v.UrlString
		}
		if v.EntryType == types.EntryTypeImage {
			currentImageUrl = v.UrlString
		}
	}
	countImage := countMap[types.EntryTypeImage]
	countVideo := countMap[types.EntryTypeVideo]
	countImageVideo := countImage + countVideo
	countMusic := countMap[types.EntryTypeMusic]

	if countImage == 1 {
		// If only one image, use it as the cover for image&video and album
		hasCover = currentImageUrl
	}

	template_name := Default.String()

	// init all query parameters
	category := ""
	// sortby := ""
	if queries, err := url.ParseQuery(r.URL.RawQuery); err == nil {
		if categories, ok := queries["category"]; ok {
			category = categories[0]
			switch category {
			case "music":
				template_name = Music.String()
			case "image":
				template_name = ImageVideo.String()
			case "video":
				template_name = ImageVideo.String()
			case "image-video":
				template_name = ImageVideo.String()
			case "all":
				template_name = Default.String()
			default:
				template_name = Default.String()
			}
		}
		// if sortbys, ok := queries["sortby"]; ok {
		// 	sortby = sortbys[0]

		// 	switch sortby  {
		// 	// case "oldestFirst":
		// 	// 	sort.SliceStable(data, func(i, j int) bool {
		// 	// 		return (*data)[i].ModTimeUnix < (*data)[j].ModTimeUnix
		// 	// 	})
		// 	// case "newestFirst":
		// 	// 	sort.SliceStable(data, func(i, j int) bool {
		// 	// 		return (*data)[i].ModTimeUnix > (*data)[j].ModTimeUnix
		// 	// 	})
		// 	// case "ztoa":
		// 	// case "atoz": // by default `atoz``
		// 	default:
		// 	}

		// }
	}

	template_name = template_folder + "_" + template_name
	fmt.Println("[FolderContent] template is:", template_name)

	err = parsedTemplate.ExecuteTemplate(w, template_name, struct {
		DisplayEntries  []DisplayEntry
		Category        string
		CountAll        int
		CountImage      int
		CountVideo      int
		CountImageVideo int
		CountMusic      int
		HasCover        string
	}{
		DisplayEntries:  *data,
		Category:        category,
		CountAll:        countAll,
		CountImage:      countImage,
		CountVideo:      countVideo,
		CountImageVideo: countImageVideo,
		CountMusic:      countMusic,
		HasCover:        hasCover,
	})

	if err != nil {
		fmt.Println("[FolderContent] error in execute Template:", template_name, err)
		http.Error(w, http.StatusText(500), 500)
	}
}
