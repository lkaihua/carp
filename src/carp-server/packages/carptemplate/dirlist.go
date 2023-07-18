package carptemplate

// import (
// 	"log"
// 	"net/http"
// 	"path/filepath"

// 	"github.com/lkaihua/carp/src/carp-server/packages/types"
// )

// func Dirlist(w http.ResponseWriter) {
// 	templates := []string{
// 		filepath.Join("src", "templates", "footer.html"),
// 	}
// 	parsedTemplate, err := NewTemplate().ParseFiles(templates...)
// 	if err != nil {
// 		// Log the detailed error
// 		log.Println("[Footer] template parse error:" + err.Error())
// 		// Return a generic "Internal Server Error" message
// 		http.Error(w, http.StatusText(500), 500)
// 		return
// 	}

// 	err = parsedTemplate.ExecuteTemplate(w, "footer", nil)
// 	if err != nil {
// 		log.Println(err.Error())
// 		http.Error(w, http.StatusText(500), 500)
// 	}

// }
