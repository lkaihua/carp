package utils

import (
	"os"
	"path/filepath"
	"strings"
)

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
