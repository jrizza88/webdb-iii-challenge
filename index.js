

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

const port = process.env.PORT || 7777;

server.listen(port, () => {
    console.log(`\n API is listening on http://localhost:${port} \n`)
})