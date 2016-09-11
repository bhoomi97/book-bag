# book-bag
## Book Bag Web App Features:

  * Upload your product without signing up.
  * Browse through the full collection.
  * Browse by:
      - graduation year
      - username
  * __Sign Up Advantages:__
    - Mark products as Sold/Available
    - Edit product info anytime.
    - Delete products that are sold

#### How To Setup Application:

  1. Clone project on your computer.
  2. Install ``` node.js ``` from https://nodejs.org/en/
  3. From the terminal, navigate to the project folder and run:

    npm install

  4. Install ```MongoDB``` from https://www.mongodb.com/download-center
  5. From the terminal, navigate to the folder where you installed the mongoDB files.
  6. To start mongo server, go inside the ``` bin ``` directory, & run:

    mongod --dbpath path/to/where/you/want/to/save/data

   Mac OSX users run:

    ./mongod --dbpath path/to/save/data

  7. ``` mongo server ``` is now running.
  8. Open another terminal to start the app.
  9. Navigate to project folder and run ```node app.js ```
  10. App now live on ```localhost:3000```
