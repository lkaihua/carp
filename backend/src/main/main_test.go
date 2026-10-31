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
	if err := os.Mkdir(filepath.Join(rootDir, "photos"), 0700); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(filepath.Join(rootDir, "photos", "cat.txt"), []byte("nested file"), 0600); err != nil {
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
		{"/~/", "*/*", "text/html", "Carp app", http.StatusOK},
		{"/~/photos/", "*/*", "text/html", "Carp app", http.StatusOK},
		{"/~/index.html", "*/*", "text/html", "Carp app", http.StatusOK},
		{"/api/share/", "text/html", "application/json", "", http.StatusOK},
		{"/api/share/photos/", "text/html", "application/json", "", http.StatusOK},
		{"/api/share/note.txt", "*/*", "text/plain", "shared file", http.StatusOK},
		{"/api/share/index.html", "*/*", "text/html", "shared index", http.StatusOK},
		{"/api/share/photos/cat.txt", "*/*", "text/plain", "nested file", http.StatusOK},
		{"/api/share/missing.txt", "*/*", "text/plain", "", http.StatusNotFound},
		{"/api/info/", "*/*", "application/json", "localFolder", http.StatusOK},
		{"/api/qr/?url=http%3A%2F%2Fexample.com", "*/*", "image/png", "", http.StatusOK},
		{"/api/qr/", "*/*", "text/plain", "Missing 'url'", http.StatusBadRequest},
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
		if tc.path == "/api/share/" || tc.path == "/api/share/photos/" {
			var listing struct {
				DisplayItems struct {
					Data []struct {
						Name        string `json:"name"`
						RelativeURL string `json:"relativeUrl"`
						FullURL     string `json:"fullUrl"`
					} `json:"data"`
				} `json:"displayItems"`
			}
			if err := json.Unmarshal(res.Body.Bytes(), &listing); err != nil {
				t.Fatal(err)
			}
			if tc.path == "/api/share/" && (len(listing.DisplayItems.Data) != 3 ||
				listing.DisplayItems.Data[0].Name != "index.html" ||
				listing.DisplayItems.Data[1].Name != "note.txt" ||
				listing.DisplayItems.Data[2].RelativeURL != "/~/photos/" ||
				listing.DisplayItems.Data[2].FullURL != "http://example.com/api/share/photos/") {
				t.Fatalf("unexpected root listing: %s", res.Body.String())
			}
			if tc.path == "/api/share/photos/" && (len(listing.DisplayItems.Data) != 1 ||
				listing.DisplayItems.Data[0].RelativeURL != "/~/photos/cat.txt" ||
				listing.DisplayItems.Data[0].FullURL != "http://example.com/api/share/photos/cat.txt") {
				t.Fatalf("unexpected nested listing: %s", res.Body.String())
			}
		}
	}

	// Go redirects requests without the canonical trailing slash.
	for _, route := range []string{"/api/share", "/api/info", "/api/qr"} {
		res := httptest.NewRecorder()
		handler.ServeHTTP(res, httptest.NewRequest(http.MethodGet, route, nil))
		if res.Code != http.StatusMovedPermanently || res.Header().Get("Location") != route+"/" {
			t.Errorf("%s: redirect status %d, location %q", route, res.Code, res.Header().Get("Location"))
		}
	}
}
