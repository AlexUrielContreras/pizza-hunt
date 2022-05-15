const { Schema, model } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const PizzaSchema = new Schema({
    pizzaName: {
        type: String,
        required: true,
        trim: true
    },
    createdBy: {
        type: String,
        require: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: (createdAtVal) => dateFormat(createdAtVal)
    },
    size: {
        type: String,
        required: true,
        enum: ['Personal', 'Small', 'Meduim', 'Large', 'Extra Large'],
        default: 'Large'
    },
    toppings: [],
    comments: [
        {
        // tells that the data comes from comment model
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]

},
{
    // tells the schema that it can use the virtuals
    toJSON: {
        virtuals: true,
        getters: true
    },
    // mongoose return is own virtual to we set it to false so that it doesn't return its own virtauls 
    id: false
});

// get total count of comments and replies on retrival 
PizzaSchema.virtual('commentCount').get(function(){
    return this.comments.reduce((total, comment) => total + comment.replies.length + 1, 0);
});

const Pizza = model('Pizza', PizzaSchema);

module.exports = Pizza;