# TestLabs Grid

This is a basic re-implementation of the Selenium Grid in node.js.

Please take a look at the code, feel free to fork it, modify it and use it for whatever you like - and we always
appreciate issue reports and pull requests!

## Why?

We did this primarily to allow us to scale the grid easily and efficiently - the core implementation for example reads
all responses in to memory before relaying them back to your code.

## Usage

You can start the grid by running `node grid.js`. By default it will start listening on port 3000.

Access to an admin section is available at http://localhost:3000/admin with the username and password admin/password.

When writing Selenium tests you use RemoteWebDriver in the same way as you would with the Java Selenium grid.

You can reconfigure some basics by modifying config/{environment}.js and then running the grid with
`NODE_ENV={environment} node grid.js`

## License 

(The MIT License)

Copyright (c) 2015 TestLabs.io &lt;hi@testlabs.io&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
