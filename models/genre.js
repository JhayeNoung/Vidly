const mongoose = require('mongoose');
const Joi = require('joi');

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 5,
        maxlength: 255,
        require: true,
    }
});

const Genre = mongoose.model('Genre', genreSchema);

function validateGenre(genre){
    const schema = Joi.object({
        name: Joi.string().min(5).max(255).required(),
    });
    return schema.validate(genre);
}

exports.validateGenre = validateGenre;
exports.Genre = Genre;
exports.genreSchema = genreSchema;