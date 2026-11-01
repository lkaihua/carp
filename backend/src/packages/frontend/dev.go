//go:build !carp_release

package frontend

import "io/fs"

// Files is nil in development because Vite serves the React app separately.
func Files() fs.FS { return nil }
