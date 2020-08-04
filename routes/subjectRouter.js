const express = require('express');
const bodyParser = require('body-parser'); 
const mongoose = require('mongoose');

const Subjects = require('../models/subjects');
const Students = require('../models/students');

const subjectRouter = express.Router();

subjectRouter.route('/')
.get((req,res,next) => {
    Subjects.find(req.query)
    .then((subjects) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(subjects);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req,res,next) => {
    Subjects.create(req.body)
    .then((subject) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(subject);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete((req, res, next) => {
    Subjects.deleteMany(req.query)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
});

subjectRouter.route('/:subjectId')
.get((req,res,next) => {
    Subjects.findById(req.params.subjectId)
    .then((subjects) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(subjects);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /subjects/'+ req.params.subjectId);
})
.put((req,res,next) => {
    Subjects.findByIdAndUpdate(req.params.subjectId, {
        $set: req.body
    }, { new: true})
    .then((subjects) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(subjects);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete((req,res,next) => {
    Subjects.findOneAndDelete(req.params.subjectId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

subjectRouter.route('/:subjectId/students')
.get((req,res,next) => {
    Subjects.findById(req.params.subjectId)
    .populate('students')
    .select('students')
    .exec((err, students) => {
        if(err) next(err);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(students);  
    })




    
    // .then(subject => Students.find({_id:{$in:subject.students}})
    // .then(students => {
    //     res.statusCode = 200;
    //     res.setHeader('Content-Type', 'application/json');
    //     res.json(students); 
    // }, (err) => next(err)))
    // .catch((err) => next(err));
})
.post((req,res,next) => {
    Subjects.update(
        { _id: req.params.subjectId },
        { $addToSet: { students: req.body } }
     )
    .then(subject => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(subject); 
    }, (err) => next(err))
    .catch((err) => next(err));
})

module.exports = subjectRouter;