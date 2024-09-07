const express = require('express');
const router = express.Router();
const {Rental} = require('../models/rental');
const auth = require('../middlewares/auth');
const moment = require('moment');
const { Movie } = require('../models/movie');

router.post('/', auth, async (req, res)=>{
    // check dateReturned info of the rental
    if(!req.body.customer) return res.status(400).send('Cutomer field is required. Please provide customer id.');
    const customerId = req.body.customer;
    if(!req.body.movie) return res.status(400).send('Movie field is required. Please provide movie id.');
    const movieId = req.body.movie;

    const rental = await Rental.findOne({
        'customer._id': customerId,
        'movie._id': movieId,
    });
    if(!rental) return res.status(404).send('No retnal with these infos.');

    // if rental has dateReturned, return has been processed
    if(rental.dateReturned) return res.status(400).send('The movie has been returned.');

    // if not, add dateReturned, caculate rentalFee
    rental.dateReturned = Date.now();
    const rentalDays = moment().diff(rental.dateOut, 'days');
    rental.rentalFee = rental.movie.dailyRentalRate*rentalDays;
    await rental.save();

    // restock movie
    await Movie.updateOne({_id: rental.movie._id}, {$inc: {numberInStock: 1} })
    
    res.status(200).send(rental);
});

module.exports = router;