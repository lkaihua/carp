package types

type EntryType string

const (
	EntryTypeDefault EntryType = "default"
	EntryTypeFolder  EntryType = "folder"
	EntryTypeImage   EntryType = "image"
	EntryTypeVideo   EntryType = "video"
	EntryTypeMusic   EntryType = "music"
)

func (et EntryType) String() string {
	return string(et)
}
