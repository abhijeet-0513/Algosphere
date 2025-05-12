const express=require('express')

const problemRouter=express.Router()


// Create problem route
problemRouter.post('/create',problemCreate)
problemRouter.patch('/:id',problemUpdate)
problemRouter.delete('/:id',problemDelete)


problemRouter.get('/:id',problemFetch)
problemRouter.get('/',getAllProblem)
problemRouter.get('/user',solvedProblem)



// Fetch problem route
// Update problem route
// Delete problem route