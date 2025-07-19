package utils

import (
	"bytes"
	"io/fs"
	"os"
	"path/filepath"
	"strings"
)

// CombineCSS walks through the folder and combines all .css files
func CombineCSS(root string) (string, error) {
	var buffer bytes.Buffer

	err := filepath.WalkDir(root, func(path string, d fs.DirEntry, err error) error {
		if err != nil {
			return err
		}
		if !d.IsDir() && strings.HasSuffix(d.Name(), ".css") {
			content, readErr := os.ReadFile(path)
			if readErr != nil {
				return readErr
			}
			buffer.Write(content)
			buffer.WriteString("\n\n") // separate files with newlines
		}
		return nil
	})

	if err != nil {
		return "", err
	}

	return buffer.String(), nil
}
