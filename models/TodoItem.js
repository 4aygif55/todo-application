const mongoose = require("mongoose");
const { Schema } = mongoose;

const todoSchema = new Schema({
    description: {
        type: String,
        required: [true, "Description is required"],
    },
    urgent: {
        type: Boolean,
        default: false,
    },
    important: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    action: {
        type: String, 
        enum: ['DO', 'PLAN', 'DELEGATE', 'ELIMINATE'],
        default: 'DELEGATE'
    },
    priority: {
        type: Number,
        default: 3
    },
    completed: {
        type: Boolean,
        default: false,
    },
    user: {
        type: Schema.Types.ObjectId, 
        ref: 'Story'
    }
});


todoSchema.pre("save", async function(next) {
    if(this.important === true && this.urgent === true) {
        this.action = 'DO';
        this.priority = 1;
    }
    else if(this.important === true && this.urgent === false){
        this.priority = 2;
        this.action = 'PLAN';


    }
    else if(this.important === false && this.urgent === true){
        this.priority = 3;
        this.acition = 'DELEGATE';

    }
    else{
        this.priority = 4;
        this.action = 'ELIMINATE';

    }

    next();

});



mongoose.model("todos", todoSchema);