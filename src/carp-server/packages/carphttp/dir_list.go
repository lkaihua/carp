package carphttp

import (
	"encoding/json"
	"html/template"
	"log"
	"net/url"
	"strings"

	"github.com/lkaihua/carp/src/carp-server/packages/models"
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
	data := []models.DisplayEntry{}

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
		var entryType models.EntryType
		var children string

		if isFolder {
			entryType = models.EntryTypeFolder
			firstName = name
			lastName = "/" // Folder last name is always "/"
			urlString += "/"

			// let fetch children

			// if depth := r.Context().Value("depth"); depth != nil {

			// ctx := context.WithValue(r.Context(), "rootDir", rootDir)
			// r = r.WithContext(ctx)

			// rNew := r.Clone(r.Context())
			// rNew.URL.Path += urlString
			// 	// wNew := httptest.NewRecorder()
			// 	var log bytes.Buffer
			// 	// w1:= new ResponseWriter{}
			// 	// Serve(&log, rNew)
			// 	b, _ := ioutil.ReadAll(wNew.Result().Body)
			// 	log.Println(b)
			// 	children = string(b)
			// }

		} else {
			entryType = utils.GetFileEntityType(name)
			firstName, lastName = utils.GetFirstAndLastName(name)
			urlString += "?file=" + entryType.String()
		}

		data = append(data, models.DisplayEntry{
			Name:          name,
			FirstName:     firstName,
			LastName:      lastName,
			EntryType:     entryType,
			UrlString:     urlString,
			ModTimeString: modTime.Format("2006-01-02 15:04"),
			ModTimeUnix:   modTime.Unix(),
			SizeString:    utils.ByteCountSI(size),
			SizeInt:       size,
			Children:      children,
		})

	}

	displayEntries, err := json.Marshal(data)
	if err != nil {
		log.Println("[outputDirList] error in encoding json:", err)
		return
	}

	if queries, err := url.ParseQuery(r.URL.RawQuery); err == nil {
		if formats, ok := queries["format"]; ok {
			if models.GetOutputFormat(formats[0]) == models.JsonFormat {
				w.Header().Set("Content-Type", "application/json")
				// w.Write([]byte(`{"data":`))
				w.Write(displayEntries)
				// w.Write([]byte(`}`))
				return
			}
		}
	}

	parsedTemplate, _ := utils.LoadTemplates("header")

	parsedTemplate.ExecuteTemplate(w, "header", struct {
		Title          string
		DisplayEntries template.JS
	}{
		Title:          r.URL.Path,
		DisplayEntries: template.JS(displayEntries),
	})
}
