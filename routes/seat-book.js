/*
 * Created on Sat Nov 30 2019
 * Created by - Ritesh Kant
 *
 */

const express = require('express');
var Train = require('../models/Train');
var router = express.Router();

/** Get all the seats status */
router.get('/', (req, res) => {
    Train.find({}).then((data) => {
        res.send(data);
    }).catch(err => console.log(err));
});

/** Used to create seat information */
router.post('/', (req, res) => {
    Train.insertMany(req.body).then((data) => {
        res.json(data);
    }).catch(err => console.log(err));

});

/** Used to update seat information */
//TODO Transaction needs to be implemented
router.patch('/', (req, res) => {
    req.body.forEach((value) => {
        const id = value._id;
        const selected = value.isSelected;
        Train.findOneAndUpdate({ _id: id }, { $set: { isSelected: selected } })
        .then(() => {
            console.log('congrats saved');
        })
        .catch((err) => {
            console.log(err);
            throw err;
        });
    });
    res.send({ message: 'success' });

});

module.exports = router;