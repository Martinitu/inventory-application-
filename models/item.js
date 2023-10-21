const mongoose = require("mongoose");

const Schema = mongoose.Schema;


const ItemSchema = new Schema({

    name: {type: String, require: true, maxLength: 100 },
    description: {type: String, require: true  },
    price: {type: String, require: true, maxLength: 100 },
    numberInStock: {type: String, require: true, maxLength: 10 },
    categorie: [{ type: Schema.Types.ObjectId, ref: "Categorie" }]
});


ItemSchema.virtual("url").get(function(){
    return `/catalog/item/${this._id}`
});

module.exports = mongoose.model("Item", ItemSchema);