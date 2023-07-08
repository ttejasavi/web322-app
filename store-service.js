const fs = require("fs");
let items = [];
let categories = [];



module.exports.getAllItems = function(){
    return new Promise((resolve, reject)=>{
        if(items.length==0){
           reject("NO Items to show")
        }else{
             resolve(items);
        }      
    })
}

module.exports.getPublishedItems = function(){
  return new Promise((resolve,reject)=>{
    let publishedItems = [];
    for(let i = 0; i< items.length; i++){
      if(items[i].isPublishedItems==true){
        publishedItems.push(items[i]);


      }
    }
    if(publishedItems.length==0){
      reject("Nothing published to be displayed")
    }else{
      resolve(publishedItems);
    }
  })
}
function addItem(item) {
  const newItem = { ...item, postDate: new Date().toISOString().slice(0, 10) };
  items.push(newItem);
}

module.exports = addItem;



function processItem(imageUrl) {
  req.body.featureImage = imageUrl;

  storeService.addItem(req.body)
    .then((newItem) => {
      // Redirect the user to the /items route or send an appropriate response
      res.redirect('/items');
    })
    .catch((error) => {
      console.error(error);
      // Handle the error appropriately
      res.status(500).send('Error adding the item.');
    });
}
function getItemsByCategory(category) {
  return new Promise((resolve, reject) => {
    const filteredItems = items.filter(item => item.category === category);
    if (filteredItems.length === 0) {
      reject('No results returned');
    } else {
      resolve(filteredItems);
    }
  });
}
function getItemsByMinDate(minDateStr) {
  return new Promise((resolve, reject) => {
    const filteredItems = items.filter(item => new Date(item.postDate) >= new Date(minDateStr));
    if (filteredItems.length === 0) {
      reject('No results returned');
    } else {
      resolve(filteredItems);
    }
  });
}
function getItemById(id) {
  return new Promise((resolve, reject) => {
    const item = items.find(item => item.id === id);
    if (item) {
      resolve(item);
    } else {
      reject('No result returned');
    }
  });
}
function getPublishedItemsByCategory(category) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const filteredItems = items.filter((item) => item.published && item.category === category);
        resolve(filteredItems);
      } catch (error) {
        reject(error);
      }
    }, 1000);
  });
}

