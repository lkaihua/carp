package utils

import (
	"strings"

	"github.com/lkaihua/carp/src/carp-server/packages/types"
)

var DefaultImages = []string{"jpg", "jpeg", "png", "gif", "tiff", "webp", "pic", "raw", "svg"}
var DefaultVideos = []string{"mp4", "mov"}
var DefaultAudios = []string{"mp3", "wav", "m4a", "flac"}
var DefaultText = []string{"txt", "md", "html", "htm", "xhtml", "css", "js", "json", "xml",
	"csv", "log", "conf", "ini", "yaml", "yml", "sh", "bat", "ps1", "py", "go", "java", "c", "cpp",
	"h", "hpp", "cs", "php", "rb", "pl", "sql", "asm", "asmx", "aspx", "jsp", "ts", "tsx", "vue",
	"jsx", "tsx", "swift", "kt", "kts", "rs", "r", "m", "mm", "dart"}
var DefaultBinary = []string{"zip", "rar", "7z"}

func isExtension(filename string, exts *[]string) bool {
	for _, ext := range *exts {
		if strings.HasSuffix(strings.ToLower(filename), "."+ext) {
			return true
		}
	}
	return false
}

func GetFileEntityType(filename string) types.EntryType {
	if isExtension(filename, &DefaultImages) {
		return types.EntryTypeImage
	}
	if isExtension(filename, &DefaultVideos) {
		return types.EntryTypeVideo
	}
	if isExtension(filename, &DefaultAudios) {
		return types.EntryTypeAudio
	}
	if isExtension(filename, &DefaultText) {
		return types.EntryTypeText
	}
	if isExtension(filename, &DefaultBinary) {
		return types.EntryTypeBinary
	}
	return types.EntryTypeUnknown
}

func GetFirstAndLastName(fileName string) (string, string) {
	var firstName, lastName string
	if lastDotIndex := strings.LastIndex(fileName, "."); lastDotIndex == -1 {
		// It's a legal file name without any extention
		lastName = ""
		firstName = fileName
	} else {
		lastName = fileName[lastDotIndex+1:]
		firstName = fileName[:lastDotIndex]
	}
	return firstName, lastName
}
