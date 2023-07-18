package carptemplate

import (
	"strings"
)

type BreadcrumbLevel struct {
	Name      string
	UrlString string
	IsCurrent bool
}

// return all a list of upstream folder paths from the current folder path
func Breadcrumb(path string) []BreadcrumbLevel {
	// Happy Path
	// "/a/b/" =>  ["/a/", "/a/b/"]
	// "/a/b/c.png" => ["/a/", "/a/b/"]

	// Corner cases
	// "/" =>  ["/"]
	// "/a//b/" => ["/a/", "/a/b/"]

	levels := strings.Split(path, "/")
	res := []BreadcrumbLevel{{Name: " ", UrlString: "/"}}

	// ignore the last level, it's either "" or "{filename}.{extension}"
	for i := 0; i < len(levels)-1; i++ {
		if levels[i] != "" {
			newStr := res[len(res)-1].UrlString + levels[i] + "/"
			isCurrent := false
			if i == len(levels)-2 {
				isCurrent = true
			}
			res = append(res, BreadcrumbLevel{Name: levels[i], UrlString: newStr, IsCurrent: isCurrent})
		}
	}

	return res
}
