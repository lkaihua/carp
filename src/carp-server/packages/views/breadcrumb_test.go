package views

import (
	"strings"
	"testing"

	"github.com/google/go-cmp/cmp"
)

type testCase struct {
	input    string
	expected []string
}

var testCases = []testCase{
	{input: "/a/b/", expected: []string{"/", "/a/", "/a/b/"}},
	{input: "/a/b/c.png", expected: []string{"/", "/a/", "/a/b/"}},
	{input: "/a/b/c.torrent", expected: []string{"/", "/a/", "/a/b/"}},
	{input: "/a/b/c", expected: []string{"/", "/a/", "/a/b/"}},
	{input: "/", expected: []string{"/"}},
	{input: "/a//b/", expected: []string{"/", "/a/", "/a/b/"}},
}

func TestBreadcrumb(t *testing.T) {

	for _, testCase := range testCases {
		res := []string{}
		for _, breadcrumbLevel := range Breadcrumb(testCase.input) {
			res = append(res, breadcrumbLevel.UrlString)
		}
		if cmp.Equal(res, testCase.expected) == false {
			t.Errorf("Breadcrumb does not return correct path, got:[%s], wanted:[%s]",
				strings.Join(res, ","), strings.Join(testCase.expected, ","),
			)
		}
	}

}
