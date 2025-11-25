package mytemplate

import (
	"net/http"

	types "github.com/lkaihua/carp/src/packages/types/proto"
	"google.golang.org/protobuf/encoding/protojson"
)

const MAX_COVER_IMAGE_COUNT = 4
const MAX_COVER_VIDEO_COUNT = 4

func Folder(w http.ResponseWriter, r *http.Request, entries []*types.DisplayItem) {

	countAll := len(entries)
	countTypeMap := make(map[types.EntryType]int)
	coverImages := []string{}
	coverVideos := []*types.CoverVideo{}

	for _, v := range entries {
		countTypeMap[v.EntryType] += 1
		if v.EntryType == types.EntryType_ENTRY_TYPE_IMAGE && len(coverImages) < MAX_COVER_IMAGE_COUNT {
			coverImages = append(coverImages, v.FullUrl)
		}
		if v.EntryType == types.EntryType_ENTRY_TYPE_VIDEO && len(coverVideos) < MAX_COVER_VIDEO_COUNT {
			coverVideos = append(coverVideos, &types.CoverVideo{
				Url:     v.FullUrl,
				SizeInt: v.SizeInt,
			})
		}
	}
	countImage := countTypeMap[types.EntryType_ENTRY_TYPE_IMAGE]
	countVideo := countTypeMap[types.EntryType_ENTRY_TYPE_VIDEO]
	countPhoto := countImage + countVideo
	countMusic := countTypeMap[types.EntryType_ENTRY_TYPE_MUSIC]

	viewCategory := types.ViewCategory_VIEW_CATEGORY_DEFAULT
	if countPhoto > countAll/2 {
		viewCategory = types.ViewCategory_VIEW_CATEGORY_MUSIC
	} else if countMusic > countAll/2 {
		viewCategory = types.ViewCategory_VIEW_CATEGORY_PHOTO
	}

	// init all query parameters
	//if queries, err := url.ParseQuery(r.URL.RawQuery); err == nil {
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
	//}

	contentData := types.FolderContentData{
		ViewCategory: &viewCategory,
		ItemCount: &types.ItemCount{
			CountAll:   int32(countAll),
			CountImage: int32(countImage),
			CountVideo: int32(countVideo),
			CountPhoto: int32(countPhoto),
			CountMusic: int32(countMusic),
		},
		CoverImages:  &types.CoverImages{Data: coverImages},
		CoverVideos:  &types.CoverVideos{Data: coverVideos},
		DisplayItems: &types.DisplayItems{Data: entries},
	}

	m := protojson.MarshalOptions{
		EmitUnpopulated: true,
		UseEnumNumbers:  true,
		UseProtoNames:   true,
	}

	b, err := m.Marshal(&contentData)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	w.Header().Set("Content-Type", "application/json")

	// Note: instead of using json.NewEncoder, we use protojson to
	// marshal protobuf message to JSON
	// Otherwise, fields with default values will be omitted
	//// json.NewEncoder(w).Encode(&contentData)

	w.Write(b)
}
