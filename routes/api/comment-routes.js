const { addComment, removeComment } = require('../../controllers/comment-controller');
const router = require('express').Router();

router 
    .route('/:pizzaId')
    .post(addComment)

router
    .route('/:pizzaId/:commentId')
    .delete(removeComment)





module.exports = router