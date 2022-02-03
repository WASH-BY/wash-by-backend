const CarModel = require("../models/CarModel");
const Users = require("../models/UserModel");
const APIFeatures = require("../utils/APIFeatures");

const carModelController = {
  createCar: async (req, res) => {
    try {
      const {
        carCompanyName,
        carModelName,
        carNumber,
        carModelYear,
        carLocation,
        carApartmentName,
        carOwnerFlatorHouseNumber,
        carOwnerPhoneNumber,
      } = req.body;

      const carAlreadyexists = await CarModel.findOne({ carNumber });
      if (carAlreadyexists)
        return res.status(400).json({
          success: false,
          message: "The car with this car number already exists.",
        });

      // WE WILL CREATE A CAR FOR THE USER
      const createNewCar = await CarModel.create({
        carCompanyName,
        carModelName,
        carNumber,
        carModelYear,
        user: req.user.id,
        carLocation,
        carApartmentName,
        carOwnerFlatorHouseNumber,
        carOwnerPhoneNumber,
      });

      const existingCar = await CarModel.find({ user: req.user.id });
      let carArray = [];
      carArray.push(existingCar.map((data) => data._id));

      //Filtering out duplicate cars before updating it to the User Model
      const uniqueCars = [...new Set(carArray[0])];

      //Here I'm updating the User modal by passing the new car modal
      await Users.findByIdAndUpdate(
        { _id: req.user.id },
        { carDetails:uniqueCars },
        { new: true, runValidators: true }
      );

      return res.status(201).json({ success: true, data: createNewCar });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  getCars: async (req, res) => {
    try {
      const getCars = new APIFeatures(CarModel.find().populate('user','-password -__v -createdAt -updatedAt'), req.query)
        .paginating()
        .sorting()
        .searching()
        .filtering();

      const result = await Promise.allSettled([
        getCars.query,
        CarModel.countDocuments(),
      ]);

      const CarsData = result[0].status === "fulfilled" ? result[0].value : [];
      const count = result[1].status === "fulfilled" ? result[1].value : [];
      res.status(200).json({ success: true, data: CarsData, count });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  updateCar: async (req, res) => {
    try {
      const carExists = await CarModel.find({ _id: req.params.id });
      if (!carExists) {
        return res
          .status(404)
          .json({ success: false, message: "No car found" });
      }
      const updatedCar = await CarModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );
      res.status(201).json({ success: true, data: updatedCar });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  },

  deleteCar: async (req, res) => {
    try {
      const carExists = await CarModel.findById(req.params.id);
      console.log(carExists);
      if (!carExists) {
        return res
          .status(404)
          .json({ success: false, error: "Car does not exist" });
      }
      const deletedCar = await CarModel.findByIdAndDelete(req.params.id);
      return res.status(200).json({ success: true, data: [] });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  },
};

module.exports = carModelController;
