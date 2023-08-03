// This file fixes the dependency issue when migrating `fs` from offical `net/http` to a custom `carphttp` package.
package carphttp

import (
	"errors"
	"log"
	"net/http"
	"runtime"
)

// Alias Type
type ResponseWriter = http.ResponseWriter
type Request = http.Request
type Handler = http.Handler

// HTTP Status Code
const (
	StatusInternalServerError          = http.StatusInternalServerError
	StatusRequestedRangeNotSatisfiable = http.StatusRequestedRangeNotSatisfiable
	StatusPartialContent               = http.StatusPartialContent
	StatusOK                           = http.StatusOK
	StatusNotFound                     = http.StatusNotFound
	StatusForbidden                    = http.StatusForbidden
	StatusMovedPermanently             = http.StatusMovedPermanently
	StatusNotModified                  = http.StatusNotModified
	StatusPreconditionFailed           = http.StatusPreconditionFailed
	StatusBadRequest                   = http.StatusBadRequest
)

// Alias variable
const sniffLen = 512
const TimeFormat = http.TimeFormat

// Alias function
var Error = http.Error
var DetectContentType = http.DetectContentType
var ParseTime = http.ParseTime

// Alias logf
func logf(r *Request, format string, args ...interface{}) {
	log.Printf(format, args...)
}

// `safefilepath.FromFS`
// Copied from '/internal/safefilepath/path.go' because of `use of internal package internal/safefilepath not allowed` error.
var errInvalidPath = errors.New("invalid path")

func fromFS(path string) (string, error) {
	if runtime.GOOS == "plan9" {
		if len(path) > 0 && path[0] == '#' {
			return "", errInvalidPath
		}
	}
	for i := range path {
		if path[i] == 0 {
			return "", errInvalidPath
		}
	}
	return path, nil
}
