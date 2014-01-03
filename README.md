Flickerplate
=========

A cool jQuery plugin that lets you flick through content.


Getting Started
=========

Requires jQuery, Modernizr (touch check) and jQuery.Finger (supplied with Flickerplate already).

Compile "sass/flickerplate.scss" as part of your project or just include "css/flickerplate.css" in your head tag. You will also need to include "js/flickerplate.js" with a minified version supplied in the "js/min" directory.

Below is an example:

```
<head>
    <link href="css/flickerplate.css"  type="text/css" rel="stylesheet">
    <script src="js/min/flickerplate.min.js" type="text/javascript"></script>
</head>
```

Once included, create the neccessary HTML and call Flickerplate by referencing the containing class in your javascript file.

Javascript call:

```
$(document).ready(function(){
	$('.flicker-example').flicker();
});
```

Basic HTML:

```
<div class="flicker-example">
	<ul>
		<li>
			<div class="flick-title">Title 1</div>
			<div class="flick-sub-text">Description text 1</div>
		</li>
		<li>
			<div class="flick-title">Title 2</div>
			<div class="flick-sub-text">Description text 2</div>
		</li>
		<li>
			<div class="flick-title">Title 3</div>
			<div class="flick-sub-text">Description text 3</div>
		</li>
	</ul>
</div>
```


Documentation
=========

For a more detailed explanation read the online documentation at http://getwebplate.com/plugins/flickerplate.


Copyright and License
=========

Copyright 2014 Savedge Project

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
