const Item = require("../models/item");
const Categorie = require("../models/categorie")
const { body, validationResult } = require("express-validator");

const asyncHandler = require("express-async-handler");

exports.index = asyncHandler(async (req, res, next) => {
    // Get details of items, and categories counts (in parallel)
    const [
      numItems,
      numCategories,
    ] = await Promise.all([
      Item.countDocuments({}).exec(),
      Categorie.countDocuments({}).exec(),
    ]);
  
    res.render("index", {
      name: "Inventory Aplication Home",
      item_count: numItems,
      categorie_count: numCategories,
    });
  });

// Display list of all items.
exports.item_list = asyncHandler(async (req, res, next) => {
    const allItems = await Item.find({}, "name")
      .sort({ name: 1 })
      .populate("description")
      .exec();
  
    res.render("item_list", { name: "Item List", item_list: allItems });
  });

// Display detail page for a specific item.
// Display detail page for a specificitem.
exports.item_detail = asyncHandler(async (req, res, next) => {
    // Get details ofitems,item instances for specificitem
    const [item] = await Promise.all([
      Item.findById(req.params.id).populate("categorie").exec(),
     
    ]);
  
    if (item === null) {
      // No results.
      const err = new Error("item not found");
      err.status = 404;
      return next(err);
    }
  
    res.render("item_detail", {
      name:item.name,
     item:item,
     
    });
  });
  

// Display item create form on GET.
exports.item_create_get = asyncHandler(async (req, res, next) => {
  // Get all categories, which we can use for adding to our item.
  const [ allCategories ] = await Promise.all([
    
    Categorie.find().exec(),
  ]);

  res.render("item_form", {
    name: "Create Item",
    categories: allCategories,
  });
});


// Handle item create on POST.

exports.item_create_post = [
  // Convert the categorie to an array.
  (req, res, next) => {
    if (!(req.body.categorie instanceof Array)) {
      if (typeof req.body.categorie === "undefined") req.body.categorie = [];
      else req.body.categorie = new Array(req.body.categorie);
    }
    next();
  },

  // Validate and sanitize fields.
  body("name", "Name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("description", "description must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("price", "price must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("numberInStock", "numberInStock must not be empty").trim().isLength({ min: 1 }).escape(),
  body("categorie.*").escape(),
  // Process request after validation and sanitization.

  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Item object with escaped and trimmed data.
    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      numberInStock: req.body.numberInStock,
      categorie: req.body.categorie,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get all descriptions and categories for form.
      const [alldescriptions, allCategories] = await Promise.all([
        description.find().exec(),
        Categorie.find().exec(),
      ]);

      // Mark our selected categories as checked.
      for (const categorie of allCategories) {
        if (item.categorie.includes(categorie._id)) {
          categorie.checked = "true";
        }
      }
      res.render("item_form", {
        name: "Create Item",
        categories: allCategories,
        item: item,
        errors: errors.array(),
      });
    } else {
      // Data from form is valid. Save item.
      await item.save();
      res.redirect(item.url);
    }
  }),
];


// Display item delete form on GET.
exports.item_delete_get = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id).exec();

  if (item === null) {
    // No results.
    res.redirect("/catalog/items");
  }

  res.render("item_delete", {
    name: "Delete Item",
    item: item,
  });
});

// Handle item delete on POST.
exports.item_delete_post = asyncHandler(async (req, res, next) => {

  // Assume valid item id in field.
  await Item.findByIdAndRemove(req.body.itemid);
  res.redirect("/catalog/items");
});


// Display item update form on GET.

exports.item_update_get = asyncHandler(async (req, res, next) => {
  // Get item, descriptions and categories for form.
  const [item, allCategories] = await Promise.all([
    Item.findById(req.params.id).populate("description").populate("categorie").exec(),
    Categorie.find().exec(),
  ]);

  if (item === null) {
    // No results.
    const err = new Error("item not found");
    err.status = 404;
    return next(err);
  }

  // Mark our selected categories as checked.
  for (const categorie of allCategories) {
    for (const item_g of item.categorie) {
      if (categorie._id.toString() === item_g._id.toString()) {
        categorie.checked = "true";
      }
    }
  }

  res.render("item_form", {
    name: "Update item",
    categories: allCategories,
    item: item,
  });
});


// Handle item update on POST.

exports.item_update_post = [
  // Convert the categorie to an array.
  (req, res, next) => {
    if (!(req.body.categorie instanceof Array)) {
      if (typeof req.body.categorie === "undefined") {
        req.body.categorie = [];
      } else {
        req.body.categorie = new Array(req.body.categorie);
      }
    }
    next();
  },

  // Validate and sanitize fields.
  body("name", "name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("description", "description must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("price", "price must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("numberInStock", "numberInStock must not be empty").trim().isLength({ min: 1 }).escape(),
  body("categorie.*").escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a item object with escaped/trimmed data and old id.
    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      numberInStock: req.body.numberInStock,
      categorie: typeof req.body.categorie === "undefined" ? [] : req.body.categorie,
      _id: req.params.id, // This is required, or a new ID will be assigned!
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get all descriptions and categories for form
      const [allCategories] = await Promise.all([
        Categorie.find().exec(),
      ]);

      // Mark our selected categories as checked.
      for (const categorie of allCategories) {
        if (item.categorie.indexOf(categorie._id) > -1) {
          categorie.checked = "true";
        }
      }
      res.render("item_form", {
        name: "Update item",
        categories: allCategories,
        item: item,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid. Update the record.
      const updatedItem = await Item.findByIdAndUpdate(req.params.id, item, {});
      // Redirect to item detail page.
      res.redirect(updatedItem.url);
    }
  }),
];

