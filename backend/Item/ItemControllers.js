const Item = require("../Item/ItemSchema");
const cloudinary = require("cloudinary").v2;

const upload = async (file) => {
  const result = await cloudinary.uploader.upload(file.tempFilePath,{
    public_id: `${Date.now()}`,
    resource_type: "auto",
    folder: "items"
  })
  return result.url;
}

const createItem = async (req, res) => {
  const { name, description, seller } = req.body;
  const file = req.files.img;
  const image = await upload(file);
  const newItem = new Item({
    name,
    seller,
    image,
    description
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
 try{   
  const result = await Item.find({}).populate({
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

const purchaseItem = async (req, res) => {
  try {
    let { id, buyer } = req.body;
    console.log("id is ",typeof(buyer));
    // buyer = buyer.slice(1, -1);
    const updated = await Item.findByIdAndUpdate({ "_id": id }, { state: "s", buyer: buyer });
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

module.exports = {
  createItem,
  getItems,
  purchaseItem
};
