package models

type EntryType string

const (
	EntryTypeDefault EntryType = "default"
	EntryTypeFolder  EntryType = "folder"
	EntryTypeImage   EntryType = "image"
	EntryTypeVideo   EntryType = "video"
	EntryTypeMusic   EntryType = "music"
	EntryTypeText    EntryType = "text"
)

func (et EntryType) String() string {
	return string(et)
}
