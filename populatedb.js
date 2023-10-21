#! /usr/bin/env node

console.log(
    'This script populates some test items,and categories to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://martinitu:M0eZzk9FeVkXd1Vu@cluster0.krorzez.mongodb.net/inventory-application?retryWrites=true&w=majority"'
  );
  
  // Get arguments passed on command line
  const userArgs = process.argv.slice(2);
  
  const Categorie = require("./models/categorie");
  const Item = require("./models/item");
 
  
  const categories = [];
  const items = [];
 
  
  const mongoose = require("mongoose");
  mongoose.set("strictQuery", false);
  
  const mongoDB = userArgs[0];
  
  main().catch((err) => console.log(err));
  
  async function main() {
    console.log("Debug: About to connect");
    await mongoose.connect(mongoDB);
    console.log("Debug: Should be connected?");
    await createCategories();
    await createItems();
  
    console.log("Debug: Closing mongoose");
    mongoose.connection.close();
  }
  
  // We pass the index to the ...Create functions so that, for example,
  // genre[0] will always be the Fantasy genre, regardless of the order
  // in which the elements of promise.all's argument complete.
  async function categorieCreate(index, name, description) {
    const categorie = new Categorie({ name: name, description: description });
    await categorie.save();
    categories[index] = categorie;
    console.log(`Added categorie: ${name}`);
  }

  async function itemCreate(index, name, description, price, numberInStock, categorie) {
    const itemdetail = {
      name: name,
      description: description, 
      price: price,
      numberInStock: numberInStock
      
    };
    if (categorie != false) itemdetail.categorie = categorie;
    
    const item = new Item(itemdetail);
    await item.save();
    items[index] = item;
    console.log(`Added item: ${name}`);
  }
  
  
  
  async function createCategories() {
    console.log("Adding categories");
    await Promise.all([
      categorieCreate(0, "Sativa", "Bigerr plnats, more time to harvest"),
      categorieCreate(1, "Indica", "Smaller plnats, less time to harvest"),
      categorieCreate(2, "CBD", "High medicinal value"),
      
    ]);
  }
  

  
  async function createItems() {
    console.log("Adding categories");
    await Promise.all([
      itemCreate(0,
        "Og Kush",
        "OG Kush is a hybrid of a marijuana strain from Florida and Los Angeles, with a complex aroma and a high-THC. It has a mild, euphoric, and relaxing taste, and is used to ease stress, anxiety, and pain..",
        "$8",
        "100",
        categories[1],
       
      ),
      itemCreate(1,
        "Sour Diesel",
        "Sour Diesel is a popular strain that crosses Chemdawg and Super Skunk. It has dreamy, cerebral, fast-acting and energizing effects that help with stress, depression and anxiety.",
        "$10",
        "80",
        categories[0],
       
      ),
      itemCreate(2,
        "Harlequin",
        "Harlequin is one of the most popular CBD strains available. Typically testing around the 5:2 CBD/THC ratio, it exhibits a clear-headed alertness with only mild euphoria. Harlequin has a happy bent that most will find enhances whatever activity they are engaged in.",
        "$6",
        "120",
        categories[2],
       
      ),
      itemCreate(3,
        "Ringo’s Gift",
        "ringo's gift cannabis strain Ringo’s Gift—named for activist, CBD specialist, and founder of SoHum Seeds, Lawrence Ringo—is a hybrid cross of Harle-Tsu and ACDC. It keeps on giving to patients seeking a nearly full-on CBD-driven strain, with an average ratio of 24:1 CBD/THC.",
        "$10",
        "100",
        categories[2],
       
      ),
      itemCreate(4,
        "Santa Sativa",
        "by Dinafem Seeds is 70/30 sativa-dominant strain with a complex aroma. Reeking of lemons, cedar, pine, and incense, Santa Sativa delivers an elevated terpene profile consumers will fawn over.",
        "$10",
        "80",
        categories[0],
       
      ),
      itemCreate(5,
        "Gelato",
        "Gelato, also known as Larry Bird and Gelato #42 is an evenly-balanced hybrid marijuana strain made from a crossing of Sunset Sherbet and Thin Mint Girl Scout Cookies...",
        "$8",
        "100",
        categories[1],
       
      ),
    
    ]);
  }
  
  
  