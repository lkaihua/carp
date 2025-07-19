package mytemplate

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"html/template"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
)

/**
 * Extension of Golang template functions
 */
func readLocalFile(path string) (string, error) {
	b, err := os.ReadFile(filepath.Join("src", path))
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

func Dict(values ...any) (map[string]any, error) {
	if len(values)%2 != 0 {
		return nil, errors.New("invalid dict call")
	}
	dict := make(map[string]any, len(values)/2)
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

func ToJSON(data any) template.JS {
	jsonData, err := json.Marshal(data)
	if err != nil {
		fmt.Println("Error converting to JSON: ", err)
		return ""
	}
	return template.JS(jsonData)
}

var templateFuncMap = template.FuncMap{
	"includeHTML": IncludeHTML,
	"includeCSS":  IncludeCSS,
	"includeJS":   IncludeJS,
	"dict":        Dict,
	"contains":    Contains,
	"minus":       Minus,
	"toJSON":      ToJSON,
}

func NewTemplate() *template.Template {
	return template.New("").Funcs(templateFuncMap)
}

func Render(w http.ResponseWriter, tmpl *template.Template, name string, data any) {
	var buffer bytes.Buffer

	if tmpl == nil || tmpl.Lookup(name) == nil {
		http.Error(w, fmt.Sprintf("template %q not found", name), http.StatusInternalServerError)
		return
	}

	err := tmpl.ExecuteTemplate(&buffer, name, data)
	if err != nil {
		err = fmt.Errorf("error executing template: %w", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "text/html; charset=UTF-8")
	buffer.WriteTo(w)
}
