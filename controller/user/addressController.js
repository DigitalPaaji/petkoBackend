import Address from "../../model/addressModel.js";

export const addAddress = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      phone,
    } = req.body;

    const user = req.user;

    if (!user || !user._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. User not found.",
      });
    }

    if (
      !firstName ||
      !lastName ||
      !addressLine1 ||
      !city ||
      !state ||
      !postalCode ||
      !country
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields.",
      });
    }

   await Address.updateMany(
  { userid: user._id },     
  { $set: { default: false } }
                 );




    const newAddress = await Address.create({
      firstName,
      lastName,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      phone,
      userid: user._id,
      default:true
    });

    return res.status(201).json({
      success: true,
      message: "Address added successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

 

export const getAddress = async (req, res) =>{

     try {
    const user = req.user;
    if (!user || !user._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. User not found.",
      });
    }

    const addresses = await Address.find({ userid: user._id }).sort({createdAt: -1});

    if (!addresses || addresses.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No addresses found for this user.",
        data: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Addresses fetched successfully.",
      data: addresses,
    });
  } 
  catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
 
};
 


export const setDefault = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    if (!user || !user._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. User not found.",
      });
    }

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Address ID is required.",
      });
    }

    const address = await Address.findOne({ _id: id, userid: user._id });
    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found or does not belong to this user.",
      });
    }

    await Address.updateMany({ userid: user._id }, { $set: { default: false } });

    address.default = true;
    await address.save();

    return res.status(200).json({
      success: true,
      message: "Default address updated successfully.",
      data: address,
    });

  } catch (error) {
    console.error("Error setting default address:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};


export const removeAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    if (!user || !user._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. User not found.",
      });
    }

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Address ID is required.",
      });
    }

    const address = await Address.findOne({ _id: id, userid: user._id });
    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found or does not belong to this user.",
      });
    }

    await Address.deleteOne({ _id: id });

    return res.status(200).json({
      success: true,
      message: "Address removed successfully.",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};



export const updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const {
      firstName,
      lastName,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      phone,
    } = req.body;

    if (!user || !user._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. User not found.",
      });
    }
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Address ID is required.",
      });
    }
    const address = await Address.findOne({ _id: id, userid: user._id });
    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found or does not belong to this user.",
      });
    }
     await Address.findByIdAndUpdate(
      id,
      {
        firstName,
        lastName,
        addressLine1,
        addressLine2,
        city,
        state,
        postalCode,
        country,
        phone,
      },
      { new: true, runValidators: true } 
    );

    return res.status(200).json({
      success: true,
      message: "Address updated successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};





