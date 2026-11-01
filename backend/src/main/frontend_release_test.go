//go:build carp_release

package main

import (
	"io/fs"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/lkaihua/carp/src/packages/frontend"
)

func TestEmbeddedFrontend(t *testing.T) {
	previous := frontendDistDir
	frontendDistDir = ""
	t.Cleanup(func() { frontendDistDir = previous })

	appFiles := frontend.Files()
	if appFiles == nil {
		t.Fatal("release build has no embedded frontend")
	}
	index, err := fs.ReadFile(appFiles, "index.html")
	if err != nil || !strings.Contains(string(index), "<html") {
		t.Fatalf("embedded index.html: %v", err)
	}

	handler := newHTTPHandler()
	for _, route := range []string{"/", "/~/", "/~/index.html"} {
		res := httptest.NewRecorder()
		handler.ServeHTTP(res, httptest.NewRequest(http.MethodGet, route, nil))
		if res.Code != http.StatusOK || !strings.Contains(res.Body.String(), "<html") {
			t.Errorf("%s: status %d, body %q", route, res.Code, res.Body.String())
		}
	}
}
