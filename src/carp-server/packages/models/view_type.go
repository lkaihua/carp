package models

import "strings"

type ViewType string

const (
	ViewTypeAll        ViewType = "all"
	ViewTypeImageVideo ViewType = "imagevideo"
	ViewTypeMusic      ViewType = "music"
)

func (v ViewType) String() string {
	return string(v)
}

// Convert a input string to ViewType
func GetViewType(input string) ViewType {
	// to lowercase
	input = strings.ToLower(input)
	// switch to select ViewType
	switch input {
	case ViewTypeImageVideo.String():
		return ViewTypeImageVideo
	case ViewTypeMusic.String():
		return ViewTypeMusic
	default:
		return ViewTypeAll
	}
}
