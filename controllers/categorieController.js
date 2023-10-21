const Categorie = require("../models/categorie");
const Item = require("../models/item");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// Display list of all Categories.

exports.categorie_list = asyncHandler(async (req, res, next) => {
    const allCategories = await Categorie.find().sort({ name: 1 }).populate("description").exec();
    res.render("categorie_list", {
      name: "Categorie List",
      categorie_list: allCategories,
    });
  });
  

// Display detail page for a specific Categorie.

exports.categorie_detail = asyncHandler(async (req, res, next) => {
    // Get details of categorie and all associated items (in parallel)
    const [categorie, itemsInCategorie] = await Promise.all([
      Categorie.findById(req.params.id).exec(),
      Item.find({ categorie: req.params.id }, "name").populate("description").exec(),
    ]);
    if (categorie === null) {
      // No results.
      const err = new Error("categorie not found");
      err.status = 404;
      return next(err);
    }
  
    res.render("categorie_detail", {
      name: "Categorie Detail",
      categorie: categorie,
      categorie_items: itemsInCategorie,
    });
  });
  

// Display categorie create form on GET.
exports.categorie_create_get = (req, res, next) => {
  res.render("categorie_form", { name: "Create Categorie" });
};


// Handle Categorie create on POST.
exports.categorie_create_post = [
  // Validate and sanitize the name field.
  body("name", "Categorie name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),
    body("description", "Categorie description must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a categorie object with escaped and trimmed data.
    const categorie = new Categorie({ 
      name: req.body.name, 
      description: req.body.description 
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("categorie_form", {
        name: "Create Categorie",
        categorie: categorie,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Check if categorie with same name already exists.
      const categorieExists = await Categorie.findOne({ name: req.body.name }).exec();
      if (categorieExists) {
        // Categorie exists, redirect to its detail page.
        res.redirect(categorieExists.url);
      } else {
        await categorie.save();
        // New categorie saved. Redirect to categorie detail page.
        res.redirect(categorie.url);
      }
    }
  }),
];


// Display categorie delete form on GET.

exports.categorie_delete_get = asyncHandler(async (req, res, next) => {
  // Get details of categorie and all their items (in parallel)
  const [categorie, allItemsByCategorie] = await Promise.all([
    Categorie.findById(req.params.id).exec(),
    Item.find({ categorie: req.params.id }, "name").exec(),
  ]);

  if (categorie === null) {
    // No results.
    res.redirect("/catalog/categories");
  }

  res.render("categorie_delete", {
    name: "Delete Categorie",
    categorie: categorie,
    categorie_items: allItemsByCategorie,
  });
});


// Handle categorie delete on POST.

exports.categorie_delete_post = asyncHandler(async (req, res, next) => {
  // Get details of categorie and all their items (in parallel)
  const [categorie, allItemsByCategorie] = await Promise.all([
    Categorie.findById(req.params.id).exec(),
    Item.find({ categorie: req.params.id }, "name").exec()
  ]);

  if (allItemsByCategorie.length > 0) {
    // categorie has items. Render in same way as for GET route.
    res.render("categorie_delete", {
      name: "Delete Categorie",
      categorie: categorie,
      categorie_items: allItemsByCategorie,
    });
    return;
  } else {
    // categorie has no items. Delete object and redirect to the list of categories.
    await Categorie.findByIdAndRemove(req.body.categorieid);
    res.redirect("/catalog/categories");
  }
});


// Display categorie update form on GET.

exports.categorie_update_get = asyncHandler(async (req, res, next) => {
  // Get categorie, descriptions and genres for form.
  const [categorie] = await Promise.all([
    Categorie.findById(req.params.id).populate("description").exec(),
  
  ]);

  if (categorie === null) {
    // No results.
    const err = new Error("categorie not found");
    err.status = 404;
    return next(err);
  }



  res.render("categorie_form", {
    title: "Update Categorie",
    categorie: categorie,
  });
});


// Handle categorie update on POST.

exports.categorie_update_post = [


  // Validate and sanitize fields.
  body("name", "name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("description", "description must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
 
  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a categorie object with escaped/trimmed data and old id.
    const categorie = new Categorie({
      name: req.body.name,
      description: req.body.description,
      _id: req.params.id, // This is required, or a new ID will be assigned!
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get all descriptions and genres for form
      const [alldescriptions] = await Promise.all([
        description.find().exec(),
   
      ]);

    
      res.render("categorie_form", {
        name: "Update Categorie",
        descriptions: alldescriptions,
        categorie: categorie,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid. Update the record.
      const updatedCategorie = await Categorie.findByIdAndUpdate(req.params.id, categorie, {});
      // Redirect to categorie detail page.
      res.redirect(updatedCategorie.url);
    }
  }),
];

