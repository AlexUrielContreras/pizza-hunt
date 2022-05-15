const { Comment, Pizza } = require('../models');

const commentController = {

    addComment({ params, body }, res) {
        console.log(body);
        Comment.create(body)
            .then(({ _id }) => {
                return Pizza.findOneAndUpdate(
                    { _id: params.pizzaId },
                    // $push work the same way thats it works in javascript // addes data to an array 
                    { $push: { comments: _id } },
                    { new: true }
                );
            })
            .then(dbPizzaData => {
                if (!dbPizzaData) {
                    res.status(404).json({ message: 'No pizza found with this id! ' });
                    return
                }
                res.json(dbPizzaData)
            })
            .catch(err => res.json(err))
    },

    addNewReply({params, body}, res) {
        Comment.findOneAndUpdate(
            { _id: params.commentId},
            { $push: { replies: body }},
            { new: true, runValidator: true}
        )
        .then(dbPizzaData => {
            if (!dbPizzaData) {
                res.status(404).json({ message: 'No pizza found with this id'})
                return;
            }
            res.json(dbPizzaData)
        })
        .catch(err => res.json(err))
    },

    removeComment({ params }, res) {
        Comment.findOneAndDelete({ _id: params.commentId })
            .then(deletedComment => {
                if (!deletedComment) {
                    return res.status(404).json({ message: 'No comment with this id' })
                }
                return Pizza.findOneAndUpdate({ _id: params.pizzaId }, { $pull: { comments: params.commentId } }, { new: true })
            }).then(dbPizzaData => {
                if (!dbPizzaData) {
                    res.status(404).json({ message: 'No pizza found with this id!' })
                    return;
                }
                res.json(dbPizzaData)
            }).catch(err => res.json(err))
    },

    removeReply({ params }, res){
        Comment.findOneAndUpdate({_id: params.commentId},{ $pull: { replies: { replyId: params.replyId }}},
            { new: true })
        .then(dbCommentData => {
            if (!dbCommentData) {
                res.status(404).json({ message: 'No comment with this id'})
                return;
            }
            res.json(dbCommentData)
        })
        .catch(err => res.status(err))
    }

}


module.exports = commentController