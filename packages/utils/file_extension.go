package utils

import "strings"

var DefaultImages = []string{"jpg", "jpeg", "png", "gif", "tiff", "webp", "pic", "raw"}
var DefaultVideos = []string{"mp4", "mov"}
var DefaultAudios = []string{"mp3"}

func isExtension(name string, exts *[]string) bool {
	for _, ext := range *exts {
		if strings.HasSuffix(name, "."+ext) {
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
