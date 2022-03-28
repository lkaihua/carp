package mytemplate

import (
	"fmt"
	"html/template"
	"io/ioutil"
)

func IncludeHTML(path string) template.HTML {
	b, err := ioutil.ReadFile(path)
	if err != nil {
		fmt.Println("[IncludeHTML] Error reading file", err)
		return ""
	}
	return template.HTML(string(b))
}

func IncludeJS(path string) template.JS {
	b, err := ioutil.ReadFile(path)
	if err != nil {
		fmt.Println("[IncludeHTML] Error reading JS file", err)
		return ""
	}
	return template.JS(string(b))
}

var templateFuncMap = template.FuncMap{
	"includeHTML": IncludeHTML,
	"includeJS":   IncludeJS,
}

func NewTemplate() *template.Template {
	return template.New("").Funcs(templateFuncMap)
}
