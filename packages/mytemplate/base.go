package mytemplate

import (
	"errors"
	"fmt"
	"html/template"
	"io/ioutil"
)

func IncludeHTML(path string) template.HTML {
	b, err := ioutil.ReadFile(path)
	if err != nil {
		fmt.Println("Error reading HTML file", err)
		return ""
	}
	return template.HTML(string(b))
}

func IncludeCSS(path string) template.CSS {
	b, err := ioutil.ReadFile(path)
	if err != nil {
		fmt.Println("Error reading CSS file", err)
		return ""
	}
	return template.CSS(string(b))
}

func IncludeJS(path string) template.JS {
	b, err := ioutil.ReadFile(path)
	if err != nil {
		fmt.Println("Error reading JS file", err)
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

var templateFuncMap = template.FuncMap{
	"includeHTML": IncludeHTML,
	"includeJS":   IncludeJS,
	"dict":        Dict,
}

func NewTemplate() *template.Template {
	return template.New("").Funcs(templateFuncMap)
}
