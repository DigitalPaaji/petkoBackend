import Cart from "../../model/cartModel.js";

export const addToCart = async (req, res) => {
  try {
    const { productId, price, quantity } = req.body;
    const userId = req.user?._id; 

   
    if (!productId || !price  ) {
      return res.status(400).json({
        success: false,
        message: "Product ID and price are required.",
      });
    }

    const existingItem = await Cart.findOne({ userId , productId  });

    if (existingItem) {
      existingItem.quantity += quantity || 1;
      await existingItem.save();

      return res.status(200).json({
        success: true,
        message: "Cart item quantity updated successfully.",
        data: existingItem,
      });
    }

    const newCartItem = await Cart.create({
      productId,
      userId,
      price,
      quantity: quantity || 1,
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




export const addCartItem = async (req, res) => {
  try {
    const { id } = req.params; // cart item ID

    // 1️⃣ Find cart item
    const cartItem = await Cart.findById(id);
    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found.",
      });
    }

    cartItem.quantity += 1;
    await cartItem.save();

    return res.status(200).json({
      success: true,
      message: "Cart item quantity increased successfully.",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};



export const subCartItem = async (req, res) => {
  try {
    const { id } = req.params; 

    const cartItem = await Cart.findById(id);
    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found.",
      });
    }
if(cartItem.quantity>1){
    cartItem.quantity -= 1;

}
    await cartItem.save();

    return res.status(200).json({
      success: true,
      message: "Cart item quantity increased successfully.",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};



export const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Validate ID
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Cart item ID is required.",
      });
    }

    // 2️⃣ Find and delete the item
    const deletedItem = await Cart.findByIdAndDelete(id);

    // 3️⃣ If not found
    if (!deletedItem) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found.",
      });
    }

    // 4️⃣ Success response
    return res.status(200).json({
      success: true,
      message: "Cart item deleted successfully.",
      data: deletedItem,
    });

  } catch (error) {
    console.error("Error deleting cart item:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};


export const getCartItem = async (req, res) => {
  try {
    const user = req.user;

    if (!user || !user._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please log in.",
      });
    }

    const cartItems = await Cart.find({ userId: user._id })
      .populate("productId" , " name images slug quantity comparePrice price").select("-userId")
      .sort({ createdAt: -1 }); 

    // 3️⃣ Handle empty cart
    if (!cartItems || cartItems.length === 0) {
      return res.status(200).json({
        success: true,
        message: "Your cart is empty.",
        data: [],
      });
    }

    // 4️⃣ Return cart items
    return res.status(200).json({
      success: true,
      message: "Cart items fetched successfully.",
      count: cartItems.length,
      data: cartItems,
    });

  } catch (error) {
    console.error("Error fetching cart items:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};







