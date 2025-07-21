package mytemplate

import (
	"encoding/json"
	"net/http"
	"net/url"

	types "github.com/lkaihua/carp/src/packages/types/proto"
)

func Folder(w http.ResponseWriter, r *http.Request, entries []*types.DisplayItem) {

	countAll := len(entries)
	countTypeMap := make(map[types.EntryType]int)
	coverImage := []string{}

	for _, v := range entries {
		countTypeMap[v.EntryType] += 1
		if v.EntryType == types.EntryType_ENTRY_TYPE_IMAGE && len(coverImage) < 4 {
			coverImage = append(coverImage, v.UrlString)
		}
	}
	countImage := countTypeMap[types.EntryType_ENTRY_TYPE_IMAGE]
	countVideo := countTypeMap[types.EntryType_ENTRY_TYPE_VIDEO]
	countPhoto := countImage + countVideo

	countMusic := countTypeMap[types.EntryType_ENTRY_TYPE_MUSIC]

	// init all query parameters
	viewCategory := types.ViewCategory_VIEW_CATEGORY_DEFAULT
	if queries, err := url.ParseQuery(r.URL.RawQuery); err == nil {
		if categories, ok := queries["category"]; ok {
			// sort data by category
			switch categories[0] {
			case "music":
				viewCategory = types.ViewCategory_VIEW_CATEGORY_MUSIC
			case "photo":
				viewCategory = types.ViewCategory_VIEW_CATEGORY_PHOTO
			default:
				viewCategory = types.ViewCategory_VIEW_CATEGORY_DEFAULT
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

	contentData := types.FolderContentData{
		ViewCategory: viewCategory,
		ItemCount: &types.ItemCount{
			CountAll:   int32(countAll),
			CountImage: int32(countImage),
			CountVideo: int32(countVideo),
			CountPhoto: int32(countPhoto),
			CountMusic: int32(countMusic),
		},
		CoverImage:   coverImage,
		DisplayItems: entries,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(contentData)
}
