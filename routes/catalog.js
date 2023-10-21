const express = require("express");
const router = express.Router();

// Require controller modules.
const item_controller = require("../controllers/itemController");
const categorie_controller = require("../controllers/categorieController");


/// ITEM ROUTES ///

// GET catalog home page.
router.get("/", item_controller.index);

// GET request for creating a item. NOTE This must come before routes that display Book (uses id).
router.get("/item/create", item_controller.item_create_get);

// POST request for creating item.
router.post("/item/create", item_controller.item_create_post);

// GET request to delete item.
router.get("/item/:id/delete", item_controller.item_delete_get);

// POST request to delete item.
router.post("/item/:id/delete", item_controller.item_delete_post);

// GET request to update item.
router.get("/item/:id/update", item_controller.item_update_get);

// POST request to update item.
router.post("/item/:id/update", item_controller.item_update_post);

// GET request for one item.
router.get("/item/:id", item_controller.item_detail);

// GET request for list of all item items.
router.get("/items", item_controller.item_list);

/// CATEGORIE ROUTES ///

// GET request for creating a CATEGORIE. NOTE This must come before route that displays Genre (uses id).
router.get("/categorie/create", categorie_controller.categorie_create_get);

//POST request for creating categorie.
router.post("/categorie/create", categorie_controller.categorie_create_post);

// GET request to delete categorie.
router.get("/categorie/:id/delete", categorie_controller.categorie_delete_get);

// POST request to delete categorie.
router.post("/categorie/:id/delete", categorie_controller.categorie_delete_post);

// GET request to update categorie.
router.get("/categorie/:id/update", categorie_controller.categorie_update_get);

// POST request to update categorie.
router.post("/categorie/:id/update", categorie_controller.categorie_update_post);

// GET request for one categorie.
router.get("/categorie/:id", categorie_controller.categorie_detail);

// GET request for list of all categorie.
router.get("/categories", categorie_controller.categorie_list);



module.exports = router;
