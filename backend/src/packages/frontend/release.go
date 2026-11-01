//go:build carp_release

package frontend

import (
	"embed"
	"io/fs"
)

// dist is copied from frontend/dist before building with -tags carp_release.
//
//go:embed dist
var assets embed.FS

// Files is the built React app embedded in the release executable.
func Files() fs.FS {
	frontend, err := fs.Sub(assets, "dist")
	if err != nil {
		panic(err) // The embedded path is checked by the compiler.
	}
	return frontend
}
