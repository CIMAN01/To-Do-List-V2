// local custom date module 

// export the module's getDate anonymous function (module.exports.getDate = ...)
exports.getDate = function () { // same as var getDate = function () => ...
    // create a new date
    const today = new Date();
    // options for our toLocaleDateString() method below
    const options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };
    // return day (date with US formatting)
    return today.toLocaleDateString("en-US", options);
}

// export the module's getDay anonymous function
exports.getDay = function () {
    // create a new date
    const today = new Date();
    // options for our toLocaleDateString() method
    const options = {
        weekday: "long",
    }; 
    // return the current day only
    return today.toLocaleDateString("en-US", options);
}