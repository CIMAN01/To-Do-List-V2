// ToDoList V2


// create a listening port
const port = 3000;
// load https package
const https = require("https");
// require express module
const express = require("express");
// get path
const { dirname } = require("path");
// get mongoose package
const mongoose = require("mongoose");
// require lodash package
const _ = require("lodash");
// import local date module 
const date = require(__dirname + "/date.js")


// create an application that uses express
const app = express();


// parse the URL-encoded body of a POST request
app.use(express.urlencoded({extended: true})); 
// give express app (server) access to local static files (css/images) 
app.use(express.static("public")); // public is name of the static folder
// view engine setup (assumes a views folder with an index.ejs file)
app.set("view engine", "ejs");


// create a new database inside mongoDB 

// connect to url where mongoDB is hosted locally
mongoose.connect("mongodb://localhost:27017/todolistDB",  
                    {useNewUrlParser: true, useUnifiedTopology: true}); 

// create a new mongoose Schema for items
const itemsSchema = { 
    name: String
};

// create a new mongoose Model for items
const Item = mongoose.model("Item", itemsSchema);


// create a new mongoose Document for items
const item1 = new Item({
    name: "Welcome to your todolist!"
});
// create another mongoose Document for items
const item2 = new Item({
    name: "Click on the new + button to add a new item."
});
// create another mongoose Document for items
const item3 = new Item({
    name: "Click on the checkbox to delete an existing item."
});

// create an array (a starting collection of items)
const defaultItems = [item1, item2, item3];

// create a Schema (for custom lists using dynamic routing)
const listSchema = {
    name: String, // every new list created will include a name
    // every new list created will have an array of item documents
    items: [itemsSchema] // items array
};

// create a mongoose Model (for custom lists using dynamic routing)
const List = mongoose.model("List", listSchema);


// retrieve the current day from the date module's function
const today = date.getDay(); // call getDay() from date.js 


// a GET request for home route (first time homepage is loaded app.get() gets called)
app.get("/", function(req, res) { // any re-directs will also trigger app.get()
    
    // find all items in items Collection
    Item.find({}, function(err, foundItems){
        // if array (collection of items) is empty
        if(foundItems.length === 0) {
            // insert existing items/documents into items Collection
            Item.insertMany(defaultItems, function(err) {
                // handle any errors
                if(err) {
                    console.log(err);
                }
                else {
                    console.log("Successfully saved default items to DB.")
                }
            });
            // to render the added items we redirect to home route
            res.redirect("/"); // reruns app.get("/") to reach the else statement below
        }
        // if array (collection of items) is not empty
        else {
            // render the database items
            res.render("list", {listTitle: today, newListItems: foundItems});
        }
    });

});


// GET request for dynamic routes (i.e. localhost:3000/Work)
app.get("/:customDomainName", function(req, res) { 
    // create a custom route (list) and use lodash to add consistent casing for names
    const customListName = _.capitalize(req.params.customDomainName); // use Lodash
    // find or look for only one Document 
    List.findOne({name: customListName}, function(err, foundList) { // object
        // check for error
        if(!err) {
            // if a list is not found
            if(!foundList) {
                // create a new list (Document)
                const list = new List({
                    name: customListName,
                    items: defaultItems
                });
                // save lists into lists collection
                list.save(); // mongoose shortcut
                res.redirect("/" + customListName); // redirect to render results
            }
            else {
                // show an existing list 
                res.render("list", {listTitle: foundList.name, newListItems: foundList.items});
            }
        }
    });
});


// POST request - receives data and send it to the home route
app.post("/", function(req, res) {
    // access and store pieces of data that the user enters in the form (list.ejs)
    const itemName = req.body.newItem; // line 25 in list.ejs 
    const listName = req.body.list; // line 27 in list.ejs
    
    // create a new item Document
    const item = new Item({
        name: itemName
    });
    // if it's the main list (homepage)
    if (listName === today) { // if the list/route matches the day of the week
        // save item to collection of items (database) 
        item.save(); // mongoose shortcut
        // redirect to home route in order to render the saved item
        res.redirect("/");
    } 
    // if it's a custom list
    else {
        // look for the list and list items
        List.findOne({name: listName}, function(err, foundList) {
            foundList.items.push(item); // add items to array
            foundList.save(); // save the list
            res.redirect("/" + listName); // dynamic re-routing   
        });
    }  
});


// POST request - receives data and send it to the delete route
app.post("/delete", function(req, res) {
    // access and store list.ejs elements   
    const checkedItemId = req.body.checkedItem; // line 16 in list.ejs
    const listName = req.body.listName; // line 20 in list.ejs
    // if an item is being removed from the main list page (http://localhost:3000/)
    if (listName === today) { // if list/route matches the day of the week
        // find and remove items by id - note: a callback required to perform deletion
        Item.findByIdAndRemove(checkedItemId, function(err) { 
            // handle errors
            if (!err) {
            // log a message
            console.log("Successfully deleted checked item.");
             // redirect to home route to render the changes made 
            res.redirect("/");
            }
        });
    } 
    // or if an item is being removed from a custom list page (i.e. http://localhost:3000/Work) 
    else {
        // find and update an item by id - use $pull operator (mongoDB) to remove item from array
        // <ModelName>.findOneAndUpdate({conditions}, {updates}, callback(err, results){});
        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, function(err, foundList) {
            // handle errors    
            if (!err) {
            // redirect to custom route (dynamic routing) to render the changes made
            res.redirect("/" + listName);
            }
        });
    }
});


// (Heroku dynamic port || local static port)
app.listen(process.env.PORT || port, function() {
    console.log("Server is running on port 3000")
});
