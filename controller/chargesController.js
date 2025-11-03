import Charges from "../model/chargesModel.js";

export const createCharges = async (req, res) => {
  try {
    const { chargetype, chargeamount, maxvalue } = req.body;

    // 1️⃣ Validate input
    if (!chargetype || chargeamount == null) {
      return res.status(400).json({
        success: false,
        message: "Charge type and amount are required",
      });
    }

    const existing = await Charges.findOne({ chargetype });
    if (existing) {
      existing.chargeamount = chargeamount;
      existing.maxvalue = maxvalue || null;
      await existing.save();

      return res.status(200).json({
        success: true,
        message: `${chargetype} charge updated successfully`,
        charge: existing,
      });
    }

    const newCharge = await Charges.create({
      chargetype,
      chargeamount,
      maxvalue,
    });

    return res.status(201).json({
      success: true,
      message: `${chargetype} charge created successfully`,
      charge: newCharge,
    });
  } catch (error) {
    console.error("Error creating charge:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const getCharge = async (req, res) => {
  try {
    const charges = await Charges.find().sort({ chargetype: 1 });

    return res.status(200).json({
      success: true,
      message: "Charges fetched successfully",
      charges,
    });
  } catch (error) {
    console.error("Error fetching charges:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const deleteCharges = async (req, res) => {
  try {
    const { chargeid } = req.params;

    if (!chargeid) {
      return res.status(400).json({
        success: false,
        message: "Charge ID is required",
      });
    }

    const deletedCharge = await Charges.findByIdAndDelete(chargeid);

    if (!deletedCharge) {
      return res.status(404).json({
        success: false,
        message: "Charge not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Charge deleted successfully",
      deletedCharge,
    });
  } catch (error) {
    console.error("Error deleting charge:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
