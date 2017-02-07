# book-logger
Project created during the course "AngularJS Services In-depth" on Pluralsight.

Description of the course:
Services are a major piece of every AngularJS application and will likely make up the majority of the code you write in your own apps. Creating your own services requires understanding the different types of services and how and why to use each of them. The framework also provides lots of built-in services that can help you manage network requests, asynchronous execution, routing, and much more. Taking full advantage of that functionality requires a deep understanding of what is possible and how to use it to fit your particular situation. This course will teach you all of these things so you can build great applications with Google's popular framework.

Project short description:
Be able to log the books you read and for how long you read them.

After finishing the course I continued working on the project until it was complete and I added a rest server using node, express and mongodb.

Users features:
- are able to register/login
- add books to the total book collection
- log the books they read and for how long they read them
- set books as favorites
- delete books from favorites and read books collection
- update profile

Admins (additional features):
- view all users
- edit books
- delete books from total book collection

SETUP
- Pull repository
- From the command line execute "npm install"
- Make sure mongodb is running
- Create a database "bookLogger"
- Import the collections in the folder db
- From the command line execute "npm start"
- You can access the app through http://localhost:3000/src
- You can log in as an admin using username: 'dsmdean'. When logged in as an admin you can view all users and log in as them. The passwords for all of the users is 'adminroot'
