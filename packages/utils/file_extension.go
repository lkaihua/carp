package utils

import "strings"

var DefaultImages = []string{"jpg", "jpeg", "png", "gif", "tiff", "webp", "pic", "raw", "svg"}
var DefaultVideos = []string{"mp4", "mov"}
var DefaultAudios = []string{"mp3", "wav", "m4a", "flac"}
var Textable = []string{"txt", "md", "json", "css", "js", "html"}

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

func Html(str string) string {
	return str + ".html"
}
