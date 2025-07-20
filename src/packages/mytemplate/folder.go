package mytemplate

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"

	"github.com/lkaihua/carp/src/packages/types"
)

const template_folder string = "folder_content"

type ViewCategory string

const (
	Default ViewCategory = "default"
	Photo   ViewCategory = "photo"
	Music   ViewCategory = "music"
)

func (v ViewCategory) String() string {
	return string(v)
}

type DisplayItem struct {
	Name        string          `json:"name"`
	EntryType   types.EntryType `json:"entryType"`
	UrlString   string          `json:"urlString"`
	FirstName   string          `json:"firstName"`
	LastName    string          `json:"lastName"` // File extension string if it's a file, or "/" if it's a folder
	ModTime     string          `json:"modTime"`
	ModTimeUnix int64           `json:"modTimeUnix"`
	Size        string          `json:"size"`
	SizeInt     int64           `json:"sizeInt"`
}

type FolderContentData struct {
	DisplayItems    []DisplayItem `json:"displayItems"`
	ViewCategory    string        `json:"viewCategory"`
	CountAll        int           `json:"countAll"`
	CountImage      int           `json:"countImage"`
	CountVideo      int           `json:"countVideo"`
	CountImageVideo int           `json:"countImageVideo"`
	CountMusic      int           `json:"countMusic"`
	CoverImage      []string      `json:"coverImage"`
}

func Folder(w http.ResponseWriter, r *http.Request, entries *[]DisplayItem) {

	countAll := len(*entries)
	countTypeMap := make(map[types.EntryType]int)
	// an array of 4 to hold cover images
	coverImage := []string{}

	fmt.Println("countAll: ", countAll)
	for _, v := range *entries {
		countTypeMap[v.EntryType] += 1
		if v.EntryType == types.EntryTypeImage && len(coverImage) < 4 {
			coverImage = append(coverImage, v.UrlString)
		}
	}
	countImage := countTypeMap[types.EntryTypeImage]
	countVideo := countTypeMap[types.EntryTypeVideo]
	countImageVideo := countImage + countVideo
	countMusic := countTypeMap[types.EntryTypeMusic]

	// init all query parameters
	viewCategory := Default.String()
	if queries, err := url.ParseQuery(r.URL.RawQuery); err == nil {
		if categories, ok := queries["category"]; ok {
			// sort data by category
			switch categories[0] {
			case "music":
				viewCategory = Music.String()
			case "photo":
				viewCategory = Photo.String()
			default:
				viewCategory = Default.String()
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

	contentData := FolderContentData{
		ViewCategory:    viewCategory,
		CountAll:        countAll,
		CountImage:      countImage,
		CountVideo:      countVideo,
		CountImageVideo: countImageVideo,
		CountMusic:      countMusic,
		CoverImage:      coverImage,
		DisplayItems:    *entries,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(contentData)
}
