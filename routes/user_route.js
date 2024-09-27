const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Service = require('../models/Service');
const Blog = require('../models/Blog');
const Newsletter = require('../models/Newsletter');
const Product = require('../models/Product');
//const ProductType= require('../models/ProductType');
const Order = require('../models/Order');
const Banner = require('../models/Banner');
//const Product1 = require('../models/Product1');
const User = require('../models/User');
//const ContactUs = require('../models/contactUs');
//const Customer = require('../models/customer');
const Admin = require('../models/admin');
const UserCart = require('../models/UserCart');
const OrderProduct = require('../models/OrderProduct'); 
//const Cart = require('../models/Cart'); 
//const jwt = require('jsonwebtoken');
//const jwtSecret = "thisismynewtoken";
//const connectToCollection = require('../connection');
//const Order = require('../models/Order');
//const upload = require('../uploads');
// const multer = require('multer');
// const upload = multer({ dest: 'uploads/' });
//const upload = require('../middleware/multerConfig');
//const session = require('../middleware/sessionMiddleware');
// const session = require('express-session');

// app.use(session({
//     secret: 'thisismynewtoken',  // Replace with a strong secret
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: false }  // Set to true if using HTTPS
// }));



//Home route
router.get("/", async (req, res) => {
    try {
        // Fetch data from collections using Mongoose models
        const banner_info = await Banner.find({});  // Assuming 'Service' model stores banner info
        const wcu_info = await Service.find({});  // Assuming 'Service' model stores "Why Choose Us" info
        const modern_interior = await Service.find({});  // Assuming 'Service' model stores modern interior info
        const wcup = await Blog.find({}).sort({ wcup_id: -1 }).limit(4); // Assuming 'Blog' model stores WCUP points
        const product = await Product.find({}).sort({ product_id: -1 }).limit(4);
        const testimonial = await Contact.find({}).sort({ c_id: -1 }).limit(6);

        // Prepare data object to pass to view
        const obj = {
            "banner_info": banner_info[0],  // If fetching multiple, use the first one
            "wcu_info": wcu_info[0],        // Same here
            "modern_data": modern_interior[0],
            "wcup": wcup,
            "product": product,
            "testimonial": testimonial,
            "isLogin": req.session.c_id ? true : false, // Session check
        };
        
        // Render home page with fetched data
        res.render("user/home.ejs", obj);
    } catch (err) {
        console.error("Error fetching data:", err);
        res.status(500).send("Error loading home page");
    }
});

// router.get("/", async (req, res) => {
//     try {
//         // Example of fetching data from MongoDB
//         const bannerData = await Banner.find({}); // Assuming you have a Banner model
//         res.render("user/home.ejs", { banner: bannerData }); // Pass data to EJS template
//     } catch (err) {
//         console.error("Error fetching data:", err);
//         res.status(500).send("Error loading home page");
//     }
// });

// Login route
router.get("/login", (req, res) => {
    const obj = { isLogin: req.session.c_id ? true : false };
    res.render("user/login.ejs", obj);
  });

router.get("/admin_login", (req, res) => {
  const obj = { "isLogin": req.session.c_id ? true : false };
  res.render("user/admin_login.ejs", obj);
});

// Admin login POST route
// router.post("/admin_login", async (req, res) => {
//     const { admin_mobile, admin_password } = req.body; // Get data from form
  
//     try {
//       const adminCollection = await connectToCollection("admin"); // Connect to MongoDB collection
  
//       // Find admin in the database by mobile number and password
//       const data = await adminCollection.findOne({ admin_mobile, admin_password });
  
//       if (data) {
//         // If admin is found, create session
//         req.session.admin_id = data.admin_id;
//         req.session.admin_mobile = data.admin_mobile;
  
//         res.redirect("/admin"); // Redirect to admin dashboard after successful login
//       } else {
//         // Invalid credentials
//         res.send("<script>alert('Invalid Credentials'); history.back(); </script>");
//       }
//     } catch (err) {
//       console.error("Error during admin login:", err);
//       res.status(500).send("Internal server error during admin login.");
//     }
//   });

router.post("/admin_login", async (req, res) => {
    const { admin_mobile, admin_password } = req.body; // Get data from form
  
    try {
      // Find admin in the database by mobile number and password
      const data = await Admin.findOne({ admin_mobile, admin_password });
  
      if (data) {
        // If admin is found, create session
        req.session.admin_id = data._id;
        req.session.admin_mobile = data.admin_mobile;
  
        res.redirect("/admin"); // Redirect to admin dashboard after successful login
      } else {
        // Invalid credentials
        res.send("<script>alert('Invalid Credentials'); history.back(); </script>");
      }
    } catch (err) {
      console.error("Error during admin login:", err);
      res.status(500).send("Internal server error during admin login.");
    }
  });
  
// User signup route
router.get("/signup", (req, res) => {
    const obj = { "isLogin": req.session.c_id ? true : false };
    res.render("user/signup.ejs", obj);
});

//Registration route
router.post("/do_register", async (req, res) => {
    const { c_name, c_email, c_mobile, c_password } = req.body;
  
    try {
      // Check if user already exists with the provided email or mobile number
      let user = await User.findOne({ c_email });
      if (user) {
        return res.status(400).send('Email already exists.');
      }
  
      user = await User.findOne({ c_mobile });
      if (user) {
        return res.status(400).send('Mobile number already exists.');
      }
  
      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(c_password, 10);
  
      // Create a new user
      const newUser = new User({
        c_name,
        c_email,
        c_mobile,
        c_password: hashedPassword, // Store the hashed password
      });
  
      // Save the new user
      await newUser.save();
  
      // Set session data
      req.session.c_id = newUser._id;
      req.session.c_name = newUser.c_name;
      req.session.c_email = newUser.c_email;
      req.session.c_mobile = newUser.c_mobile;
  
      // Redirect to home or dashboard after successful registration
      res.redirect("/");
    } catch (error) {
      console.error("Error during registration:", error);
      res.status(500).send("Internal Server Error");
    }
  });


  router.post("/do_login", async (req, res) => {
    const { c_mobile, c_password } = req.body; // Get data from form
  
    try {
      // Find user by mobile number
      const user = await User.findOne({ c_mobile });
      if (!user) {
        return res.send("<script>alert('Invalid Credentials'); history.back(); </script>");
      }
  
      // Compare the provided password with the stored hashed password
    //   const isMatch = await bcrypt.compare(c_password, user.c_password);
    //   if (!isMatch) {
    //     return res.send("<script>alert('Invalid Credentials'); history.back(); </script>");
    //   }
  
      // If password is correct, create session
      req.session.c_id = user._id;
      req.session.c_mobile = user.c_mobile;
  
      // Redirect to user dashboard or homepage after successful login
      res.redirect("/");
    } catch (err) {
      console.error("Error during login:", err);
      res.status(500).send("Internal server error during login.");
    }
  });
// router.post("/do_login", async (req, res) => {
//     const { c_mobile, c_password } = req.body;

//     try {
//         // Find user by mobile number
//         const user = await User.findOne({ c_mobile });

//         if (!user) {
//             // User not found
//             return res.status(400).send('Invalid mobile number or password');
//         }

//         // Check if password matches (ensure password hashing is handled)
//         const isMatch = await bcrypt.compare(c_password, user.c_password);

//         if (!isMatch) {
//             // Password doesn't match
//             return res.status(400).send('Invalid mobile number or password');
//         }

//         // Set session data
//         req.session.c_id = user._id;
//         req.session.c_mobile = user.c_mobile;

//         // Redirect to homepage or dashboard
//         res.redirect("/");
//     } catch (error) {
//         console.error("Error during login:", error);
//         res.status(500).send("Internal Server Error");
//     }
// });

// User login POST route
// router.post('/do_login', async (req, res) => {
//     const { c_mobile, c_password } = req.body;
  
//     try {
//         const customerCollection = await connectToCollection("customer");
    
//         // Check if user exists with mobile number and password
//         const customer = await customerCollection.findOne({ c_mobile, c_password });
    
//         if (customer) {
//             // If login is successful, set session variables
//             req.session.c_id = customer.c_id;
//             req.session.c_mobile = customer.c_mobile;
    
//             res.redirect('/');  // Redirect to home or dashboard after successful login
//         } else {
//             // If login fails, redirect back to login with an error message
//             res.send("<script>alert('Invalid Mobile Number or Password'); window.location.href='/login';</script>");
//         }
//     } catch (err) {
//         console.error("Login error:", err);
//         res.status(500).send("Internal server error during login.");
//     }
// });

  
// router.post('/do_login', async (req, res) => {
//     const { c_mobile, c_password } = req.body;

//     try {
//         const customerCollection = await connectToCollection("customer");

//         // Check if user exists with mobile number
//         const customer = await customerCollection.findOne({ c_mobile });

//         if (customer) {
//             // Optional: If using hashed passwords, compare with bcrypt
//             const isMatch = await bcrypt.compare(c_password, customer.c_password);
//             if (!isMatch) {
//                 return res.send("<script>alert('Invalid Mobile Number or Password'); window.location.href='/login';</script>");
//             }

//             // Create a JWT token with user information
//             const token = jwt.sign(
//                 { c_id: customer.c_id, c_mobile: customer.c_mobile },  // Payload
//                 jwtSecret,  // Secret key
//                 { expiresIn: '1h' }  // Token expiration time
//             );

//             // Send the token to the client (can be sent in a cookie or as a response header)
//             res.cookie('token', token, { httpOnly: true });  // You can use localStorage instead if preferred
//             res.redirect('/');  // Redirect after successful login
//         } else {
//             // If login fails, redirect back to login with an error message
//             res.send("<script>alert('Invalid Mobile Number or Password'); window.location.href='/login';</script>");
//         }
//     } catch (err) {
//         console.error("Login error:", err);
//         res.status(500).send("Internal server error during login.");
//     }
// });


// Shop route with pagination
// router.get("/shop", async (req, res) => {
//     try {
//       const productCollection = await connectToCollection("product"); // Connect to 'product' collection
  
//       const total_product = await productCollection.countDocuments(); // Count total products
//       const per_page = 8; // Products per page
//       const total_pages = Math.ceil(total_product / per_page); // Total pages
//       const url_data = url.parse(req.url, true).query; // Parse URL to get query parameters
//       const page_no = url_data.page_no ? parseInt(url_data.page_no) : 1; // Get page number from URL, default to 1
//       const start = (page_no * per_page) - per_page; // Calculate the start index for pagination
  
//       // Fetch products for the current page
//       const products = await productCollection.find().skip(start).limit(per_page).toArray();
  
//       // Object to pass to the EJS template
//       const obj = {
//         "isLogin": req.session.c_id ? true : false, // Check if user is logged in
//         "products": products,
//         "total_pages": total_pages,
//         "page_no": page_no
//       };
  
//       // Render shop page
//       res.render("user/shop.ejs", obj);
//     } catch (error) {
//       console.error("Error fetching products:", error);
//       res.status(500).send("Internal Server Error");
//     }
//   });



//main code
// router.get("/shop", async (req, res) => {
//     try {
//         const per_page = 8; // Products per page
//         const page_no = parseInt(req.query.page_no) || 1; // Get the page number from query params, default to 1 if not provided
//         const start = (page_no - 1) * per_page; // Calculate the starting index

//         // Count total products for pagination
//         const total_product = await Product.countDocuments();
//         const total_pages = Math.ceil(total_product / per_page); // Calculate total pages

//         // Fetch products for the current page, with pagination
//         const products = await Product.find()
//             .skip(start)
//             .limit(per_page);

//         // Object to pass to the EJS template
//         const obj = {
//             isLogin: req.session?.c_id ? true : false, // Check if user is logged in
//             products: products,
//             total_pages: total_pages,
//             page_no: page_no
//         };

//         // Render the shop page with the products and pagination info
//         res.render("user/shop.ejs", obj);
//     } catch (error) {
//         console.error("Error fetching products:", error);
//         res.status(500).send("Internal Server Error");
//     }
// });


router.get("/shop", async (req, res) => {
    try {
        const per_page = 8; // Products per page
        const page_no = parseInt(req.query.page_no) || 1; // Get the page number from query params, default to 1 if not provided
        const start = (page_no - 1) * per_page; // Calculate the starting index

        // Count total products for pagination
        const total_product = await Product.countDocuments();
        const total_pages = Math.ceil(total_product / per_page); // Calculate total pages

        // Log pagination info
        console.log(`Total Products: ${total_product}, Total Pages: ${total_pages}, Current Page: ${page_no}`);

        // Fetch products for the current page, with pagination
        const products = await Product.find()
            .skip(start)
            .limit(per_page);

        // Log the fetched products to verify they're retrieved correctly
        console.log("Products Fetched:", products);

        // Prepare object to pass to EJS template
        const obj = {
            isLogin: req.session?.c_id ? true : false, // Check if user is logged in
            products: products,
            total_pages: total_pages,
            page_no: page_no
        };

        // Log the object to be rendered
        console.log("Rendering Shop Page with Data:", obj);

        // Render the shop page with the products and pagination info
        res.render("user/shop.ejs", obj);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).send("Internal Server Error");
    }
});


  router.get("/about", async function(req, res) {
    try {
        // Here, if you need to fetch some data from MongoDB for the About page, you can do so.

        const obj = {
            "isLogin": req.session.c_id ? true : false, // Pass session login status
        };

        res.render("user/about.ejs", obj); // Render the about page with data
    } catch (error) {
        console.error("Error connecting to the database:", error);
        res.status(500).send("Internal Server Error");
    }
});


router.get("/services", async function(req, res) {
    try {
        const services = await Service.find();  // Fetch all services from the database
        const obj = {
            isLogin: req.session.c_id ? true : false,
            services: services
        };
        res.render("user/services.ejs", obj);  // Render the view and pass the service data
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

router.get("/blog", async function(req, res) {
    try {
        const blogs = await Blog.find();  // Fetch all blog posts from the database
        const obj = {
            isLogin: req.session.c_id ? true : false,
            blogs: blogs
        };
        res.render("user/blog.ejs", obj);  // Render the view and pass the blog data
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// router.get('/contact', (req, res) => {
//     res.render('contact', { success: req.query.success });
// });

// // Handle form submission
// router.post('/contact', async (req, res) => {
//     try {
//         const { fname, lname, email, message } = req.body;

//         // Create a new contact document
//         const newContact = new Contact({
//             fname: fname,
//             lname: lname,
//             email: email,
//             message: message
//         });

//         // Save the contact information to the database
//         await newContact.save();

//         // Redirect to the contact page with success message
//         res.redirect("/contact?success=true");
//     } catch (err) {
//         console.error(err);
//         res.status(500).send("Server error");
//     }
// });



// // Newsletter Subscription
// router.post("/newsLetter", async (req, res) => {
//     const d = req.body;

//     // Create a new Newsletter document
//     const newNewsletter = new Newsletter({
//         name: d.name,
//         email: d.email
//     });

//     await newNewsletter.save();
//     res.redirect("/contactUs");
// });


router.get('/contact', (req, res) => {
    // Check if the query parameter 'success' is set to true
    const success = req.query.success === 'true';
    
    // Render the contact page with the success variable
    res.render('user/contact', { isLogin: req.session && req.session.user, success: success });
});

// Handle Contact Form Submission
// Contact form submission (POST)
router.post('/contact', async (req, res) => {
    try {
        // Create a new contact submission
        const newContact = new Contact({
            fname: req.body.fname,
            lname: req.body.lname,
            email: req.body.email,
            message: req.body.message
        });

        // Save the contact information to the database
        await newContact.save();

        // Redirect to the contact page with success=true in the query string
        res.redirect('/contact?success=true');
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

// Handle Newsletter Subscription
router.post("/newsLetter", async (req, res) => {
    try {
        const { name, email } = req.body;

        // Validate input (optional but recommended)
        if (!name || !email) {
            return res.status(400).send("Name and email are required.");
        }

        // Create a new Newsletter document
        const newNewsletter = new Newsletter({
            name,
            email
        });

        // Save the newsletter subscription to the database
        await newNewsletter.save();

        // Redirect back to the contact page with a success message
        res.redirect("/contact?newsletterSuccess=true");
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});



// router.get("/product_info/:id", async (req, res) => {
//     const productId = req.params.id;

//     // Validate ObjectId
//     if (!mongoose.Types.ObjectId.isValid(productId)) {
//         return res.status(400).send('Invalid Product ID');
//     }

//     try {
//         const product = await Product.findById(productId);

//         if (!product) {
//             return res.status(404).send('Product not found');
//         }

//         res.render("user/product_info.ejs", { product });
//     } catch (error) {
//         console.error("Error fetching product info:", error);
//         res.status(500).send('Internal Server Error');
//     }
// });


// router.get('/product_info', (req, res) => {
//     // Check if the query parameter 'success' is set to true
//     const success = req.query.success === 'true';
    
//     // Render the contact page with the success variable
//     res.render('user/product_info', { isLogin: req.session && req.session.user, success: success });
// });

// router.get("/product_info/:product_id", async (req, res) => {
//     try {
//         const product_id = req.params.product_id;

//         // Fetch product details
//         const product_details = await Product.findById(product_id).populate('product_type_id').exec();

//         if (!product_details) {
//             return res.status(404).send("Product not found");
//         }

//         const user_id = req.session?.c_id; // Optional: Get user_id from session if available

//         // Check if the product is in the user's cart
//         const checkCart = user_id ? await UserCart.findOne({ user_id, product_id }) : null;

//         const obj = {
//             product: product_details, // Make sure 'product' is passed here
//             isLogin: user_id ? true : false,
//             in_cart: checkCart ? true : false
//         };

//         // Render the product_info.ejs view with the product data
//         res.render("user/product_info", obj);
//     } catch (error) {
//         console.error("Error fetching product info:", error);
//         res.status(500).send("Internal Server Error");
//     }
// });

//main code
// router.get("/product_info/:product_id?", async (req, res) => {
   
//     try {
//         const product_id = req.params.product_id;

//         // Find product details by product_id
//         const product_details = await Product.findById(product_id).populate('product_type_id').exec();
         
//         if (!product_details) {
           
//             return res.status(404).send('Product not found');
//         }


//     // try {
//     //     const products = await Product.find({}).populate('product_type_id');
        
//     //     res.render("user/product_info.ejs", { products });
//     // console.log(product_details);
//       //res.render('user/product_info.ejs', {product_details});

//         const user_id = req.session.c_id; // Assuming user session stores user ID

//         // Check if the product is in the user's cart
//         const checkCart = await UserCart.findOne({
//             user_id: user_id,
//             product_id: product_id
//         }).exec();

//         // Prepare the response object
//         const obj = {
//             product: product_details,
//             isLogin: req.session.c_id ? true : false,
//             in_cart: checkCart ? true : false
//         };

//         // Render the EJS template with the product data
//         res.render("user/product_info.ejs", obj);
//     } catch (err) {
//         console.error(err);
//         res.status(500).send('Server Error');
//     }
// });


router.get("/product_info/:product_id?", async (req, res) => {
    try {
        const product_id = req.params.product_id;
       // const product_id = req.session?.product_id; 
        // Log product_id to ensure it is coming through
        console.log("Product ID:", product_id);

        // Validate if product_id exists
        if (!product_id) {
            return res.status(400).send('Product ID is required');
        }

        // Find product details by product_id using findById
        const product_details = await Product.findById(product_id).populate('product_type_id').exec();

        // Log the product details to ensure it is fetched correctly
        console.log("Product Details:", product_details);

        if (!product_details) {
            return res.status(404).send('Product not found');
        }

        const user_id = req.session?.c_id; // Assuming user session stores user ID

        // Log the user ID to ensure session is working
        console.log("User ID:", user_id);

        // Check if the product is in the user's cart
        // let checkCart = null;
        let checkCart;
        if (user_id) {
            checkCart = await UserCart.findOne({
                user_id: user_id,
                product_id: product_id
            }).exec();
        }

        // Log the cart check result
        console.log("Cart Check:", checkCart);

        // Prepare the response object
        const obj = {
            product: product_details,
            isLogin: user_id ? true : false,
            in_cart: checkCart ? true : false
        };

        // Log the object before rendering
        console.log("Response Object:", obj);

        // Render the EJS template with the product data
        res.render("user/product_info.ejs", obj);
    } catch (err) {
        console.error("Error fetching product details:", err);
        res.status(500).send('Server Error');
    }
});

// router.get("/product_info/:product_id", async (req, res) => {
//     try {
//         const product_id = req.params.product_id;
//         console.log("Product ID:", product_id);  // Debugging

//         // Validate if product_id is a valid ObjectId
//         if (!mongoose.Types.ObjectId.isValid(product_id)) {
//             return res.status(400).send("Invalid product ID");
//         }

//         // Fetch product details and populate the product_type
//         const product_details = await Product.findById(product_id).populate('product_type_id').exec();
//         console.log("Product Details:", product_details);  // Debugging

//         if (!product_details) {
//             return res.status(404).send("Product not found");
//         }

//         const user_id = req.session?.c_id;  // Optional: Get user_id from session if available
//         console.log("User ID:", user_id);  // Debugging

//         // Check if the product is in the user's cart
//         const checkCart = user_id ? await UserCart.findOne({ user_id, product_id }) : null;

//         const obj = {
//             product: product_details,
//             isLogin: user_id ? true : false,
//             in_cart: checkCart ? true : false
//         };

//         // Render the product info page with product details
//         res.render("user/product_info.ejs", obj);
//     } catch (error) {
//         console.error("Error fetching product info:", error);
//         res.status(500).send("Internal Server Error");
//     }
// });



router.get("/add_to_cart/:product_id?", async (req, res) => {
    const user_id = req.session.c_id;  // Fetch user_id from session
    console.log(user_id);
    const product_id = req.params.product_id;  // Fetch product_id from URL parameters
    console.log(product_id);
    const qty = 1;

    // Check if both user_id and product_id are present
    if (!product_id || !user_id) {
        return res.status(400).send("User ID and Product ID are required.");
    }

    try {
        // Check if the product is already in the user's cart
        const cartItem = await UserCart.findOne({ user_id, product_id });

        if (!cartItem) {
            // Create a new cart item if it doesn't already exist
            const newCartItem = new UserCart({ user_id, product_id, qty });
            await newCartItem.save();
        } else {
            // If the item exists in the cart, increment the quantity
            cartItem.qty += 1;
            await cartItem.save();
        }

        // Redirect to the product info page
        res.redirect(`/product_info/${product_id}`);  // Corrected redirect URL
    } catch (error) {
        console.error("Error while adding to cart:", error);
        res.status(500).send("An error occurred while adding to the cart. Please try again.");
    }
});




// router.get("/cart", async function(req, res) {
//     // const user_id = req.session.c_id;

//     try {
//         const user_id = req.session.c_id;
//         // Fetch products from the user's cart and populate the product details
//         const cart_products = await UserCart.find({ user_id })
//             .populate('product_id')
//             .exec();

//         let obj = {
//             "isLogin": req.session.c_id ? true : false,
//             "products": cart_products.map(cartItem => {
//                 return {
//                     ...cartItem.product_id.toObject(),
//                     qty: cartItem.qty,
//                     cart_id: cartItem._id // for easier identification in the view
//                 };
//             })
//         };

//         res.render("user/cart.ejs", obj);
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Server Error');
//     }
// });



router.get("/cart", async function(req, res) {
    try {
        const user_id = req.session.c_id;
//console.log("userid",user_id);

        // Fetch products from the user's cart and populate the product details
        const cart_products = await UserCart.find({ user_id })
        .populate('product_id') // Correct path to populate
        .exec();
    

       // console.log(cart_products);

        // Ensure products is an array and map through it
        const products = cart_products
        ? cart_products
            .filter(cartItem => cartItem.product_id)
            .map(cartItem => ({
                ...cartItem.product_id.toObject(),
                qty: cartItem.quantity,
                cart_id: cartItem._id
            }))
        : [];
      // console.log("products:",products);
// let obj;
// if(products){


        // Set up the response object
        let obj = {
            isLogin: !!req.session.c_id,
            products: products
        };
        console.log(obj);
   // }

// const isLogin= !!req.session.c_id ? true : false;
// console.log(isLogin);
// console.log(products);
        res.render("user/cart.ejs", obj);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});



// router.get("/cart", async function(req, res) {
//     try {
//         const user_id = req.session.c_id; // Assuming session contains user ID

//         // Fetch cart items for the logged-in user, populating product details
//         const cart_products = await UserCart.find({ user_id })
//             .populate('product_id') // Populate product details from Product collection
//             .exec();

//         // Create an array of products with cart details
//         const products = cart_products.map(cartItem => ({
//             product: cartItem.product_id, // Product details
//             qty: cartItem.qty,            // Quantity in the cart
//             cart_id: cartItem._id          // Cart item ID
//         }));

//         const obj = {
//             isLogin: !!req.session.c_id, // Check if user is logged in
//             products: products            // Send products to the view
//         };

//         res.render('user/cart.ejs', obj); // Render the cart page with product details
//     } catch (error) {
//         console.error("Error fetching cart items:", error);
//         res.status(500).send("An error occurred while fetching the cart. Please try again.");
//     }
// });


// Route to decrease the quantity of a product in the cart
router.get('/decrease_qty/:cart_id', async function (req, res) {
    const cart_id = req.params.cart_id;
//console.log("cart",cart_id);
    try {
        // Find the cart item by its ID
        const cartItem = await UserCart.findById(cart_id);

        if (!cartItem) {
            return res.status(404).json({ error: 'Cart item not found' });
        }

        // Ensure that the quantity is greater than 1 before decrementing
        if (cartItem.quantity > 1) {
            cartItem.quantity -= 1;
            await cartItem.save();

            // Fetch the product details associated with the cart item
            const product = await Product.findById(cartItem.product_id);

            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }

            // Calculate the updated total price
            const total = cartItem.quantity * product.product_price;

            res.json({ new_qty: cartItem.quantity, total });
        } else {
            res.status(400).json({ error: 'Cannot decrease quantity below 1' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});


// Route to increase the quantity of a product in the cart
router.get('/increase_qty/:cart_id', async function (req, res) {
    const cart_id = req.params.cart_id;

    try {
        const cartItem = await UserCart.findById(cart_id);

        if (cartItem) {
            cartItem.quantity += 1;
            await cartItem.save();

            const product = await Product.findById(cartItem.product_id);
            const total = cartItem.quantity * product.product_price;

            res.json({ new_qty: cartItem.quantity, total });
        } else {
            res.status(404).json({ error: 'Cart item not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});


router.get("/delete_from_cart/:id",async function(req, res){
    const cart_id = req.params.id;

    // Delete the cart item
    await UserCart.findByIdAndDelete(cart_id);

    res.redirect("/cart");
});


router.get("/checkout",async (req, res) => {
    const user_id = req.session.c_id;
    //console.log("userid",user_id);
    try {
        // Fetch user's cart products and populate product details
        const cart_products = await UserCart.find({ user_id }).populate('product_id').exec();
       //console.log("products",cart_products);
        const obj = {
            "cart_products": cart_products,
            "isLogin": req.session.c_id ? true : false
        };

        res.render("user/checkout.ejs", obj);
    } catch (error) {
        console.error("Error fetching cart products:", error);
        res.status(500).send("Internal Server Error");
    }
});


// Place Order
// router.post("/place_order", async (req, res) => {
//     try {
//         const userId = req.session.c_id;
//        // console.log("User ID from session:", userId);

//         req.body.order_date = new Date().toISOString().slice(0, 10);
//         let d = req.body;
//         let order_status = 'pending';

//         if (d.payment_mode === 'online') {
//             order_status = 'payment_pending';
//         }

//         // Create the new order
//         const newOrder = new Order({
//             user_id: userId,
//             country: d.c_country,
//             c_fname: d.c_fname,
//             c_lname: d.c_lname,
//             c_address: d.c_address,
//             c_area: d.c_area,
//             c_state: d.c_state,
//             c_postal_zip: d.c_postal_zip,
//             c_email: d.c_email,
//             c_phone: d.c_phone,
//             payment_mode: d.payment_mode,
//             order_date: d.order_date,
//             order_status: order_status,
//             payment_status: 'pending',
//         });

//         const savedOrder = await newOrder.save();

//         // Fetch user's cart items
//         const cart_products = await UserCart.find({ user_id: userId }).exec();
//         console.log("Cart Products:", cart_products); // Log fetched cart products

//         if (cart_products.length === 0) {
//             return res.status(400).send("Cart is empty. Cannot place an order.");
//         }

//         // Check and save each cart product as an order product
//         for (let product of cart_products) {
//             // Ensure product price is available
//             if (!product.product_price) {
//                 console.error(`Product price missing for product_id: ${product.product_id}`);
//                 continue; // Skip this product if price is missing
//             }

//             let orderProduct = new OrderProduct({
//                 order_id: savedOrder._id,
//                 user_id: userId,
//                 product_id: product.product_id,
//                 product_qty: product.quantity,
//                 product_price: product.product_price, // Ensure this is defined
//                 product_name: product.product_name,
//                 product_details: product.product_details,
//             });

//             await orderProduct.save();
//         }

//         // Optionally, clear the cart after placing the order
//         await Cart.deleteMany({ user_id: userId });

//         res.status(200).send("Order placed successfully");
//     } catch (error) {
//         console.error("Error placing order:", error);
//         res.status(500).send("Internal Server Error");
//     }
// });



router.post("/place_order", async (req, res) => {
    try {
        const userId = req.session.c_id; // Ensure session contains user ID

        // Set order date and status
        req.body.order_date = new Date().toISOString().slice(0, 10);
        let d = req.body;
        let order_status = d.payment_mode === 'online' ? 'payment_pending' : 'pending';

        // Create the new order
        const newOrder = new Order({
            user_id: userId,
            country: d.c_country,
            c_fname: d.c_fname,
            c_lname: d.c_lname,
            c_address: d.c_address,
            c_area: d.c_area,
            c_state: d.c_state,
            c_postal_zip: d.c_postal_zip,
            c_email: d.c_email,
            c_phone: d.c_phone,
            payment_mode: d.payment_mode,
            order_date: d.order_date,
            order_status: order_status,
            payment_status: 'pending',
        });

        const savedOrder = await newOrder.save();

        // Fetch user's cart items and populate product details
        const cart_products = await UserCart.find({ user_id: userId }).populate('product_id').exec();

        console.log("Cart Products:", cart_products); // Log fetched cart products

        if (cart_products.length === 0) {
            return res.status(400).send("Cart is empty. Cannot place an order.");
        }

        // Loop over each cart product and process the order
        for (let item of cart_products) {
            const product = item.product_id; // Populated product details
           
            // Ensure product price is available
            if (!product || !product.product_price) {
                console.error(`Product price missing for product_id: ${product._id}`);
                continue; // Skip this product if price is missing
            }
            //console.log(product_price);

            // Create order product details
            let orderProduct = new OrderProduct({
                order_id: savedOrder._id,
                user_id: userId,
                product_id: product._id,
                product_qty: item.quantity,
                product_price: product.product_price, // Use populated product price
                product_name: product.product_name,
                product_details: product.product_details,
            });
           // console.log(product_price);
          // console.log("order product",orderProduct);
            // Save each order product
            await orderProduct.save();
            //console.log("order product",orderProduct);

        }

        // Optionally, clear the cart after placing the order
        //await UserCart.deleteMany({ user_id: userId });

        res.status(200).send("Order placed successfully");
    } catch (error) {
        console.error("Error placing order:", error);
        res.status(500).send("Internal Server Error");
    }
});




router.get("/pay_payment/:order_id", async (req, res) => {
    try {
        // Fetch order products details by order_id
        const orderDetails = await OrderProduct.find({ order_id: req.params.order_id });
        
        // Calculate subtotal
        let subtotal = 0;
        orderDetails.forEach(product => {
            subtotal += product.product_price * product.product_qty;
        });
        
        // Calculate discount and GST
        const discount = Number(subtotal * 0.2).toFixed(0);
        const gst = Math.ceil((subtotal - discount) * 0.12);
        const total = Math.ceil(subtotal - discount + gst);
        
        // Pass details to EJS template
        const obj = {
            "order_id": req.params.order_id,
            "order_details": orderDetails[0], // assuming there's only one unique order_id in the orderDetails array
            "total": total,
        };
        
        res.render("user/pay_payment.ejs", obj);
    } catch (error) {
        console.error("Error fetching order details:", error);
        res.status(500).send("Internal Server Error");
    }
});


router.post("/payment_success/:order_id", async (req, res) => {
    try {
        const order_id = req.params.order_id;
        const transaction_id = req.body.razorpay_payment_id;
        const today = new Date().toISOString().slice(0, 10);

        await Order.findByIdAndUpdate(order_id, {
            order_status: 'completed', // Update status to completed or as needed
            payment_status: 'complete',
            transaction_id: transaction_id,
            payment_date: today,
        });

        res.redirect("/my_orders");
    } catch (error) {
        console.error("Error processing payment success:", error);
        res.status(500).send("Internal Server Error");
    }
});


// router.get("/my_orders", async (req, res) => {
//     try {
//         // Fetch all orders for the logged-in user, except those with 'payment_pending'
//         const orders = await Order.find({ user_id: req.session.c_id, order_status: { $ne: 'payment_pending' } });
//         console.log("orders",orders);

//         // Calculate total amount for each order by summing the price * quantity of each product
//         for (let order of orders) {
//             const orderProducts = await OrderProduct.find({ order_id: order._id });
//             console.log("order product",orderProducts);

//             // Calculate total amount for the order
//             let total_amt = 0;
//             for (let product of orderProducts) {
//                 total_amt += product.product_price * product.product_qty;
//             }
            
//             // Add total amount to the order object
//             order.total_amt = total_amt;
//         }

//         const obj = {
//             "isLogin": req.session.c_id ? true : false,
//             "orders": orders,
//         };

//         // Render the my_orders.ejs template and pass the orders with total amounts
//         res.render("user/my_orders.ejs", obj);
//     } catch (error) {
//         console.error("Error fetching orders:", error);
//         res.status(500).send("Internal Server Error");
//     }
// });



router.get("/my_orders", async (req, res) => {
    try {
        // Fetch all orders for the logged-in user, except those with 'payment_pending'
        const orders = await Order.find({ user_id: req.session.c_id, order_status: { $ne: 'payment_pending' } });

        for (let order of orders) {
            // Fetch associated products for each order
            const orderProducts = await OrderProduct.find({ order_id: order._id }); // Ensure this correctly retrieves products
            console.log("order product", orderProducts); // Check the output in the console

            // Calculate total amount for the order
            let total_amt = 0;
            for (let product of orderProducts) {
                total_amt += product.product_price * product.product_qty;
            }
            
            // Add total amount to the order object
            order.total_amt = total_amt;
        }

        const obj = {
            "isLogin": req.session.c_id ? true : false,
            "orders": orders,
        };

        // Render the my_orders.ejs template and pass the orders with total amounts
        res.render("user/my_orders.ejs", obj);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).send("Internal Server Error");
    }
});



router.get("/print_order/:id", async (req, res) => {
    const orderId = req.params.id;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
        return res.status(400).send('Invalid Order ID');
    }

    try {
        const order_products = await OrderProduct.find({ order_id: orderId });
        const order_details = await Order.findById(orderId);

        // Calculate subtotal
        let subtotal = 0;
        for (let product of order_products) {
            subtotal += product.product_price * product.product_qty;
        }

        // Calculate discount (20%)
        const discount = Number(subtotal * 0.2).toFixed(2);

        // Calculate GST (12%)
        const gst = Number((subtotal - discount) * 0.12).toFixed(2);

        // Calculate total
        const total = (subtotal - discount + Number(gst)).toFixed(2);

        const obj = {
            "order_products": order_products,
            "order_details": order_details,
            "subtotal": subtotal,
            "discount": discount,
            "gst": gst,
            "total": total,
            "isLogin": req.session.c_id ? true : false,
        };

        res.render("user/print_order.ejs", obj);
    } catch (error) {
        console.error("Error fetching order:", error);
        res.status(500).send('Internal Server Error');
    }
});


router.get("/profile", async (req, res) => {
    if (!req.session.c_id) {
        return res.redirect("/login");  // Redirect to login if session ID is not set
    }

    try {
        const user = await User.findById(req.session.c_id); // Fetch user by session ID
        if (!user) {
            console.error("User not found with ID:", req.session.c_id);  // Debug log if user not found
            return res.status(404).send("User not found");
        }

        const obj = {
            isLogin: !!req.session.c_id,  // Check if the user is logged in
            user: user,  // Pass user data to the view
        };

        res.render("user/profile_page.ejs", obj);  // Render profile page with user data
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).send("Server error");
    }
});



router.get("/edit_profile", async (req, res) => {
    try {
        const user = await User.findById(req.session.c_id); // Fetch user by session ID
        if (!user) {
            return res.status(404).send("User not found");
        }

        const obj = {
            isLogin: !!req.session.c_id,  // Ensure logged in status
            user: user,  // Pass user object to the view
        };

        res.render("user/edit_profile.ejs", obj);  // Render the edit profile page with user data
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).send("Server error");
    }
});



router.post("/update_profile", async (req, res) => {
    try {
        const d = req.body;

        await User.findByIdAndUpdate(req.session.c_id, {
            c_name: d.c_name,
            c_email: d.c_email,
            c_mobile: d.c_mobile,
        });

        res.redirect("/profile");
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).send("Server error");
    }
});


router.get("/logout", (req, res) => {
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                console.error("Error destroying session:", err);
                return res.status(500).send("Server error");
            }
            res.redirect("/");
        });
    } else {
        res.redirect("/");
    }
});




module.exports = router;

   
