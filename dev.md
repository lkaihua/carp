### MVP

[X] To navigate folders and open files
[x] To have a breadcrumb navigation bar
[x] To abbreviate very long folder/file name smartly
[x] To dynamically load images to preview 
[ ] To highlight video or image files in current folder

### Nice to have
[ ] To have a config yaml.
[ ] To highlight the previous folder after navigation to upper folder. 
[ ] To generate thumbnails when entering a gallery folder

### Work log

##### 2022-02-15

- Extract fs.go from Go's offical `http` in order to customize file / dir display.

#### 2022-03-01

- Add detection for folder, image, video files.

#### 2022-03-03

- Add serving static assets style/js/icons.
- Integrate Bootstrap css and icons.

#### 2022-03-08

- Add lazyload for images in vanilla JS, only load images in the current and the next viewport. 
- Add a url query `entryType` to highlight file types in current folder.
[ ] Plans to keep query between page jumps.

### features

[ ] A web-based local admin panel and a remote rich media browser.

[ ] Simple password protection.

[ ] Prompt to get user's confirmation to generate thumbnails of images/vidoes
1. To resize image to a thumbnail
1. https://github.com/xfrr/goffmpeg to extract first frame of video

[ ] Show a progress of above progress