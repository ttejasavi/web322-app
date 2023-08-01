/*********************************************************************************
*  WEB322 – Assignment 05
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: __Tejasavi____________________ Student ID: _____174401216_________ Date: _July 15,2023______________
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
const handlebarsHelpers = require('./handlebars-helpers');
const itemData = require("./store-service");
const express = require('express');
const app = express();
const authData = require('./auth-service');
const clientSessions = require('client-sessions');

authData.initialize()
  .then(() => {
    app.listen(3000, () => {
      console.log('Server is running on http://localhost:3000');
    });
  })
  .catch((err) => {
    console.log(err);
  });
  const storeData = require('./store-service');
  const authData = require('./auth-service');
  
  storeData.initialize()
    .then(authData.initialize)
    .then(function () {
      app.listen(HTTP_PORT, function () {
        console.log('app listening on: ' + HTTP_PORT);
      });
    })
    .catch(function (err) {
      console.log('unable to start server: ' + err);
    });


var HTTP_PORT = process.env.PORT || 8080;


app.engine('hbs', exphbs.engine({ extname: '.hbs' }));
app.set('view engine', 'hbs');
app.engine('hbs', exphbs.engine({ extname: '.hbs', helpers: handlebarsHelpers }));

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
app.use(clientSessions({
  cookieName: 'session',
  secret: 'week10example_web322', 
  duration: 2 * 60 * 1000, 
  activeDuration:  60 * 1000, 
}));
app.use(function (req, res, next) {
  res.locals.session = req.session;
  next();
});
function ensureLogin(req, res, next) {
  if (!req.session.userName) {
    res.redirect('/login');
  } else {
    next();
  }
}

app.use(['/items', '/categories', '/post', '/category'], ensureLogin);


  
  app.get("/about", function(req,res){
    res.render("about");
  });
  
  
  app.get('/items', function(req, res) {
    storeService.getAllItems()
      .then((items) => {
        if (items.length > 0) {
          res.render('items', { Items: items });
        } else {
          res.render('items', { message: 'No results' });
        }
      })
      .catch(() => {
        res.render('items', { message: 'Error retrieving items' });
      });
  });
  
  app.get('/categories', function(req, res) {
    storeService.getCategories()
      .then((categories) => {
        if (categories.length > 0) {
          res.render('categories', { Categories: categories });
        } else {
          res.render('categories', { message: 'No results' });
        }
      })
      .catch(() => {
        res.render('categories', { message: 'Error retrieving categories' });
      });
  });
  
  
  app.use((req,res)=>{
    res.status(404).send("Page does not exist, coming soon!!!");

  });

  app.get('/Items/add', function(req, res) {
    storeService.getCategories()
      .then((categories) => {
        res.render('addPost', { categories: categories });
      })
      .catch(() => {
        res.render('addPost', { categories: [] });
      });
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
app.get('/shop/:id', async (req, res) => {

  // Declare an object to store properties for the view
  let viewData = {};

  try{

      // declare empty array to hold "item" objects
      let items = [];

      // if there's a "category" query, filter the returned posts by category
      if(req.query.category){
          // Obtain the published "posts" by category
          items = await itemData.getPublishedItemsByCategory(req.query.category);
      }else{
          // Obtain the published "posts"
          items = await itemData.getPublishedItems();
      }

      // sort the published items by postDate
      items.sort((a,b) => new Date(b.postDate) - new Date(a.postDate));

      // store the "items" and "item" data in the viewData object (to be passed to the view)
      viewData.items = items;

  }catch(err){
      viewData.message = "no results";
  }

  try{
      // Obtain the item by "id"
      viewData.item = await itemData.getItemById(req.params.id);
  }catch(err){
      viewData.message = "no results"; 
  }

  try{
      // Obtain the full list of "categories"
      let categories = await itemData.getCategories();

      // store the "categories" data in the viewData object (to be passed to the view)
      viewData.categories = categories;
  }catch(err){
      viewData.categoriesMessage = "no results"
  }


  res.render("shop", {data: viewData})
});
app.use(express.urlencoded({ extended: true }));

app.get('/categories/add', function(req, res) {
  res.render('addCategory');
});
app.post('/categories/add', function(req, res) {
  const categoryData = {
    category: req.body.category
  };

  storeService.addCategory(categoryData)
    .then(() => {
      res.redirect('/categories');
    })
    .catch(() => {
      res.status(500).send('Unable to create category');
    });
});


app.get('/categories/delete/:id', function(req, res) {
  const categoryId = req.params.id;

  storeService.deleteCategoryById(categoryId)
    .then(() => {
      res.redirect('/categories');
    })
    .catch(() => {
      res.status(500).send('Unable to remove category / Category not found');
    });
});


app.get('/items/delete/:id', function(req, res) {
  const itemId = req.params.id;

  storeService.deletePostById(itemId)
    .then(() => {
      res.redirect('/items');
    })
    .catch(() => {
      res.status(500).send('Unable to remove item / Item not found');
    });
});
app.get('/Items/delete/:id', function(req, res) {
  const postId = req.params.id;

  storeService.deletePostById(postId)
    .then(() => {
      res.redirect('/Items');
    })
    .catch(() => {
      res.status(500).send('Unable to remove post / Post not found');
    });
});
app.get('/login', function (req, res) {
  res.render('login');
});

app.get('/register', function (req, res) {
  res.render('register');
});

app.post('/register', function (req, res) {
  authData.registerUser(req.body)
    .then(() => {
      res.render('register', { successMessage: 'User created' });
    })
    .catch((err) => {
      res.render('register', { errorMessage: err, userName: req.body.userName });
    });
});

app.post('/login', function (req, res) {
  req.body.userAgent = req.get('User-Agent');
  authData.checkUser(req.body)
    .then((user) => {
      req.session.user = {
        userName: user.userName,
        email: user.email,
        loginHistory: user.loginHistory,
      };
      res.redirect('/items');
    })
    .catch((err) => {
      res.render('login', { errorMessage: err, userName: req.body.userName });
    });
});

app.get('/logout', function (req, res) {
  req.session.reset();
  res.redirect('/');
});

app.get('/userHistory', ensureLogin, function (req, res) {
  res.render('userHistory');
});

