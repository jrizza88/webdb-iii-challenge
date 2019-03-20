

const express = require('express');
const helmet = require('helmet');
const knex = require('knex');
const knexConfig = require('./knexfile');

const db = knex(knexConfig.development);

const server = express();

server.use(helmet());
server.use(express.json());

server.get('/api/cohorts', async (req, res) => {
    try {
        const cohorts = await db('cohorts')
        res.status(200).json(cohorts)
    } catch (error){
        res.status(500).json(error)
    }
});

server.get('/api/cohorts/:id', async (req, res) => {
    try {
        const cohort = await db('cohorts')
        .where({id: req.params.id})
        .first();
        if(!cohort) {
            res.status(404).json({message: 'id not found!'})
        }
        res.status(200).json(cohort)
    } catch (error){
        res.status(500).json(error)
    }
});

server.get('/api/cohorts/:id/students', async (req, res) => {
    try {
        const cohort = await db('cohorts')
        .select('students.id',  'students.name', 'cohorts.id as cohort')
        .from('cohorts')
        .innerJoin('students', 'cohorts.id', 'students.cohort_id')
        .where({cohort_id: req.params.id})
        res.status(200).json(cohort)
    } catch (error) {
        res.status(500).json(error)
    }
});

server.post('/api/cohorts', async (req, res) => {
    try{
        const cohort = req.body;
        const [id] = await db('cohorts').insert(cohort)
        const newCohort = await db('cohorts').where({id}).first()
        res.status(201).json(newCohort)
    } catch (error) {
        res.status(500).json(error)
    }
});

server.put('/api/cohorts/:id', async (req, res) => {
    try{
        const cohort = req.body;
        const updateCohort = await db('cohorts').where({id: req.params.id}).first().update(cohort)
        if (!updateCohort){
            res.status(404).json({message: 'Record not found!'})
        }
        res.status(200).json(updateCohort)
    } catch (error){
        res.status(500).json(error)
    }
});

server.delete('/api/cohorts/:id', async (req, res) => {
    try {
        const cohort = await db('cohorts').where({id: req.params.id}).del()
        if(cohort > 0) {
            res.status(204).end()
        } else {
            res.status(404).json({message: 'Records not found'})
        }
    } catch (error){
        res.status(500).json(error)
    }
});



server.get('/api/students', async (req, res) => {
    try {
        const students = await db('students')
        res.status(200).json(students)
    } catch (error){
        res.status(500).json(error)
    }
});

// server.get('/api/students/:id', async (req, res) => {
//     try {
//         const students = await db('students')
//         .where({id: req.params.id})
//         .first();
//         if(!students) {
//             res.status(404).json({message: 'id not found!'})
//         }
//         res.status(200).json(students)
//     } catch (error){
//         res.status(500).json(error)
//     }
// });

server.get('/api/students/:id', async (req, res) => {
    try {
        const cohort = await db('students')
        .select('students.id',  'students.name', 'cohorts.id as cohort')
        .from('cohorts')
        .innerJoin('students', 'cohorts.id', 'students.cohort_id')
        .where({cohort_id: req.params.id})
        .first()
        res.status(200).json(cohort)
    } catch (error) {
        res.status(500).json(error)
    }
});

server.post('/api/students', async (req, res) => {
    try{
        const students= req.body;
        const [id] = await db('students').insert(students)
        const newStudent = await db('students').where({id}).first()
        res.status(201).json(newStudent)
    } catch (error) {
        res.status(500).json(error)
    }
});

server.put('/api/students/:id', async (req, res) => {
    try{
        const student = req.body;
        const updateStudent= await db('students').where({id: req.params.id}).first().update(student)
        if (!updateStudent){
            res.status(404).json({message: 'Record not found!'})
        }
        res.status(200).json(updateStudent)
    } catch (error){
        res.status(500).json(error)
    }
});

server.delete('/api/students/:id', async (req, res) => {
    try {
        const student = await db('students').where({id: req.params.id}).del()
        if(student > 0) {
            res.status(204).end()
        } else {
            res.status(404).json({message: 'Records not found'})
        }
    } catch (error){
        res.status(500).json(error)
    }
});

const port = process.env.PORT || 7777;

server.listen(port, () => {
    console.log(`\n API is listening on http://localhost:${port} \n`)
})