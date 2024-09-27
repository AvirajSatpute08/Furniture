const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require('fs');
//const bcrypt = require('bcryptjs');
const router = express.Router();
const upload = require('../middleware/multerConfig');
const ModernInterior = require('../models/ModernInterior');
const Testimonial = require('../models/Testimonial');
const Blog = require('../models/Blog');
//const checkAdminLogin = require('../middleware/checkAdminLogin').default;
//const checkUserLogin = require('../middleware/checkUserLogin');
const Owner = require('../models/Owner');
const Newsletter = require('../models/Newsletter');
const ContactUs = require('../models/ContactUs');
const Order = require('../models/Order');
const WhyChooseUs = require('../models/WhyChooseUs');
const WhyChooseUsPoint = require('../models/WhyChooseUsPoint');
const mongoose = require('mongoose');
//const ownerRoutes = require('./routes/ownerRoutes');


//const Product = require('../models/Product');
//const upload = multer({ dest: 'uploads/' }); 
//const { connectToCollection } = require('./connection');
//const sessionMiddleware = require('../middleware/sessionMiddleware');


const Banner = require('../models/Banner');
const ProductType = require('../models/ProductType');
const Product = require('../models/Product');

// Multer setup for file upload
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'public/uploads/');
//     },
//     filename: function (req, file, cb) {
//         cb(null, new Date().getTime() + path.extname(file.originalname));
//     }
// });
// const upload = multer({ storage: storage });

// function checkAdminLogin(req, res, next) {
//     if (req.session.admin_id != undefined) {
//         next();
//     } else {
//         res.send("<script>alert('Admin Login First'); location.href='/admin_login' </script>");
//     }
// }


router.get("/", async function (req, res) {
  try {
      const product_detail = await Product.find()
          .populate('product_type_id') // Assuming this field exists in your schema
          .sort({ _id: -1 })
          .limit(8);

      res.render("admin/home.ejs", { product_detail });
  } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
  }
});


router.get("/manage_banner",async function (req, res) {
  const banner_info = await Banner.find();
  res.render("admin/manage_banner.ejs", { banner_info });
});

// Route to save or update banner information
router.post("/save_banner", upload.single('banner_image'), async (req, res) => {
  const { banner_id, banner_title, banner_details, banner_link } = req.body;

  // Prepare the banner data
  const bannerData = {
      banner_title,
      banner_details,
      banner_link,
  };

  // Handle image upload if a new file is provided
  if (req.file) {
      bannerData.banner_image = req.file.filename;
  }

  try {
      // Check if we are updating or creating a new banner
      if (banner_id) {
          // Update existing banner
          await Banner.findByIdAndUpdate(banner_id, bannerData, { new: true });
      } else {
          // Create new banner
          const newBanner = new Banner(bannerData);
          await newBanner.save();
      }

      // Redirect back to banner management page
      res.redirect("/admin/manage_banner");

  } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
  }
});

router.get("/product_type",  async function (req, res) {
  const types = await ProductType.find();
  res.render("admin/product_type.ejs", { types });
});

// Route to save a new product type
router.post("/save_product_type",  async (req, res) => {
  const newType = new ProductType({
      product_type_name: req.body.product_type_name
  });
  await newType.save();
  res.redirect("/admin/product_type");
});



// Route to render the edit product type form
router.get("/edit_product_type/:id", async (req, res) => {
  try {
      const product_type = await ProductType.findById(req.params.id);
      if (!product_type) {
          return res.status(404).send('Product type not found');
      }
      res.render("admin/edit_product_type.ejs", { product_type });
  } catch (error) {
      res.status(500).send('Server error');
  }
});


// Route to handle updating a product type
router.post("/update_product_type", async (req, res) => {
  try {
      const { product_type_id, product_type_name } = req.body;
      
      const updatedType = await ProductType.findByIdAndUpdate(
          product_type_id,
          { product_type_name },
          { new: true, runValidators: true }
      );
      
      if (!updatedType) {
          return res.status(404).send('Product type not found');
      }
      
      res.redirect("/admin/product_type");
  } catch (error) {
      res.status(500).send('Server error');
  }
});



// Route to handle deleting a product type
router.get("/delete_product_type/:id", async (req, res) => {
  try {
      await ProductType.findByIdAndDelete(req.params.id);
      res.redirect("/admin/product_type");
  } catch (error) {
      res.status(500).send('Server error');
  }
});


router.post("/save_product_type", async (req, res) => {
  try {
      const { product_type_name } = req.body;

      const newProductType = new ProductType({
          product_type_name,
      });

      await newProductType.save();

      res.redirect("/admin/product_type");
  } catch (error) {
      res.status(500).send('Server error');
  }
});


// Route to render the form for adding a new product
router.get("/product", async function (req, res) {
  try {
      const types = await ProductType.find();
      res.render("admin/product.ejs", { types });
  } catch (error) {
      res.status(500).send('Server error');
  }
});

// Route to handle saving a new product
// router.post("/save_product",  upload.array('product_image'), async (req, res) => {
//   try {
//       const image_filenames = req.files.map(file => file.filename);

//       const newProduct = new Product({
//           product_type_id: req.body.product_type,
//           product_name: req.body.product_name,
//           product_price: req.body.product_price,
//           duplicate_price: req.body.duplicate_price,
//           product_size: req.body.product_size,
//           product_color: req.body.product_color,
//           product_label: req.body.product_label,
//           product_details: req.body.product_details.replace(/'/g, "`"),
//           product_image: image_filenames
//       });

//       await newProduct.save();
//       res.redirect("/admin/product");
//   } catch (error) {
//       res.status(500).send('Server error');
//   }
// });

// Route to save product
router.post("/save_product", upload.array('product_image'), async (req, res) => {
  try {
      // Destructure the required fields from the request body
      const { product_type, product_name, product_price, product_size, product_color, product_label, product_details, duplicate_price } = req.body;

      // Validate required fields
      if (!product_type || !product_name || !product_price) {
          return res.status(400).send('Missing required fields');
      }

      // Ensure product_type is a valid ObjectId
      const productTypeId = new mongoose.Types.ObjectId(product_type);

      // Handle file uploads (if applicable)
      const image_filenames = req.files ? req.files.map(file => file.filename) : [];

      // Create new product object
      const newProduct = new Product({
          product_type_id: productTypeId,
          product_name,
          product_price,
          duplicate_price: duplicate_price ? Number(duplicate_price) : undefined, // Make sure to convert string to number
          product_size,
          product_color,
          product_label,
          product_details: product_details.replace(/'/g, "`"), // Sanitize input
          product_image: image_filenames
      });

      // Save the product to the database
      await newProduct.save();
      res.redirect("/admin/product");

  } catch (error) {
      console.error("Error saving product:", error);
      res.status(500).send('Server error');
  }
});




// router.get("/product_list", async (req, res) => {
//   try {
//       const products = await Product.find().populate('product_type_id');
//       res.render("admin/product_list.ejs", { products });
//   } catch (error) {
//       res.status(500).send('Server error');
//   }
// });

// router.get("/product_list", async function (req, res) {
//   try {
//     const products = await Product.find({}).populate('product_type_id');
//     console.log("products",products)
//     res.render("admin/product_list.ejs", { products });
//   } catch (error) {
//     console.error("Error fetching products:", error);
//     res.status(500).send('Server error');
//   }
// });


router.get("/product_list", async function (req, res) {
  try {
    const products = await Product.find({}).populate('product_type_id');
    
    res.render("admin/product_list.ejs", { products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send('Server error');
  }
});



// Route to handle product update form rendering
// router.get("/edit_product/:id", async (req, res) => {
//   try {
//       const product_info = await Product.findById(req.params.id).populate('product_type_id');
//       const types = await ProductType.find();
//       res.render("admin/edit_product.ejs", { product_info, types });
//   } catch (error) {
//       res.status(500).send('Server error');
//   }
// });
router.get("/edit_product/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    
    // Fetch the product info by ID
    const product_info = await Product.findById(productId);
    
    // Fetch all product types to show in the dropdown
    const types = await ProductType.find();
    
    // Render the template, passing both product info and types
    res.render("admin/product_list.ejs", { product_info, types });
  } catch (err) {
    console.error("Error fetching product or product types:", err);
    res.status(500).send("Internal Server Error");
  }
});



// Route to handle product updates
router.post("/update_product", upload.array('product_image'), async (req, res) => {
  try {
    const product_id = req.body.product_id;

    // Validate the product_id
    if (!product_id || !mongoose.Types.ObjectId.isValid(product_id)) {
      return res.status(400).send('Invalid product ID');
    }

    const image_filenames = req.files ? req.files.map(file => file.filename) : [];
    
    const updatedProduct = {
      product_type_id: req.body.product_type_id,
      product_name: req.body.product_name,
      product_price: req.body.product_price,
      duplicate_price: req.body.duplicate_price,
      product_size: req.body.product_size,
      product_color: req.body.product_color,
      product_label: req.body.product_label,
      product_details: req.body.product_details.replace(/'/g, "`"),
    };
    
    // Add new images to existing ones
    if (image_filenames.length > 0) {
      const existingProduct = await Product.findById(product_id);
      if (!existingProduct) {
        return res.status(404).send('Product not found');
      }
      updatedProduct.product_image = existingProduct.product_image.concat(image_filenames);
    }

    // Update the product in the database
    await Product.findByIdAndUpdate(product_id, updatedProduct);
    res.redirect("/admin/product_list");
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).send('Server error');
  }
});


// Route to handle product image deletion
router.get("/delete_product_image/:product_id/:image_name", async (req, res) => {
  try {
    const { product_id, image_name } = req.params;

    // Validate product_id
    if (!product_id || !mongoose.Types.ObjectId.isValid(product_id)) {
      return res.status(400).send('Invalid product ID');
    }

    // Find product
    const product = await Product.findById(product_id);
    if (!product) {
      return res.status(404).send('Product not found');
    }

    // Update product images
    const updatedImages = product.product_image.filter(image => image !== image_name);
    await Product.findByIdAndUpdate(product_id, { product_image: updatedImages });

    // Delete image file
    const imagePath = path.join(__dirname, '..', 'uploads', image_name);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath); // Delete the image file
    }

    res.redirect(`/admin/edit_product/${product_id}`);
  } catch (error) {
    console.error("Error deleting product image:", error);
    res.status(500).send('Server error');
  }
});


// Delete product
// Delete product
router.get("/delete_product/:id", async (req, res) => {
  try {
    const productId = req.params.id;

    // Validate productId
    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).send('Invalid product ID');
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).send('Product not found');
    }

    await Product.findByIdAndDelete(productId);
    res.redirect("/admin/product_list");
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).send('Server error');
  }
});

// Search products
router.get("/product_search", async function (req, res) {
  try {
    const str = req.query.str || '';

    // Determine if the search string is a number
    const isNumber = !isNaN(str) && str.trim() !== '';
    const numericQuery = isNumber ? parseFloat(str) : null;

    // Build query conditions
    const query = {
      $or: [
        { product_name: new RegExp(str, 'i') },
        { product_size: new RegExp(str, 'i') },
        { product_label: new RegExp(str, 'i') },
        { product_details: new RegExp(str, 'i') }
      ]
    };

    // Add numeric condition if the search string is a number
    if (numericQuery !== null) {
      query.$or.push({ product_price: numericQuery });
    }

    const products = await Product.find(query).populate('product_type_id');
    
    res.render("admin/product_list.ejs", { products });
  } catch (error) {
    console.error("Error searching products:", error);
    res.status(500).send('Server error');
  }
});


// Why Choose Us Heading
// router.get("/why_choose_us_heading", async (req, res) => {
//   try {
//       const wcu_info = await WhyChooseUs.findOne();
//       res.render("admin/whyChooseUsHeading.ejs", { wcu_info });
//   } catch (error) {
//       res.status(500).send('Server error');
//   }
// });


router.get("/why_choose_us_heading", async (req, res) => {
  try {
      // Fetch a single document from the 'WhyChooseUs' collection
      const wcu_info = await WhyChooseUs.findOne();

      // Check if wcu_info exists before rendering
      if (!wcu_info) {
          return res.status(404).send('Why Choose Us heading not found');
      }

      // Render the EJS view, passing the retrieved info
      res.render("admin/whyChooseUsHeading", { wcu_info }); 
  } catch (error) {
      console.error("Error fetching 'Why Choose Us' heading:", error);
      res.status(500).send('Server error');
  }
});


router.post("/save_why_choose_us",  async (req, res) => {
  try {
      const { wcu_heading, wcu_details } = req.body;
      await WhyChooseUs.findOneAndUpdate({}, { wcu_heading, wcu_details }, { upsert: true });
      res.redirect("/admin/why_choose_us_heading");
  } catch (error) {
      res.status(500).send('Server error');
  }
});


// // Why Choose Us Points
// router.get("/why_choose_us_points", async (req, res) => {
//   const points = await WhyChooseUsPoint.find();
//   res.render("admin/whyChooseUsPoint.ejs", { points });
// });

// router.post("/save_why_choose_us_points", upload.single('wcup_image'), async (req, res) => {
//   const { heading, description } = req.body;
//   if (!heading || !description) {
//     return res.status(400).send('Heading and description are required.');
//   }

//   const wcup_image = req.file ? req.file.filename : undefined;

//   const newPoint = new WhyChooseUsPoint({
//       heading,
//       description,
//       wcup_image
//   });
//   await newPoint.save();
//   res.redirect("/admin/why_choose_us_points");
// });


// router.get("/delete_point/:id", async (req, res) => {
//   await WhyChooseUsPoint.findByIdAndDelete(req.params.id);
//   res.redirect("/admin/why_choose_us_points");
// });

// router.get("/edit_point/:id", async (req, res) => {
//   const wcup = await WhyChooseUsPoint.findById(req.params.id);
//   res.render("admin/edit_whyChooseUsPoint.ejs", { wcup });
// });

// router.post("/update_why_choose_us_points", upload.single('wcup_image'), async (req, res) => {
//   const { wcup_id, heading, description } = req.body;
//   if (!heading || !description) {
//     return res.status(400).send('Heading and description are required.');
//   }

//   const wcup_image = req.file ? req.file.filename : undefined;

//   await WhyChooseUsPoint.findByIdAndUpdate(wcup_id, {
//       heading,
//       description,
//       wcup_image
//   }, { new: true });

//   res.redirect("/admin/why_choose_us_points");
// });

// Why Choose Us Points

// Display the points
router.get("/why_choose_us_points", async (req, res) => {
  const points = await WhyChooseUsPoint.find();
  res.render("admin/whyChooseUsPoint.ejs", { points });
});

// Save new points
router.post("/save_why_choose_us_points", upload.single('wcup_image'), async (req, res) => {
  const { wcup_name, wcup_details } = req.body;
  
  // Validate input
  if (!wcup_name || !wcup_details) {
    return res.status(400).send('Name and details are required.');
  }

  // Handle image upload
  const wcup_image = req.file ? req.file.filename : undefined;

  // Create new point
  const newPoint = new WhyChooseUsPoint({
      heading: wcup_name,
      description: wcup_details,
      wcup_image
  });

  // Save and redirect
  await newPoint.save();
  res.redirect("/admin/why_choose_us_points");
});

// Delete point
router.get("/delete_point/:id", async (req, res) => {
  await WhyChooseUsPoint.findByIdAndDelete(req.params.id);
  res.redirect("/admin/why_choose_us_points");
});

// Edit point
// Route to render the edit page
router.get("/edit_point/:id", async (req, res) => {
  try {
    const wcup = await WhyChooseUsPoint.findById(req.params.id);
    if (!wcup) {
      return res.status(404).send('Why Choose Us Point not found');
    }
    res.render("admin/edit_whyChooseUsPoint.ejs", { wcup }); // Pass wcup as an object
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Update point
router.post("/update_why_choose_us_points", upload.single('wcup_image'), async (req, res) => {
  const { wcup_id, wcup_name, wcup_details } = req.body;

  // Validate input
  if (!wcup_name || !wcup_details) {
    return res.status(400).send('Name and details are required.');
  }

  // Handle image upload
  const wcup_image = req.file ? req.file.filename : undefined;

  try {
    // Update the point
    await WhyChooseUsPoint.findByIdAndUpdate(wcup_id, {
      heading: wcup_name,
      description: wcup_details,
      wcup_image
    }, { new: true });

    // Redirect
    res.redirect("/admin/why_choose_us_points");
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});




// modern Interior Banner

router.get('/modern_interior', async (req, res) => {
  try {
    const modern_data = await ModernInterior.find();
    if (modern_data.length === 0) {
      // Handle the case where no data is found
      return res.render('admin/modern_interior.ejs', { modern_data: [] });
    }
    res.render('admin/modern_interior.ejs', { modern_data });
  } catch (error) {
    console.error("Error fetching modern interior data:", error);
    res.status(500).send('Server error');
  }
});


// Route to update Modern Interior data
router.post('/update_modern_interior', upload.fields([
  { name: 'image1', maxCount: 1 },
  { name: 'image2', maxCount: 1 },
  { name: 'image3', maxCount: 1 }
]), async (req, res) => {
  try {
    const d = req.body;

    if (!d.id || !mongoose.Types.ObjectId.isValid(d.id)) {
      return res.status(400).send('Invalid ID');
    }

    const updates = {};

    if (req.files) {
      if (req.files.image1) {
        updates.image1 = req.files.image1[0].filename;
      }
      if (req.files.image2) {
        updates.image2 = req.files.image2[0].filename;
      }
      if (req.files.image3) {
        updates.image3 = req.files.image3[0].filename;
      }
    }

    await ModernInterior.updateOne({ _id: d.id }, {
      $set: {
        heading: d.heading,
        details: d.details,
        key_point1: d.key_point1,
        key_point2: d.key_point2,
        key_point3: d.key_point3,
        key_point4: d.key_point4,
        ...updates
      }
    });

    res.redirect('/admin/modern_interior');
  } catch (error) {
    console.error("Error updating modern interior data:", error);
    res.status(500).send('Server error');
  }
});

// end Modern Interior


// testimonial start
// Route to list testimonials
router.get('/testimonial', async (req, res) => {
  try {
    const testimonials = await Testimonial.find();
    res.render('admin/testimonial.ejs', { testimonial: testimonials });
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    res.status(500).send('Server error');
  }
});

// Route to save a testimonial
router.post('/save_testimonial', upload.single('c_image'), async (req, res) => {
  try {
    const d = req.body;
    const c_image = req.file ? req.file.filename : '';

    await Testimonial.create({
      c_name: d.c_name,
      c_position: d.c_position,
      c_message: d.c_message,
      c_image
    });

    res.redirect('/admin/testimonial');
  } catch (error) {
    console.error("Error saving testimonial:", error);
    res.status(500).send('Server error');
  }
});

// Route to delete a testimonial
router.get('/delete_testimonial/:id', async (req, res) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);
    res.redirect('/admin/testimonial');
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    res.status(500).send('Server error');
  }
});

// Route to edit a testimonial
router.get('/edit_testimonial/:id', async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    res.render('admin/edit_testimonial.ejs', { testimonial });
  } catch (error) {
    console.error("Error fetching testimonial for edit:", error);
    res.status(500).send('Server error');
  }
});

// Route to update a testimonial
router.post('/update_testimonial', upload.single('c_image'), async (req, res) => {
  try {
    const d = req.body;
    const c_id = d.c_id;
    let c_image = d.old_image; // Preserve old image if no new image is provided

    if (req.file) {
      c_image = req.file.filename;
    }

    await Testimonial.findByIdAndUpdate(c_id, {
      c_name: d.c_name,
      c_position: d.c_position,
      c_message: d.c_message,
      c_image
    });

    res.redirect('/admin/testimonial');
  } catch (error) {
    console.error("Error updating testimonial:", error);
    res.status(500).send('Server error');
  }
});
// end testimonial 



// start blogs
// Route to render the blogs page
router.get('/blogs', (req, res) => {
  res.render('admin/blogs.ejs');
});

// Route to save a new blog
router.post('/save_blogs',  upload.single('blog_image'), async (req, res) => {
  const d = req.body;
  let blogImage = '';

  // Handle the file upload
  if (req.file) {
      blogImage = req.file.filename; // Use the new file's name
  }

  await Blog.create({
      blog_title: d.blog_title,
      blog_date: d.blog_date,
      blog_time: d.blog_time,
      blogPostBy: d.blogPostBy,
      blogPostByPosition: d.blogPostByPosition,
      blog_image: blogImage,
      blog_details: d.blog_details
  });

  res.redirect('/admin/blogs');
});
  
  // Route to display the list of blogs
router.get('/blog_list',  async (req, res) => {
  try {
      const blogs = await Blog.find();
      res.render('admin/blog_list.ejs', { blogs });
  } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
  }
});

// Route to delete a blog
router.get('/delete_blog/:id', async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id); // Use findByIdAndDelete for consistency
    res.redirect('/admin/blog_list');
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).send('Server Error');
  }
});


  // Route to display the edit blog form
  router.get('/edit_blog/:id', async (req, res) => {
    try {
      const blog = await Blog.findById(req.params.id);
      if (!blog) {
        return res.status(404).send('Blog not found');
      }
      res.render('admin/edit_blog.ejs', { blogs: [blog] }); // Pass blog as an array
    } catch (error) {
      console.error("Error fetching blog for edit:", error);
      res.status(500).send('Server Error');
    }
  });
  
  

// Route to handle the update blog form submission
router.post('/update_blog', upload.single('blog_image'), async (req, res) => {
  try {
    const { blog_id, blog_title, blog_date, blog_time, blogPostBy, blogPostByPosition, blog_details } = req.body;
    const updateData = {
      blog_title,
      blog_date,
      blog_time,
      blogPostBy,
      blogPostByPosition,
      blog_details
    };

    // Check if a new image was uploaded
    if (req.file) {
      updateData.blog_image = req.file.filename;
    }

    await Blog.findByIdAndUpdate(blog_id, updateData, { new: true });
    res.redirect('/admin/blog_list');
  } catch (error) {
    console.error("Error updating blog:", error);
    res.status(500).send('Server Error');
  }
});


// end Blogs 


// Start Team 
// Route to display add team member form and list of team members
router.get('/addTeam',  async (req, res) => {
  try {
      const owners = await Owner.find();
      res.render('admin/owner.ejs', { owner: owners });
  } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
  }
});
  
 
// Route to save a new team member
router.post('/save_team',  upload.single('team_image'), async (req, res) => {
  try {
      const { team_name, team_position, team_details, profile_link } = req.body;
      const team_image = req.file ? req.file.filename : '';

      await Owner.create({
          team_name,
          team_position,
          owner_details: team_details,
          profile_link,
          team_image
      });

      res.redirect('/admin/addTeam');
  } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
  }
});

  
  // Route to edit a team member (show edit form)
  router.get('/edit_owner/:id', async (req, res) => {
    try {
        const owner = await owner.findById(req.params.id);
        if (!owner) {
            return res.status(404).send('Owner not found');
        }
        res.render('admin/addTeam', { owner });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

router.post('/update_team', upload.single('owner_image'), async (req, res) => {
    try {
        const { owner_id, team_name, team_position, owner_details, profile_link } = req.body;

        // Validate input
        if (!owner_id || !team_name || !team_position || !owner_details || !profile_link) {
            return res.status(400).send('All fields are required.');
        }

        const updates = {
            team_name,
            team_position,
            owner_details,
            profile_link,
        };

        // Check if file is uploaded
        if (req.file) {
            const team_image = new Date().getTime() + path.extname(req.file.originalname);
            const uploadPath = path.join(__dirname, '../public/uploads/', team_image);
            req.file.mv(uploadPath, (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Error uploading file.');
                }
            });
            updates.team_image = team_image;
        }

        await Owner.updateOne({ _id: owner_id }, { $set: updates });

        res.redirect('/admin/addTeam');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

router.get('/delete_owner/:id', async (req, res) => {
    try {
        await Owner.deleteOne({ _id: req.params.id });
        res.redirect('/admin/edit_owner.ejs');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});



// Fetch contact entries
router.get('/contactus',  async (req, res) => {
  try {
    const contactus = await ContactUs.find();
    res.render('admin/contactUs.ejs', { contactus });
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// Delete a contact entry
router.get('/deleteContactUs/:id',  async (req, res) => {
  try {
    await ContactUs.deleteOne({ _id: req.params.id });
    res.redirect('/admin/contactus');
  } catch (error) {
    res.status(500).send('Server error');
  }
});


router.get('/newsletter', async (req, res) => {
  try {
      const newsletter = await Newsletter.find();
      res.render('admin/newsletter', { newsletter }); // Ensure 'newsletter' is the same key used in the EJS template
  } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
  }
});


// Delete a newsletter entry
// Route to delete a newsletter
router.get('/deleteNewsLetter/:id', async (req, res) => {
  try {
      await Newsletter.deleteOne({ _id: req.params.id });
      res.redirect('/admin/newsletter');
  } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
  }
});


router.get('/pending_order',async (req, res) => {
  try {
    const orders = await Order.find({ status: 'pending' });
    res.render('admin/pending_order.ejs', { orders });
  } catch (error) {
    console.error('Error fetching pending orders:', error);
    res.status(500).send('Internal Server Error');
  }
});



 // View order details
router.get('/view_order/:id',  async (req, res) => {
  try {
    // Find the order by ID and populate related product details
    const order = await Order.findById(req.params.id).populate('items.product_id');
    
    // Ensure products are populated correctly
    const products = order.items.map(item => item.product_id);
    
    res.render('admin/view_order.ejs', { order_info: order, products });
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).send('Internal Server Error');
  }
});

  
  // Dispatch an order
router.get('/dispatch_order/:id',  async (req, res) => {
  try {
    await Order.findByIdAndUpdate(req.params.id, { status: 'dispatched' });
    res.redirect('/admin/pending_order');
  } catch (error) {
    console.error('Error dispatching order:', error);
    res.status(500).send('Internal Server Error');
  }
});

  
 // Get dispatched orders
router.get('/dispatch_order',  async (req, res) => {
  try {
    const orders = await Order.find({ status: 'dispatched' });
    res.render('admin/dispatch_order.ejs', { orders });
  } catch (error) {
    console.error('Error fetching dispatched orders:', error);
    res.status(500).send('Internal Server Error');
  }
});

  
  // Mark an order as delivered
  // Mark an order as delivered
router.get('/delivered_order/:id', async (req, res) => {
  try {
    await Order.findByIdAndUpdate(req.params.id, { status: 'delivered' });
    res.redirect('/admin/delivered_order'); // Redirect to the delivered orders page
  } catch (error) {
    console.error('Error marking order as delivered:', error);
    res.status(500).send('Internal Server Error');
  }
});

  
  // Get delivered orders
  // Get delivered orders
router.get('/delivered_order', async (req, res) => {
  try {
    const orders = await Order.find({ status: 'delivered' });
    res.render('admin/delivered_order.ejs', { orders });
  } catch (error) {
    console.error('Error fetching delivered orders:', error);
    res.status(500).send('Internal Server Error');
  }
});


router.get("/admin_logout", async(req, res)=>{
        if (req.session) {
            req.session.destroy();
        }
            res.redirect("/");  
});


module.exports = router;