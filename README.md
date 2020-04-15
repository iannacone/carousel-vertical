# carousel-vertical

## THIS PROJECT IS ABBANDONED. DO YOURSELF A FAVOR AND SWITCH TO [tiny-slider](https://github.com/ganlanyuan/tiny-slider)

jQuery plugin for creating carousel sliders. Inspired to Owl Carousel 2, but it works vertically

## Install

Put the required stylesheet at the top of your markup:

```html
<link rel="stylesheet" type="text/css" href="../dist/carousel-vertical.min.css" media="screen" />
```

Put the script at the bottom of your markup right after jQuery:

```html
<script type="text/javascript" src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
<script type="text/javascript" src="../dist/jquery.carousel-vertical.min.js"></script>
```

## Usage

Wrap your items (div, a, img, span, li etc.) with a container element (div, ul etc.). Only the class cv-carousel is mandatory to apply proper styles:

```html
<div class="cv-carousel">
    <div class="item">Your Content</div>
    <div class="item">Your Content</div>
    <div class="item">Your Content</div>
    <div class="item">Your Content</div>
    <div class="item">Your Content</div>
</div>
```

Call the plugin function and your carousel is ready.

```javascript
$(document).ready(function(){
    $('.cv-carousel').carouselVertical();
});
```

## Options

Option    | Type              | Default          | Purpose
--------- |-------------------|------------------|--------------------------------------------------------
`items`   | int (>0)          | 4                | Number of slides being displayed in the viewport.
`margin`  | int (>0)          | 10               | margin (px) between each item.
`nav`     | bool              | true             | Show or hide prev/next buttons.
`navText` | array of strings  | ['prev', 'next'] | The text inside the prev/next buttons. HTML allowed.

## Methods

For programmatically moving the carousel you can use this:

```javascript
$('.cv-carousel').trigger('goTo', [5]);
```

or this:

```javascript
$('.cv-carousel').carouselVertical().trigger('goTo', [5]);
```

## License

The plugin is released under the [MIT license](https://github.com/iannacone/carousel-vertical/blob/master/LICENSE).
