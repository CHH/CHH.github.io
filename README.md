# christophh.net

This is the Jekyll site which powers <christophh.net>. Feel free to extend and
remix. Make sure to remove the Typekit tag in the layout's header and please use
your own images for the sidebar. And make sure to replace my avatar
with yours. And remove the keybase verification files with your own, or remove
them please.

## How to remix for yourself

* Make sure you add your own webfonts to the `<head>` tag in
  `_layouts/default.html` and `_layouts/stripped_down.html`. You can change the
  font stacks in `css/variables.less`. Recompile your LESS.
* You should be able to change the colors in `css/variables.less`. Then
  recompile your LESS.
* Either remove or modify `.well-known/keybase.txt` and `keybase.txt` to have your keybase public key
* Replace the avatar in the sidebar with yours by replacing the URL of the `img`
  element.
* Replace the title tag, tag line, site title for mobile, feed title all in the
  layout.
* Modify the navigation in `_config.yml`
* Add your own sidebar images. By default it looks for `hero1.jpg`, `hero2.jpg`
  and `hero3.jpg` in the `images/` directory. You can change this in the
  JavaScript code which loads the images in the default layout, or add your own
  images with the same names.
* Add your own favicons please. See the `images/` directory and the head section
  of the layouts.
* When hosting on Github pages, then change the `CNAME` file to your domain
* __Please add your own icons__, you can add
  [FontAwesome](http://fontawesome.io) and get the icons directly from their
  CDN. But please don't use the Symbolset icons from my S3. You don't have a
  license.

## License

### Content

* Content is everything in `_posts` and `_drafts`, and also the copy in HTML files (but not the HTML structure).
* All content is licensed under [Creative Commons](http://creativecommons.org/licenses/by/3.0/) with Attribution.

### Code

All code, including the HTML templates (but not the copy in there), is licensed under the MIT License included in `LICENSE.txt`.
