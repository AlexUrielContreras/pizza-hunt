const router = require('express').Router();
const { addComment, addNewReply, removeComment,  removeReply } = require('../../controllers/comment.controller');

router
    .route('/:pizzaId')
    .post(addComment)

router 
    .route('/:pizzaId/:commentId')
    .put(addNewReply)
    .delete(removeComment)

router
    .route('/:pizzaId/:commentId/:replyId')
    .delete(removeReply)



module.exports = router;