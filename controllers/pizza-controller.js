const { Pizza } = require('../models');

const pizzaController = {

    // gets all the pizzas 
    getAllPizza(req, res) {
        Pizza.find({})
        // populate is === include in sql 
            .populate({
                path: 'comments',
                select: '-__v'
            })
            .select('-__v')
            .sort({ _id: -1 })
            .then(dbPizzaData => res.json(dbPizzaData))
            .catch(err => {
                console.log(err);
                // 400 = bad request // server cannot or will not procces the request due to something that is preceived to be client error
                res.status(400).json(err)
            })
    },

    // get One Pizza
    // descructured the req obj to params 
    getPizzaById({ params }, res) {
        Pizza.findOne({ _id: params.id })
        .populate({
            path: 'comments',
            select: '-__v'
        })
        .select('-__v')
            .then(dbPizzaData => {
                if (!dbPizzaData) {
                    // 404 = not found // server cannot find the requested resource
                    res.status(404).json({ message: 'No pizza found with this id! '});
                    return
                }
                res.json(dbPizzaData);
            })
            .catch(err => {
                console.log(err)
                res.status(400).json(err)
            })
    },

    //create new pizza 
    createPizza({body}, res){
        Pizza.create(body)
            .then(dbPizzaData => res.json(dbPizzaData))
            .catch(err => res.status(400).json(err))
    }, 

    // Update pizza by id
    updatePizza({params, body}, res){
        // { new: true } tells mongoose to send the new document and not the original document
        Pizza.findOneAndUpdate({ _id: params.id }, body, { new: true })
        .then(dbPizzaData => {
            if (!dbPizzaData){
                res.status(404).json({ message: 'no pizza found with this id'})
                return
            }
            res.json(dbPizzaData)
        })
        .catch(err => res.status(400).json(err))
    }, 

    //delete pizza
    deletePizza({params}, res){
        Pizza.findOneAndDelete({ _id: params.id })
            .then(dbPizzaData => {
                if ( !dbPizzaData ) {
                    res.status(404).json({ message: 'no pizza found with this id'})
                    return
                }
                res.json(dbPizzaData)
            })
            .catch(err => res.status(400).json(err))
    }
};

module.exports = pizzaController