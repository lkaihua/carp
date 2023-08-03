package utils

import (
	"io/fs"
	"log"
	"os"
	"path/filepath"
	"strings"
)

func GetAllTemplates(folder string) (results []string, walkErr error) {
	return GetAllFiles(folder, ".html", 1e3, 1e3)
}

func GetAllFiles(rootDir string, ext string, maxDepth int, maxChildren int) (results []string, walkErr error) {

	// filepath.Walk(root, func(path string, info os.FileInfo, err error) error {
	// 	if err != nil {
	// 		walkErr = err
	// 		return nil
	// 	}
	// 	if !info.IsDir() && strings.HasSuffix(path, ext) {
	// 		// fmt.Printf("File Name: %s, %s\n", path, info.Name())
	// 		results = append(results, path)
	// 	}
	// 	return nil
	// })
	walkErr = filepath.WalkDir(rootDir, func(path string, d fs.DirEntry, err error) error {
		if err != nil {
			return err
		}
		if d.IsDir() {
			// If maxDepath is set, skip the folder if it's too deep
			if maxDepth > 0 && strings.Count(path, string(os.PathSeparator)) > maxDepth {
				log.Println("skip", path)
				return fs.SkipDir
			}
		} else {
			// If maxChildren is set, stop the interation if it has too many children
			if maxChildren > 0 && len(results) > maxChildren {
				log.Println("too many children", path)
				return fs.SkipAll
			}
			// If the file extension is set, skip the file if it doesn't match
			if ext == "" {
				results = append(results, path)
			} else {
				if strings.HasSuffix(path, ext) {
					results = append(results, path)
				}
			}
		}
		return nil
	})

	return results, walkErr
}
