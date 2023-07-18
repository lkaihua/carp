package types

type EntryType string

const (
	EntryTypeFolder  EntryType = "folder"
	EntryTypeImage   EntryType = "image"
	EntryTypeVideo   EntryType = "video"
	EntryTypeAudio   EntryType = "audio"
	EntryTypeText    EntryType = "text"
	EntryTypeBinary  EntryType = "binary"
	EntryTypeUnknown EntryType = "unknown"
)

func (et EntryType) String() string {
	return string(et)
}
