const Item = require("../Item/ItemSchema");
const cloudinary = require("cloudinary").v2;

const deleteImage = async (image) => {
  await cloudinary.uploader.destroy(image.public_id);
};

const uploadImage = async (file) => {
  const result = await cloudinary.uploader.upload(file.tempFilePath, {
    public_id: `${Date.now()}`,
    resource_type: "auto",
    folder: "items",
  });
  return result;
};

const createItem = async (req, res) => {
  const { name, description, seller, price } = req.body;
  const file = req.files.img;
  const { public_id, url } = await uploadImage(file);
  const newItem = new Item({
    name,
    seller,
    image: {
      public_id,
      url,
    },
    description,
    price,
  });

  newItem
    .save()
    .then((item) => {
      res.status(201).json({
        status: true,
        message: "Item successfully created",
        data: item,
      });
    })
    .catch((err) => {
      res.status(500).json({
        status: false,
        message: "Error creating Item",
        error: err,
      });
    });
};

const getItems = async (req, res) => {
  try {
    const result = await Item.find({sold: false}).populate({
      path: "seller",
      select: ["-password"],
    });

    res.status(200).json({
      status: true,
      data: result,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: false,
      message: "Error getting Item",
      error: err,
    });
  }
};

const getSellerItems = async (req, res) => {
  try {
    let { seller } = req.body;
    const result = await Item.find({seller}).populate({
      path: "seller buyer",
      select: ["-password"],
    });

    res.status(200).json({
      status: true,
      data: result,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: false,
      message: "Error getting Item",
      error: err,
    });
  }
};

const getBuyerItems = async (req, res) => {
  try {
    let { buyer } = req.body;
    const result = await Item.find({buyer}).populate({
      path: "seller buyer",
      select: ["-password"],
    });

    res.status(200).json({
      status: true,
      data: result,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: false,
      message: "Error getting Item",
      error: err,
    });
  }
};

const purchaseItem = async (req, res) => {
  try {
    let { id, buyer } = req.body;
    const updated = await Item.findOneAndUpdate(
      { _id: id },
      { sold: true, buyer: buyer },
      { new: true }
    ).populate({
      path: "seller buyer",
      select: ["-password"],
    });
    if (updated) {
      res.status(201).json({
        status: true,
        message: "Item purchased successfully",
        data: updated,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: false,
      message: "Error purchasing Item",
      error: err,
    });
  }
};

const sellerConfirmItem = async (req, res) => {
  try {
    let { id, seller } = req.body;
    const updated = await Item.findOneAndUpdate(
      { _id: id, seller, sold: true },
      { sellerConfirm: true },
      { new: true }
    ).populate({
      path: "seller buyer",
      select: ["-password"],
    });
    if (updated) {
      res.status(201).json({
        status: true,
        message: "Seller confirmed item successfully",
        data: updated,
      });
    }
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Error confirming item",
      error: err,
    });
  }
};

const buyerConfirmItem = async (req, res) => {
  try {
    let { id, buyer } = req.body;
    const deleted = await Item.findOneAndDelete({
      _id: id,
      buyer,
      sellerConfirm: true,
    }).populate({
      path: "seller buyer",
      select: ["-password"],
    });
    await deleteImage(deleted.image);
    if (deleted) {
      res.status(201).json({
        status: true,
        message: "buyer confirmed item successfully",
        data: deleted,
      });
    }
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Error confirming item",
      error: err,
    });
  }
};

module.exports = {
  createItem,
  getItems,
  getBuyerItems,
  getSellerItems,
  purchaseItem,
  sellerConfirmItem,
  buyerConfirmItem,
};
