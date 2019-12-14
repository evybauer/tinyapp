# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

## Final Product

!["Screenshot of URLs page"](https://github.com/evybauer/tinyapp/blob/master/docs/urls-page.png?raw=true)
!["Screenshot of Register page"](https://github.com/evybauer/tinyapp/blob/master/docs/register-page.png?raw=true)
!["Screenshot of Login page"](https://github.com/evybauer/tinyapp/blob/master/docs/login-page.png?raw=true)
!["Screenshot of Create New URL page"](https://github.com/evybauer/tinyapp/blob/master/docs/new_url-page.png?raw=true)
!["Screenshot of Edit URL page"](https://github.com/evybauer/tinyapp/blob/master/docs/edit_url-page.png?raw=true)

## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.
- To access the shortened URLs page or create shortened URLs you will have to register a valid email and password
- To create short URLs, access the link Create New URL (make sure you're logged in)
- To acces all the URLs created, access the link My URLs (make sure you're logged in)
- To edit or delete shortened URLs, acces the buttons 'Edit' or 'Delete' that are available on My URLs page (make sure you're logged in)
- To logout from your account, press the button 'Logout' (The button appears on the navbar as soon as you log in)