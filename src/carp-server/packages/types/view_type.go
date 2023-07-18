package types

type ViewType string

const (
	ViewTypeAll        ViewType = "all"
	ViewTypeImageVideo ViewType = "imagevideo"
	ViewTypeMusic      ViewType = "music"
)

func (v ViewType) String() string {
	return string(v)
}
