package carphttp

import (
	"encoding/json"
	"fmt"
	"html/template"
	"net/url"
	"strings"

	"github.com/lkaihua/carp/src/carp-server/packages/carptemplate"
	"github.com/lkaihua/carp/src/carp-server/packages/types"
	"github.com/lkaihua/carp/src/carp-server/packages/utils"
)

/**
 * htmlEscape
 * @Description: Escape HTML. Borrowed from net/http/server.go
 * @See https://github.com/golang/go/blob/master/src/net/http/server.go#L2251-L2259
 */
var htmlReplacer = strings.NewReplacer(
	"&", "&amp;",
	"<", "&lt;",
	">", "&gt;",
	// "&#34;" is shorter than "&quot;".
	`"`, "&#34;",
	// "&#39;" is shorter than "&apos;" and apos was not in HTML until HTML5.
	"'", "&#39;",
)

func htmlEscape(s string) string {
	return htmlReplacer.Replace(s)
}

func outputDirList(w ResponseWriter, r *Request, dirs anyDirs) {
	data := []types.DisplayEntry{}

	for i, n := 0, dirs.len(); i < n; i++ {
		name := dirs.name(i)
		isFolder := dirs.isDir(i)
		modTime := dirs.modTime(i)
		size := dirs.size(i)

		// name may contain '?' or '#', which must be escaped to remain
		// part of the URL path, and not indicate the start of a query
		// string or fragment.
		url := url.URL{Path: name}
		urlString := url.String()

		name = htmlEscape(name)

		var firstName, lastName string
		var entryType types.EntryType

		if isFolder {
			entryType = types.EntryTypeFolder
			firstName = name
			lastName = "/" // Folder last name is always "/"
			urlString += "/"
		} else {
			entryType = utils.GetFileEntityType(name)
			firstName, lastName = utils.GetFirstAndLastName(name)
			urlString += "?file=" + entryType.String()
		}

		data = append(data, types.DisplayEntry{
			Name:          name,
			FirstName:     firstName,
			LastName:      lastName,
			EntryType:     entryType,
			UrlString:     urlString,
			ModTimeString: modTime.Format("2006-01-02 15:04"),
			ModTimeUnix:   modTime.Unix(),
			SizeString:    utils.ByteCountSI(size),
			SizeInt:       size,
		})

	}

	displayEntries, err := json.Marshal(data)
	if err != nil {
		fmt.Println("[outputDirList] error in encoding json:", err)
		return
	}
	parsedTemplate, _ := carptemplate.LoadTemplates("dirlist")

	parsedTemplate.ExecuteTemplate(w, "dirlist", template.JS(displayEntries))

	// mytemplate.FolderContent(w, r, &data)
}
