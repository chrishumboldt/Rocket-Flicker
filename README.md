Flickerplate
=========

A cool jQuery plugin that lets you flick through content.


Getting Started
=========

Requires jQuery and Modernizr (touch check)

Compile "sass/flickerplate.scss" as part of your project or just include "css/flickerplate.css" in your head tag. You will also need to include "js/flickerplate.js" with a minified version supplied in the "js/min" directory.

Below is an example:

```
<head>
    <link href="css/flickerplate.css"  type="text/css" rel="stylesheet">
    <script src="js/min/flickerplate.min.js" type="text/javascript"></script>
</head>
```

Once included you can call Flickerplate simply by referencing a class in your javascript file.

For example:

```
$(document).ready(function(){
		
	$('.flicker-example').flicker();
});
```


Documentation
=========

For a more detailed explanation read the online documentation at http://getwebplate.com/plugins/flickerplate.


Copyright and license
=========

Copyright 2013 Webplate Project

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
