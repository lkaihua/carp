package mytemplate

import (
	"fmt"
	"net/http"
	"net/url"
	"path/filepath"

	"github.com/lkaihua/carp/src/packages/types"
	"github.com/lkaihua/carp/src/packages/utils"
)

const template_folder string = "folder_content"

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

type DisplayItem struct {
	Name          string          `json:"name"`
	EntryType     types.EntryType `json:"entryType"`
	UrlString     string          `json:"urlString"`
	FirstName     string          `json:"firstName"`
	LastName      string          `json:"lastName"` // File extension string if it's a file, or "/" if it's a folder
	ModTimeString string          `json:"modTimeString"`
	ModTimeUnix   int64           `json:"modTimeUnix"`
	SizeString    string          `json:"sizeString"`
	SizeInt       int64           `json:"sizeInt"`
}

type FolderContentData struct {
	DisplayItems    []DisplayItem
	Category        string
	CountAll        int
	CountImage      int
	CountVideo      int
	CountImageVideo int
	CountMusic      int
	CoverImage      string
}

func Folder(w http.ResponseWriter, r *http.Request, entries *[]DisplayItem) {

	templates, err := utils.GetAllFiles(filepath.Join("src", "templates"), ".html")
	if err != nil {
		fmt.Println("[FolderContent] error in get all files for Template:", err)
		return
	}
	parsedTemplate, _ := NewTemplate().ParseFiles(templates...)

	countAll := len(*entries)
	countTypeMap := make(map[types.EntryType]int)
	coverImage := ""
	currentImageUrl := ""
	for _, v := range *entries {
		countTypeMap[v.EntryType] += 1
		if v.EntryType == types.EntryTypeImage {
			currentImageUrl = v.UrlString
		}
	}
	countImage := countTypeMap[types.EntryTypeImage]
	countVideo := countTypeMap[types.EntryTypeVideo]
	countImageVideo := countImage + countVideo
	countMusic := countTypeMap[types.EntryTypeMusic]

	if countImage == 1 {
		// If only one image, use it as the cover for image&video and album
		coverImage = currentImageUrl
	}

	template_name := Default.String()

	// init all query parameters
	category := ""
	highRankEntityType := types.EntryTypeDefault
	// sortby := ""
	// highRankSortType := types.SortTypeDefault
	if queries, err := url.ParseQuery(r.URL.RawQuery); err == nil {
		if categories, ok := queries["category"]; ok {
			category = categories[0]

			// sort data by category
			switch category {
			case "music":
				template_name = Music.String()
				highRankEntityType = types.EntryTypeMusic
			case "image":
				template_name = ImageVideo.String()
				highRankEntityType = types.EntryTypeImage
			case "video":
				template_name = ImageVideo.String()
				highRankEntityType = types.EntryTypeVideo
			case "image-video":
				template_name = ImageVideo.String()
			// case "text":
			// categoryEntityType = types.EntryTypeText
			case "all":
				template_name = Default.String()
			default:
				template_name = Default.String()
			}
		}
		// if sortbys, ok := queries["sortby"]; ok {
		// 	sortby = sortbys[0]
		// 	switch sortby  {
		// 	case "oldFirst":
		// 		sort.SliceStable(data, func(i, j int) bool {
		// 			return (*data)[i].ModTimeUnix < (*data)[j].ModTimeUnix
		// 		})
		// 	case "newFirst":
		// 		sort.SliceStable(data, func(i, j int) bool {
		// 			return (*data)[i].ModTimeUnix > (*data)[j].ModTimeUnix
		// 		})
		// 	case "ztoa":
		// 	case "atoz": // by default `atoz``
		// 	default:
		// 	}

		// }
	}

	// Group by category
	highEntries, lowEntries := make([]DisplayItem, 0), make([]DisplayItem, 0)
	for _, entry := range *entries {
		if entry.EntryType == highRankEntityType {
			highEntries = append(highEntries, entry)
		} else {
			lowEntries = append(lowEntries, entry)
		}
	}
	finalEntries := append(highEntries, lowEntries...)

	template_name = template_folder + "_" + template_name

	Render(w, parsedTemplate, template_name, FolderContentData{
		DisplayItems:    finalEntries,
		Category:        category,
		CountAll:        countAll,
		CountImage:      countImage,
		CountVideo:      countVideo,
		CountImageVideo: countImageVideo,
		CountMusic:      countMusic,
		CoverImage:      coverImage,
	})
}
