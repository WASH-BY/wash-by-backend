const carWashersTodaysWashesModal = require("../models/CarWashersTodaysWashes");
const APIFeatures = require("../utils/APIFeatures");

const TodaysCarWashes = {
  getMyCarWashesForToday: async (req, res, next) => {
    try {
      console.log(req.user);
      const myCarWashes = new APIFeatures(
        carWashersTodaysWashesModal.find().select("-updatedAt -__v -createdAt"),
        req.query
      )
        .paginating()
        .filtering()
        .sorting()
        .searching();

      const result = await Promise.allSettled([
        myCarWashes.query,
        carWashersTodaysWashesModal.countDocuments(), //count number of subscription
      ]);

      const myCarWashesData =
        result[0].status === "fulfilled" ? result[0].value : [];

      const count = result[1].status === "fulfilled" ? result[1].value : [];

      return res
        .status(200)
        .json({ success: true, data: myCarWashesData, count:myCarWashesData.length });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
  createMyCarwashesToday: async (req, res) => {
    try {
      //check if the car wash is created by admin or car washer
      if (!req.body)
        return res
          .status(500)
          .json({
            success: false,
            message: "The car wash cannot be created as there is no req body",
          });
      const data = await carWashersTodaysWashesModal.create({
        user: req.user.id,
        carWashes: req.body,
      });

      return res.status(201).json({ success: true, data });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};

module.exports = TodaysCarWashes;
