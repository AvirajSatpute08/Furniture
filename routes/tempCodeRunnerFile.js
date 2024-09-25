router.get('/product_info/:product_id', async (req, res) => {
    try {
        const product_id = req.params.product_id;

        // Find product details by product_id
        const product_details = await Product.findById(product_id).populate('product_type_id').exec();
         
        if (!product_details) {
           
            return res.status(404).send('Product not found');
        }