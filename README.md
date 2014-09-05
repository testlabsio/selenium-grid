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

## Known issues

There is an issue using the TestLabs Grid with PhantomJS - unfortunately HTTP headers sent to GhostDriver are expected with a specific case - e.g. Content-Type as opposed to content-type. The frameworks we use with node.js send headers lowercased (which is correct as per the HTTP spec). We will be opening a pull request to fix this issue.
