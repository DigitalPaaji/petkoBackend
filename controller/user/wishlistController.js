import Cart from "../../model/cartModel.js";
import Wishlist from "../../model/wishlistModel.js";


export const addToWishlist = async (req, res) => {
  try {
    const { productid } = req.params;
    const user = req.user;

    if (!user || !productid) {
      return res
        .status(400)
        .json({ success: false, message: "User ID and Product ID are required" });
    }

    let wishlist = await Wishlist.findOne({ userid: user._id });

    if (!wishlist) {
      wishlist = new Wishlist({
        userid: user._id,
        productId: [productid],
      });
      await wishlist.save();

      return res.json({
        success: true,
        message: "Product added to wishlist",
        action: "added",
        wishlist,
      });
    }

    const exists = wishlist.productId.some(
      (id) => id.toString() === productid
    );

    if (exists) {
      wishlist.productId = wishlist.productId.filter(
        (id) => id.toString() !== productid
      );
      await wishlist.save();

      return res.json({
        success: true,
        message: "Product removed from wishlist",
        action: "removed",
        wishlist,
      });
    } else {
      wishlist.productId.push(productid);
      await wishlist.save();

      return res.json({
        success: true,
        message: "Product added to wishlist",
        action: "added",
        wishlist,
      });
    }
  } catch (error) {
    console.error("Error adding/removing wishlist:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error });
  }
};


export const moveTowishlist= async(req,res)=>{
  try {
    const {productid,cartid} = req.body;
    
const user = req.user;

    if (!user || !productid) {
      return res
        .status(400)
        .json({ success: false, message: "User ID and Product ID are required" });
    }

     let wishlist = await Wishlist.findOne({ userid: user._id });

     await Cart.findByIdAndDelete(cartid)
       


    if (!wishlist) {
      wishlist = new Wishlist({
        userid: user._id,
        productId: [productid],
      });
      await wishlist.save();

      return res.json({
        success: true,
        message: "Product added to wishlist",
        action: "added",
        wishlist,
      });
    }







     if (wishlist.productId.includes(productid)) {
     

      return res.json({
        success: true,
        message: "Product added to wishlist",
      });
    } else {
      wishlist.productId.push(productid);
      await wishlist.save();

      return res.json({
        success: true,
        message: "Product added to wishlist",
        action: "added",
        wishlist,
      });
    }





  } catch (error) {
    
  }
}


export const getWishlist = async (req, res) => {
  try {
    const user = req.user;

    const wishlist = await Wishlist.findOne({ userid: user._id }).exec();

    if (!wishlist) {
      return res
        .status(404)
        .json({ success: false, message: "Wishlist not found" });
    }

    return res.json({ success: true, data: wishlist });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getAllWishListItem= async(req,res)=>{
   try {
    const user = req.user;

    const wishlist = await Wishlist.findOne({ userid: user._id}).populate({ path: "productId",model:"Product" ,select: "name price comparePrice images slug shortDescription  "});

    if (!wishlist) {
      return res
        .status(200)
        .json({ success: false, message: "Wishlist not found" });
    }

    return res.json({ success: true, data: wishlist });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

export const clearWishlist = async (req, res) => {
  try {
    const user = req.user;

    const wishlist = await Wishlist.findOne({ userid: user._id });
    if (!wishlist) {
      return res
        .status(404)
        .json({ success: false, message: "Wishlist not found" });
    }

    wishlist.productId = [];
    await wishlist.save();

    return res.json({ success: true, message: "Wishlist cleared" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};




export const addToCartRemovetowishlist = async (req, res) => {
  try {
    const { productId, price } = req.body;
    const userId = req.user?._id; 

   
    if (!productId || !price   ) {
      return res.status(400).json({
        success: false,
        message: "Product ID and price are required.",
      });
    }

    const existingItem = await Cart.findOne({ userId , productId  });


 const wishListProduct = await Wishlist.findOne({ userid: userId });

if (wishListProduct) {
      // ensure productId array exists
      wishListProduct.productId = wishListProduct.productId.filter(
        (item) => item.toString() !== productId.toString()
      );

      await wishListProduct.save();
    }




    if (existingItem) {
      existingItem.quantity +=  1;
      await existingItem.save();

      return res.status(200).json({
        success: true,
        message: "Cart item quantity updated successfully.",
      });
    }


    

    const newCartItem = await Cart.create({
      productId,
      userId,
      price,
      quantity:  1,
    });


   


    return res.status(201).json({
      success: true,
      message: "Product added to cart successfully.",
      data: newCartItem,
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }




};

