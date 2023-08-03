package models

import "strings"

type OutputFormat string

const (
	JsonFormat OutputFormat = "json"
	HtmlFormat OutputFormat = "html"
)

// Cover to string
func (o OutputFormat) String() string {
	return string(o)
}

// Convert a input string to OutputFormat
func GetOutputFormat(input string) OutputFormat {
	switch strings.ToLower(input) {
	case JsonFormat.String():
		return JsonFormat
	default:
		return HtmlFormat
	}
}
