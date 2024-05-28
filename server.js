const express=require("express");
const app=express();
const users=require("./routes/user.js")
const session=require("express-session");
const flash=require("connect-flash");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.use(session({secret:"mysupersecretstring",resave:false,saveUninitialized:true}));


app.get("/reqCount",(req,res)=>{
    if(req.session.count)
        {
            req.session.count++;
        }
        else{
            req.session.count=1;
        }
        res.send(`you sent a request ${req.session.count} times`);
});
const sessionOptions={
    secret:"mysupersecretcode",
    resave:false,
    saveUninitialized:true,
};

app.use(session(sessionOptions));
app.use(flash());

app.get("/register",(req,res)=>{
    let {name}=req.query;
    req.flash("success","user registered successfully");
    res.send(name);
})

app.get("/hello",(req,res)=>{
    res.send("Hello")
})


app.get("./test",(req,res)=>{
    res.send("test successful");
});
