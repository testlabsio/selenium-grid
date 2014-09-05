# TestLabs Grid

This is a basic re-implementation of the Selenium Grid in node.js. We did this primarily to allow us to scale the grid
easily and efficiently - the core implementation for example reads all responses in to memory before relaying them back
to your code.

You can start the grid by running `node grid.js`.  By default it will start listening on port 3000.

Access to an admin section is available at http://localhost:3000/admin with the username and password admin/password.

Please take a look at the code, feel free to fork it, modify it and use it for whatever you like - and we always
appreciate issue reports and pull requests!
