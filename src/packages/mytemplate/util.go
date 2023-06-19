package mytemplate

import (
	"errors"
	"fmt"
	"html/template"
	"io/ioutil"
	"path/filepath"
	"strconv"
	"strings"
)

/**
 * Extension of Golang template functions
 */
func readLocalFile(path string) (string, error) {
	b, err := ioutil.ReadFile(filepath.Join("src", path))

	return string(b), err
}

func IncludeHTML(path string) template.HTML {
	b, err := readLocalFile(path)
	if err != nil {
		fmt.Println("Error reading HTML file: ", err)
		return ""
	}
	return template.HTML(string(b))
}

func IncludeCSS(path string) template.CSS {
	b, err := readLocalFile(path)
	if err != nil {
		fmt.Println("Error reading CSS file: ", err)
		return ""
	}
	return template.CSS(string(b))
}

func IncludeJS(path string) template.JS {
	b, err := readLocalFile(path)
	if err != nil {
		fmt.Println("Error reading JS file: ", err)
		return ""
	}
	return template.JS(string(b))
}

func Dict(values ...interface{}) (map[string]interface{}, error) {
	if len(values)%2 != 0 {
		return nil, errors.New("invalid dict call")
	}
	dict := make(map[string]interface{}, len(values)/2)
	for i := 0; i < len(values); i += 2 {
		key, ok := values[i].(string)
		if !ok {
			return nil, errors.New("dict keys must be strings")
		}
		dict[key] = values[i+1]
	}
	return dict, nil
}

func Contains(str string, sub string) bool {
	return strings.Contains(str, sub)
}

func Minus(a, b int) string {
	return strconv.FormatInt(int64(a-b), 10)
}

var templateFuncMap = template.FuncMap{
	"includeHTML": IncludeHTML,
	"includeJS":   IncludeJS,
	"dict":        Dict,
	"contains":    Contains,
	"minus":       Minus,
}

func NewTemplate() *template.Template {
	return template.New("").Funcs(templateFuncMap)
}
