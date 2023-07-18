package types

type DisplayEntry struct {
	Name          string    `json:"name"`      // file full name after html escaped
	FirstName     string    `json:"firstName"` // without extension
	LastName      string    `json:"lastName"`  // extension string if it's a file, or "/" if it's a folder
	EntryType     EntryType `json:"entryType"` // entry type might be folder, image, video, music, etc.
	UrlString     string    `json:"urlString"`
	ModTimeString string    `json:"modTimeString"` // last modified time human readable string
	ModTimeUnix   int64     `json:"modTimeUnix"`   // last modified time in unix time, used for sorting
	SizeString    string    `json:"sizeString"`    // file size human readable string
	SizeInt       int64     `json:"sizeInt"`       // file size in int64, used for sorting
}
