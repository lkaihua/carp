package utils

import (
	"os"
	"path/filepath"
	"strings"
)

// GetAllFiles walks through the directory tree rooted at 'root' and returns a slice of file paths
// that have the specified file extension 'ext'. It returns an error if any occurs during the walk.
func GetAllFiles(root, ext string) (results []string, walkErr error) {
	filepath.Walk(root, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			walkErr = err
			return nil
		}
		if !info.IsDir() && strings.HasSuffix(path, ext) {
			// fmt.Printf("File Name: %s, %s\n", path, info.Name())
			results = append(results, path)
		}
		return nil
	})
	return results, walkErr
}
