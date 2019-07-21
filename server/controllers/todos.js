const Todo = require('../models').Todo;
const TodoItem = require('../models').TodoItem;

module.exports = {
    create(req, res) {
        return Todo
            .create({
                title: req.body.title,
            })
            .then(todo => res.status(201).send(todo))
            .catch(error => res.status(400).send(error));
    },
    // list(req, res) {
    //     return Todo
    //         .findAll({
    //            attributes: ['id', 'title', 'createdAt', 'updatedAt']
    //         })
    //         .then(todos => res.status(200).send(todos))
    //         .catch(error => res.status(400).send(error));
    // },
    list(req, res) {
        return Todo
            .findAll({
                attributes: ['id', 'title', 'createdAt', 'updatedAt'],
                include: [
                    {
                       all: true, 
                       nested: true
                    }
                ],
            })
            .then(todos => res.status(200).send(todos))
            .catch(error => res.status(400).send(error));
    },

    retrieve(req, res) {
        return Todo
            .findByPk(req.params.todoId, {
                attributes: ['id', 'title', 'createdAt', 'updatedAt'],
                include: [{
                    all: true,
                    nested: true
                }],
            })
            .then(todo => {
                if (!todo) {
                    return res.status(404).send({
                        message: 'Todo Not Found',
                    });
                }
                return res.status(200).send(todo);
            })
            .catch(error => res.status(400).send(error));
    },

    update(req, res) {
        return Todo
            .findByPk(req.params.todoId, {
                attributes: ['id', 'title', 'createdAt', 'updatedAt'],
                include: [{
                    all: true,
                    nested: true
                }],
            })
            .then(todo => {
                if (!todo) {
                    return res.status(404).send({
                        message: 'Todo Not Found',
                    });
                }
                return todo
                    .update({
                        // If new title has been provided use it or else use an existing title
                        title: req.body.title || todo.title,
                    })
                    .then(() => res.status(200).send(todo)) // Send back the updated todo.
                    .catch((error) => res.status(400).send(error));
            })
            .catch((error) => res.status(400).send(error));
    },

    destroy(req, res) {
        return Todo
            .findByPk(req.params.todoId, {
                attributes: ['id', 'title', 'createdAt', 'updatedAt'],
                include: [{
                    all: true,
                    nested: true
                }],
            })
            .then(todo => {
                console.log('MY TODO', todo);
                if (!todo) {
                    return res.status(400).send({
                        message: 'Todo Not Found',
                    });
                }
                return todo
                    .destroy()
                    .then(() => res.status(200).send(
                        { message: 'Todo sucessfully deleted'}
                    ))
                    .catch(error => res.status(400).send(error));
            })
            .catch(error => res.status(400).send(error));
    },
    
};

