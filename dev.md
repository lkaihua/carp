### MVP

- [x] To navigate folders and open files
- [x] To have a breadcrumb navigation bar
- [x] To abbreviate very long folder/file name smartly
- [x] To dynamically load images to preview 
- [x] To highlight certain category of files in current folder

### Nice to have
- [x] A mp3 player
  - [x] Loop play.
  - [x] Skip to next song when Media source could not be decoded. 
  - [ ] Stop playing when all songs are not playable.
  - [x] Highlight the current playing track.
- [ ] To highlight the last selected file or visited folder. 
- [ ] To have a config yaml.
- [ ] To highlight the previous folder after navigation to upper folder. 
- [ ] To generate thumbnails when entering a gallery folder 
- [ ] A web-based local admin panel and a remote rich media browser.
- [ ] Simple password protection.
- [ ] Prompt to get Admin's confirmation to generate thumbnails of images/vidoes. This sounds unsafe, write operation from html access. 
    1. To resize image to a thumbnail
    2. https://github.com/xfrr/goffmpeg to extract first frame of video
    3. Show a progress of above progress
- [ ] Add a file size sorting option. For now files are sorted with newest modification time to oldest. 
- [ ] Display file info in preview modal, such as Modification Time and File Size.

### Work log

#### 2022-03-21

- Finalize image and video preview modal. Refactor navigation buttons so the button has an elegant blink effect when clicked. Rfactor the `video` layout.

#### 2022-03-20

- Integrate css3 vinyl record player.
- Automatically select the best category based on file types in current folder, for instance if most of the files are `mp3`, the view will be in `Music` category rather than `All`
- The player is sticky to the bottom in `Music` view, and when the player list is empty the player is not sticky and stays above the `Other Files` section.
  
  ![docs/images/2022-03-20-music-player.png](docs/images/2022-03-20-music-player.png)

#### 2022-03-17

- Update the Preview Modal.
- Finish view of music player. Playing track is highlighted in the list. Change the player position to bottom fix.

  ![docs/images/2022-03-17-music-player-ios.png](docs/images/2022-03-17-music-player-ios.png)
#### 2022-03-16

- Refactor template modules. 
- Update category selector and default list view UI. 
- Init the music player view.
  
  ![docs/images/2022-03-16-music-player.png](docs/images/2022-03-16-music-player.png)


#### 2022-03-15

- Fix video play `.mov` issue. Fix the `video` overflow issue, and improve preview modal UI.
- Now the preview modal has `Prev` and `Next` navigation buttons. 
- Add a chekced-grid background for illustrating image file transparency.

#### 2022-03-14

- Add the preview modal for images and videos in the default view and in the image video view.

| Image Video view  | Preview modal for image | Preview modal for video |
| ------------- | ------------- | ------------- |
| ![docs/images/2022-03-14-image-video.png](docs/images/2022-03-14-image-video.png)  | ![docs/images/2022-03-14-image-video-preview-modal.png](docs/images/2022-03-14-image-video-preview-modal.png) | ![docs/images/2022-03-14-video-preview-mobile.png](docs/images/2022-03-14-video-preview-mobile.png)  | 



#### 2022-03-13

- Add an `Image & Video` view, in a Instagram style grid layout.
- Update category selector. 
  - Add Js script to remove class name from body when onload finishes, so the animation/transition will be smooth, and serves as a indicator for fully interacitve page.
  - Use background image css trink to have a multi-color gradient visual effect.

#### 2022-03-09

- Find an elegant approach to make sure each breadcrumb pills hold a stable width between folder jumps. The trailing pill in each row fulfills the space to the row end. 
- Add the category filters, now there are "All", "Image & Video", "Music" three filters for users to click. 

![docs/images/2022-03-09-breadcrumb.png](docs/images/2022-03-09-breadcrumb.png)


#### 2022-03-08

- Add lazyload for images in vanilla JS, only load images in the current and the next viewport. 
- Add a url query `entryType` to highlight file types in current folder.

#### 2022-03-03

- Add serving static assets style/js/icons.
- Integrate Bootstrap css and icons.

#### 2022-03-01

- Add detection for folder, image, video files.

##### 2022-02-15

- Extract fs.go from Go's offical `http` in order to customize file / dir display.




