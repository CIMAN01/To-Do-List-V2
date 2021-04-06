# To-Do-List-V2

Description:

A more advanced to-do-list based on the prvious todolist project (refer to To-Do-List-V1) that now uses a database (MongoDB/Mongoose) to actually store the entire list (including items) when the page gets refreshed. 

In addition, the local server now allows for dynamic routing in order to be able to create multiple custom lists that allows a user to add and remove items that then is stored in the local database. 

Lodash has also been implemented in order to avoid creating multiple lists that may occur when the same name is entered with a different casing.


Instructions:

The "node_modules" folder is incomplete and in order to make the project run, all the modules left out would need to be downloaded by using the command 'npm install' in the command line (i.e. Hyper). This will install all the neccessary modules specified by package.json file. 

Once all the files are in place, you would need to run mongoBD (by simply entering 'mongod' in hyper in a separate tab), and then run 'nodemon app.js' (or just 'node app.js') to start the server on port 3000. Finally the last step is to just open up your browser and enter 'localhost:3000/' in the address bar and hit enter. From there you can add or remove items by following the instructions onscreen.

Screenshot:

![screenshot](https://user-images.githubusercontent.com/34729011/113780729-771c8600-96e4-11eb-9160-b5fd7132da4f.png)
