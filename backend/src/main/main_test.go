package main

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func TestShareFolderAndBrowserNavigation(t *testing.T) {
	rootDir = t.TempDir()
	frontendDistDir = t.TempDir()
	if err := os.WriteFile(filepath.Join(rootDir, "note.txt"), []byte("shared file"), 0600); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(filepath.Join(rootDir, "index.html"), []byte("shared index"), 0600); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(filepath.Join(frontendDistDir, "index.html"), []byte("<html>Carp app</html>"), 0600); err != nil {
		t.Fatal(err)
	}
	if err := os.Mkdir(filepath.Join(frontendDistDir, "assets"), 0700); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(filepath.Join(frontendDistDir, "assets", "app.js"), []byte("console.log('Carp')"), 0600); err != nil {
		t.Fatal(err)
	}

	handler := newHTTPHandler()

	for _, tc := range []struct {
		path, accept, contentType, bodyContains string
		status                                  int
	}{
		{"/", "text/html", "text/html", "Carp app", http.StatusOK},
		{"/assets/app.js", "*/*", "javascript", "console.log('Carp')", http.StatusOK},
		{"/~/", "text/html", "text/html", "Carp app", http.StatusOK},
		{"/~/", "*/*", "application/json", "", http.StatusOK},
		{"/~/note.txt", "*/*", "text/plain", "shared file", http.StatusOK},
		{"/~/missing.txt", "*/*", "text/plain", "", http.StatusNotFound},
	} {
		req := httptest.NewRequest(http.MethodGet, tc.path, nil)
		req.Header.Set("Accept", tc.accept)
		res := httptest.NewRecorder()
		handler.ServeHTTP(res, req)
		if res.Code != tc.status {
			t.Errorf("%s (%s): status %d, want %d", tc.path, tc.accept, res.Code, tc.status)
		}
		if got := res.Header().Get("Content-Type"); !strings.Contains(got, tc.contentType) {
			t.Errorf("%s (%s): content type %q", tc.path, tc.accept, got)
		}
		if tc.bodyContains != "" && !strings.Contains(res.Body.String(), tc.bodyContains) {
			t.Errorf("%s (%s): body %q does not contain %q", tc.path, tc.accept, res.Body.String(), tc.bodyContains)
		}
		if tc.path == "/~/" && tc.accept == "*/*" {
			var listing struct {
				DisplayItems struct {
					Data []struct {
						Name string `json:"name"`
					}
				} `json:"displayItems"`
			}
			if err := json.Unmarshal(res.Body.Bytes(), &listing); err != nil {
				t.Fatal(err)
			}
			if len(listing.DisplayItems.Data) != 2 || listing.DisplayItems.Data[0].Name != "index.html" || listing.DisplayItems.Data[1].Name != "note.txt" {
				t.Fatalf("unexpected listing: %s", res.Body.String())
			}
		}
	}
}
