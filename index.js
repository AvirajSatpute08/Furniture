// const express = require('express');
// const session = require('express-session');
// const MongoStore = require('connect-mongo');
// const path = require('path');
// const connectDB = require('./connection');


// const app = express();

// // Connect to MongoDB
// connectDB();

// // Set up EJS as the templating engine
// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));

// // Serve static files from the "public" directory
// app.use(express.static(path.join(__dirname, 'public')));

// // Session setup
// const store = MongoStore.create({
//     mongoUrl: 'mongodb://localhost:27017/furniture',
//     collectionName: 'sessions'
// });

// app.use(session({
//     secret: 'thisismynewtoken',
//     resave: false,
//     saveUninitialized: true,
//     store: store
// }));

// // Body parser middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Your routes
// const userRoutes = require('./routes/user_route');
// const adminRoutes = require('./routes/admin_route');

// // Route rendering
// app.get('/', (req, res) => {
//     res.render('index');  // Ensure 'index.ejs' exists in your views folder
// });
// app.use('/', userRoutes);
// app.use('/user', userRoutes);
// app.use('/admin', adminRoutes);

// // Start the server
// app.listen(3000, () => {
//     console.log('Server is running on port 3000');
// });


// Import dependencies
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');
const {connectDB , connectToCollection} = require('./connection'); // MongoDB connection function
const cookieParser = require('cookie-parser');
//const favicon = require('serve-favicon');
//const userRoutes = require('./routes/user_route'); 

const app = express();
app.use(express.json());  // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));  // Parse form data
app.use(cookieParser());  // Parse cookies
app.use(express.static('public'));
//app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));

// Connect to MongoDB
connectDB();
connectToCollection();

// Set up EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Session setup
const store = MongoStore.create({
    mongoUrl: 'mongodb://localhost:27017/furniture',
    collectionName: 'sessions'
});

app.use(session({
    secret: 'thisismynewtoken',
    resave: false,
    saveUninitialized: true,
    store: store
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Your routes
const userRoutes = require('./routes/user_route');
const adminRoutes = require('./routes/admin_route');
//const ownerRoutes = require('./routes/ownerRoutes');  

// Route rendering
// app.get('/', (req, res) => {
//     res.render('index');  // Ensure 'index.ejs' exists in your views folder
// });
app.use('/', userRoutes); 
app.use('/user', userRoutes);  // User routes
app.use('/admin', adminRoutes);  // Admin routes
//app.use('/admin', ownerRoutes); 

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
