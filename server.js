/*********************************************************************************
*  WEB322 – Assignment 04
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: __Tejasavi____________________ Student ID: _____174401216_________ Date: _July 01,2023______________
*
*  Online (Cyclic) Link: _https://jade-breakable-viper.cyclic.app/_______________________________________________________
*
********************************************************************************/ 
var express = require("express");
const path = require ("path");
const data = require("./store-service");
const cloudinary = require('./config');
const multer = require('multer');
const upload = multer();
const streamifier = require('streamifier');
const exphbs = require('express-handlebars');


var app = express();
var HTTP_PORT = process.env.PORT || 8080;

const app = express();
const HTTP_PORT = process.env.PORT || 8080;

// call this function after the http server starts listening for requests
app.use(express.static('public'));
function onHTTPSTART() {
    console.log("Express http server listening on: " + HTTP_PORT);
  }
  app.use(function(req,res,next){
    let route = req.path.substring(1);
    app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));
    app.locals.viewingCategory = req.query.category;
    next();
});


app.get("/", (req, res) => {
  res.render('about');
});

app.engine('hbs', exphbs.engine({ extname: '.hbs' }));
app.set('view engine', 'hbs');

app.use(express.static('public'));

app.get("/", (req, res) => {
  res.render('about');
});
app.get("/about", (req,res) =>{
  res.redirect('about');
});
  
  app.get("/items",(req,res)=>{
         store.getAllItems().then((data)=>{
          res.json(data);
         })
  })
  app.use((req,res)=>{
    res.status(404).send("Page does not exist, coming soon!!!");

  });

  app.get("/items/add", (req,res)=>{
    res.render('addItem');
    });
    app.post('/items/add', upload.single('featureImage'), (req, res)=>{

    });
    
    app.listen(HTTP_PORT, () => {
      console.log("Express http sever listening on: " + HTTP_PORT);

    });

 // app.listen(HTTP_PORT, onHTTPSTART);
 data.initialize().then(function(){
  app.listen(HTTP_PORT, onHTTPSTART);
 }).catch(function(err){
  console.log("Unable to start server:"   + err);
 })
 app.post('/items/add', upload.single('featureImage'), (req, res) => {
  if (req.file) {
    let streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        });

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    async function upload(req) {
      try {
        let result = await streamUpload(req);
        console.log(result);
        return result;
      } catch (error) {
        console.error(error);
        return null;
      }
    }

    upload(req)
      .then((uploaded) => {
        processItem(uploaded.url);
      })
      .catch((error) => {
        console.error(error);
        processItem("");
      });
  } else {
    processItem("");
  }
  function addItem(itemData) {
    return new Promise((resolve, reject) => {
      if (itemData.published === undefined) {
        itemData.published = false;
      } else {
        itemData.published = true;
      }
  
      itemData.id = items.length + 1;
      items.push(itemData);
  
      resolve(itemData);
    });
  }
  
app.get('/items', (req, res) => {
  const category = req.query.category;
  const minDate = req.query.minDate;

  if (category) {
    // Filter items by category
    const itemsByCategory = getItemsByCategory(category);
    res.json(itemsByCategory);
  } else if (minDate) {
    // Filter items by minimum date
    const itemsByMinDate = getItemsByMinDate(minDate);
    res.json(itemsByMinDate);
  } else {
    // Return all items without any filter
    res.json(getAllItems());
  }
});
app.get('/item/:id', (req, res) => {
  const itemId = req.params.id;
  const item = getItemById(itemId);

  if (item) {
    res.render(item);
  } else {
    res.status(404).render({ error: 'Item not found' });
  }
});
 })
 const exphbs = require('express-handlebars');
const hbs = exphbs.create({});

hbs.handlebars.registerHelper('navLink', function(url, options) {
    const activeRoute = options.data.root.activeRoute;
    const isActive = (activeRoute === url) ? 'active' : '';
    hbs.handlebars.registerHelper('equals', function(lvalue, rvalue, options) {
      if (arguments.length < 3)
          throw new Error("Handlebars Helper equal needs 2 parameters");
      if (lvalue != rvalue) {
          return options.inverse(this);
      } else {
          return options.fn(this);
      }
  });

  app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
})
app.get("/shop", async (req, res) => {
  // Declare an object to store properties for the view
  let viewData = {};

  try {
    // declare empty array to hold "post" objects
    let items = [];

    // if there's a "category" query, filter the returned posts by category
    if (req.query.category) {
      // Obtain the published "posts" by category
      items = await itemData.getPublishedItemsByCategory(req.query.category);
    } else {
      // Obtain the published "items"
      items = await itemData.getPublishedItems();
    }

    // sort the published items by postDate
    items.sort((a, b) => new Date(b.postDate) - new Date(a.postDate));

    // get the latest post from the front of the list (element 0)
    let post = items[0];

    // store the "items" and "post" data in the viewData object (to be passed to the view)
    viewData.items = items;
    viewData.item = item;
  } catch (err) {
    viewData.message = "no results";
  }

  try {
    // Obtain the full list of "categories"
    let categories = await itemData.getCategories();

    // store the "categories" data in the viewData object (to be passed to the view)
    viewData.categories = categories;
  } catch (err) {
    viewData.categoriesMessage = "no results";
  }

  // render the "shop" view with all of the data (viewData)
  res.render("shop", { data: viewData });
});