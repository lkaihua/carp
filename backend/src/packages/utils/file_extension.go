package utils

import "strings"

var DefaultImages = []string{"jpg", "jpeg", "png", "gif", "tiff", "webp", "pic", "raw", "svg"}
var DefaultVideos = []string{"mp4", "mov"}
var DefaultAudios = []string{"mp3", "wav", "m4a", "flac"}
var DefaultTexts = []string{"txt", "md", "go", "ts", "tsx", "js", "jsx", "py", "sh", "yml", "yaml", "xml", "html", "css", "c", "cpp", "h", "hpp", "rs", "java", "sql", "rb", "php"}
var DefaultJSONs = []string{"json"}

func isExtension(name string, exts *[]string) bool {
	for _, ext := range *exts {
		if strings.HasSuffix(strings.ToLower(name), "."+ext) {
			return true
		}
	}
	return false
}

func IsImage(name string) bool {
	return isExtension(name, &DefaultImages)
}
func IsVideo(name string) bool {
	return isExtension(name, &DefaultVideos)
}
func IsMusic(name string) bool {
	return isExtension(name, &DefaultAudios)
}
func IsText(name string) bool {
	return isExtension(name, &DefaultTexts)
}
func IsJSON(name string) bool {
	return isExtension(name, &DefaultJSONs)
}
