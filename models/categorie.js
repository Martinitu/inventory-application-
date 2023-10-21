const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CategorieSchema = new Schema({
    name: {type: String, require: true, maxLength: 100 },
    description: {type: String, require: true  },


});


CategorieSchema.virtual("url").get(function(){
    return `/catalog/categorie/${this._id}`
});

module.exports = mongoose.model("Categorie", CategorieSchema);

