import Wishlist from "../../model/wishlistModel.js";

export const addToWishlist = async (req, res) => {
  try {
    const { productid } = req.params;
    const user = req.user;

    let wishlist = await Wishlist.findOne({ userid });

    if (!wishlist) {
      wishlist = new Wishlist({ userid: user._id, items: [] });
    }

    await wishlist.addProduct(productid);

    return res.json({ success: true, message: "Added to wishlist" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const { productid } = req.params;
    const user = req.user;

    const wishlist = await Wishlist.findOne({ userid: user._id });
    if (!wishlist) {
      return res
        .status(404)
        .json({ success: false, message: "Wishlist not found" });
    }

    await wishlist.removeProduct(productid);

    return res.json({ success: true, message: "Removed from wishlist" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getWishlist = async (req, res) => {
  try {
    const user = req.user;

    const wishlist = await Wishlist.findOne({ userid: user._id })
      .populate("items.productid", "name price image") // populate only needed fields
      .exec();

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

export const clearWishlist = async (req, res) => {
  try {
    const user = req.user;

    const wishlist = await Wishlist.findOne({ userid: user._id });
    if (!wishlist) {
      return res
        .status(404)
        .json({ success: false, message: "Wishlist not found" });
    }

    wishlist.items = [];
    await wishlist.save();

    return res.json({ success: true, message: "Wishlist cleared" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
