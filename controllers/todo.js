const auth = require("../middlewares/auth");
const mongoose = require("mongoose");

const TodoItem = mongoose.model("todos");
const User = mongoose.model("users");

module.exports = (app) => {
    app.get("/todos", auth, async (req, res) => {
        const todos = await TodoItem.find({user: global.user._id, completed: false}).sort({completed: 'desc' });
        return res.render("pages/todos", {error: false, todos: todos});
    });

    app.get("/sort", auth, async (req, res) => {
        try {
            const todos = await TodoItem.find({user: global.user._id,  completed: false}).sort([["priority", "asc"]]);
            return res.render("pages/todos", {error: false, todos: todos});
        } catch (error) {
            console.log(error);
            return res.redirect("pages/todos");
        }

    });

    app.get("/filterCompleted", auth, async (req, res) => {
        try {
            const todos = await TodoItem.find({user: global.user._id, completed: true}).sort({completed: 'desc' });
            return res.render("pages/todos", {error: false, todos: todos});
        } catch (error) {
            console.log(error);
            return res.redirect("pages/todos");
        }

    });


    app.get("/completed", auth, async (req, res) => {
        const todos = await TodoItem.find({user: global.user._id, completed: true}).sort({createdAt: 'desc'});
        return res.render("pages/todos", {error: false, todos: todos});
    });

    app.post("/todos", auth, async(req, res) => {
        const urgent = req.body.urgent === "on" ? true : false;
        const important = req.body.important === "on" ? true : false;


        const item = new TodoItem({
            description: req.body.description,
            urgent: urgent,
            important: important,
            user: global.user._id
        })

        try {
            await item.save();
            return res.redirect("/todos");
        }catch(err) {
            console.log(err);
            return res.redirect("/todos");
        }

    });

    app.post("/todos/edit/:id", auth, async(req, res) => {
        const urgent = req.body.urgent === "on" ? true : false; 
        const important = req.body.important === "on" ? true : false; 
        const completed = req.body.completed === "on" ? true : false; 

        let action;
        let priority;

        if( important && urgent) {
            action = 'DO';
            priority = 1;
            console.log("sad");
        }
        else if(important && !urgent){
            priority = 2;
            action = 'PLAN';
    
    
        }
        else if(!important && urgent){
            priority = 3;
            action = 'DELEGATE';
    
        }
        else{
            priority = 4;
            action = 'ELIMINATE';
    
        }

        try {
            await TodoItem.updateOne({ _id: req.params.id }, { $set: 
                { 
                description: req.body.description,
                important: important,
                urgent: urgent,
                action: action,
                priority: priority,
                completed: completed
                }
            });
            
            return res.redirect(`/todos`);
     
        } catch (error) {
            console.log(error)
            return res.redirect(`/todos/${req.params.id}`);
        }



    });

    app.post("/todos/delete", auth, async(req, res) => {
        console.log(req.body.todoId);
        try {
            const todo = await TodoItem.findById(req.body.todoId)
            console.log(todo);
            await TodoItem.findOneAndDelete(req.body.todoId);
            return res.redirect("/todos");
        } catch (error) {
            console.log(error);
            return res.redirect(`/todos/${req.body.todoId}`);
        }
    });

    app.get("/todos/:id", auth, async(req, res) => {
        try {
            const todo = await TodoItem.findById(req.params.id);
            return res.render("pages/todo", {todo: todo, createdAt: todo.createdAt.toISOString()});
        }catch(error) {
            console.log(error);
            return res.redirect("/todos");

        }


    });
}