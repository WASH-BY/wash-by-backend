const CarWash = require("../models/CarWashDetails");
const Users = require("../models/UserModel");
const CarSubscriptionModel = require("../models/CarSubscriptionDetails");
const APIFeatures = require("../utils/APIFeatures");
const fs = require("fs");
// const { cloudinary } = require("../utils/Cloudinary");

const cloudinary = require("cloudinary");
cloudinary.config({
  cloud_name: "nutrikee",
  api_key: "576948847687923",
  api_secret: "wm33buwerdl3bhz4kHIlzy67aME",
});

async function uploadToCloudinary(locaFilePath) {
  // locaFilePath :
  // path of image which was just uploaded to "uploads" folder
  var mainFolderName = "main";
  var filePathOnCloudinary = mainFolderName + "/" + locaFilePath;
  // filePathOnCloudinary :
  // path of image we want when it is uploded to cloudinary
  return cloudinary.uploader
    .upload(locaFilePath, { public_id: filePathOnCloudinary })
    .then((result) => {
      // Image has been successfully uploaded on cloudinary
      // So we dont need local image file anymore
      // Remove file from local uploads folder
      fs.unlinkSync(locaFilePath);

      return {
        message: "Success",
        url: result.url,
      };
    })
    .catch((error) => {
      // Remove file from local uploads folder
      fs.unlinkSync(locaFilePath);
      return { message: "Fail" };
    });
}

const carWash = {
  createCarWashManually: async (req, res) => {
    try {
      const subscription = new APIFeatures(
        CarSubscriptionModel.find()
          .select("-updatedAt -__v -createdAt")
          .populate(
            "carDetails carOwnerDetails",
            `carCompanyName carModelName carNumber
             carModelYear carLocation carApartmentName 
             carOwnerFlatorHouseNumber carOwnerPhoneNumber
             name email`
          ),
        req.query
      )
        .paginating()
        .filtering()
        .sorting()
        .searching();

      const result = await Promise.allSettled([
        subscription.query,
        subscription.length, //count number of subscription
      ]);

      const SubscriptionData =
        result[0].status === "fulfilled" ? result[0].value : [];

      const count = result[1].status === "fulfilled" ? result[1].value : [];

      const Date = new Date();
      const todaysDate =
        Date.getFullYear() + "-" + (Date.getMonth() + 1) + "-" + Date.getDate();
      console.log("todaysDate", todaysDate);
      /*once we have the car wash data
      we filter out the car washes for today
      */
      const todayWashes =
        SubscriptionData &&
        SubscriptionData._id &&
        SubscriptionData.filter((data) =>
          data.washingDates.includes(todaysDate)
        );

      /* once we have the filtered data for todays's date 
      we have to assign a washer to each car wash 
      Hence I call Users model to fetch all the washers available
      */

      const washers = await Users.find({ isWasher: true });

      const carWashScheduleTimeArray = [
        "09:00",
        "09:30",
        "10:00",
        "10:30",
        "11:00",
        "11:30",
        "12:00",
        "12:30",
        "13:00",
        "14:00",
        "14:30",
        "15:00",
        "15:30",
        "16:00",
        "16:30",
        "17:00",
        "17:30",
        "18:00",
        "18:30",
      ];
      //TODO:as you have the car washes for today and the washer's Data
      /* create car wash by providing carDetails
        carWashScheduledDate,
        carWashStartTime,
        carWashEndTime,
        alongside create a copy for the washer 
        through the API named createMyCarwashesToday
        so that the user will have the copy of car washes  for today to track by him and the admin
        make sure you set up time intervals for each car wash
*/

      // res.status(200).json({
      //   success: true,
      //   data: { SubscriptionData: SubscriptionData, count },
      // });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
  createCarWash: async (req, res) => {
    try {
      /* First we fetch the subscription details of the car to be washed by querying the
      Users model and Subscription modal
      */
      const subscriptionId = await Users.find({ _id: req.user.id });
      const CarDetails = await CarSubscriptionModel.find({
        _id: subscriptionId[0].subscriptionDetails,
      });

      const { carWashScheduledDate, carWashStartTime, carWashEndTime } =
        req.body;

      if (!CarDetails)
        return res.status(500).json({
          success: false,
          message:
            "A car wash cannot be created as subscription does not exist for the user",
        });

      /*Here we create a new car wash by providing car wash scheduled date,time 
      and car details
      */
      const createWash = await CarWash.create({
        carDetails: CarDetails[0].carDetails,
        carWashScheduledDate,
        carWashStartTime,
        carWashEndTime,
      });

      /*Here we update the car details in Subscription models
       i.e in case if the car details was not updated then
        i.e while creating the subscription for the car
       it'll now be updated here in the car subscription model
       */

      // In the Below line we update the car details only if the car details is not present in the subscription model
      if (!CarDetails[0].carDetails) {
        await CarSubscriptionModel.findByIdAndUpdate(
          { _id: subscriptionId[0].subscriptionDetails },
          { carDetails: CarDetails[0].carDetails },
          { new: true, runValidators: true }
        );
      }

      return res.status(201).json({ success: true, data: createWash });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  updateCarWashByWasher: async (req, res) => {
    try {
      //Here car wash will be updated by washer
      const getWasherDetails = await Users.find({ _id: req.user.id });

      //Single File upload
      // console.log("req.file.originalname", req.file.originalname);

      console.log(
        "req.file.originalname",
        req.files.map((originalname) => originalname)
      );
      // var locaFilePath = req.file.path;
      // // console.log("file", file);
      // var result = await uploadToCloudinary(locaFilePath)
      // console.log("data1", result);

      // console.log('result.secure_url', result.url)
      // Multiple File upload
      let filesArray = [];
      const res = await Promise.allSettled([req.files
        .forEach(async (element) => {
          console.log("req.file.originalname", element.originalname);

          var result = await uploadToCloudinary(element.path);

          return filesArray.push(result.url);
        })])

      console.log("fileArr", res);

      // if (getWasherDetails[0].isWasher) {
      //   const washExists = await CarWash.find({ _id: req.params.id });
      //   if (!washExists) {
      //     return res.status(500).json({
      //       success: false,
      //       message: "No Car wash found with the provided id.",
      //     });
      //   } else {
      //     /*here we update the car wash by uploading the car images
      //      before wash along with who is washing the car*/

      //     const washerUpdate = await CarWash.findByIdAndUpdate(
      //       req.params.id,
      //       {
      //         carwashedBy: req.user.id,
      //         carImageBeforeWash,
      //       },
      //       { new: true, runValidators: true }
      //     );
      //     return res.status(200).json({ success: true, data: washerUpdate });
      //   }
      // } else {
      return res.status(500).json({
        success: false,
        data: "Data can be updated only by a Washer",
      });
      // }
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  upDateCarWashingOnCompletion: async (req, res) => {
    try {
      /*Before updating the car wash as completed ,
       we check if the car wash exists */

      const doesWashExist = await CarWash.find({ _id: req.params.id });
      const subscriptionId = await Users.find({ _id: req.user.id });
      const CarDetails = await CarSubscriptionModel.find({
        _id: subscriptionId[0].subscriptionDetails,
      });
      if (!doesWashExist)
        return res.status(500).json({
          success: false,
          message: "Washer with the provided id does not exist",
        });
      const { carImageAfterWash, isCarWashCompleted } = req.body;

      /* Here the car washer will complete the car wash 
        by uploading the car images after  the car wash
        and we will mark the car wash as completed
       */
      const endCarWash = await CarWash.findByIdAndUpdate(
        { _id: req.params.id },
        {
          carImageAfterWash,
          isCarWashCompleted,
          carwashedBy: req.user.id,
        },
        { new: true, runValidators: true }
      );

      return res.status(200).json({
        success: true,
        message: "You have successfully completed your Car Wash",
        data: endCarWash,
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  completeCarWashByUser: async (req, res) => {
    try {
      // Here we fetch the subscription id from User modal
      const subscriptionId = await Users.find({ _id: req.user.id });
      const CarDetails = await CarSubscriptionModel.find({
        _id: subscriptionId[0].subscriptionDetails,
      });

      const getSubscription = await CarSubscriptionModel.find({
        _id: CarDetails[0]._id,
      });

      /*Once we have the subscription details,
      Below I update the totalWashesDone and totalWashesLeft
      from the subscription modal
      */
      const completedAWash = await CarSubscriptionModel.findByIdAndUpdate(
        { _id: CarDetails[0]._id },
        {
          totalWashesDone: parseInt(getSubscription[0].totalWashesDone + 1),
          totalWashesLeft: parseInt(getSubscription[0].totalWashesLeft - 1),
        },
        { new: true, runValidators: true }
      );
      return res.status(200).json({ success: true, data: completedAWash });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  getCarWashes: async (req, res) => {
    try {
      /* Here we fetch the details of all the car washes
      such as car's washed till now,
      who's car was washed 
      who washed their car
      at what time the car wash started and ended
      the images of the car before and after the wash and so on ....
      */
      const allCarWashes = new APIFeatures(
        CarWash.find()
          .populate(
            "carDetails carwashedBy",
            `carCompanyName carModelName carNumber
             carModelYear carLocation carApartmentName
              carOwnerFlatorHouseNumber carOwnerPhoneNumber 
              name email userType`
          )
          .select("-__v -createdAt -updatedAt"),
        req.query
      )
        .paginating()
        .sorting()
        .searching()
        .filtering();

      const result = await Promise.allSettled([
        allCarWashes.query,
        CarWash.countDocuments(),
      ]);
      const AllCarWashes =
        result[0].status === "fulfilled" ? result[0].value : [];
      const count = result[1].status === "fulfilled" ? result[1].value : [];
      return res.status(200).json({ AllCarWashes, count });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  deleteCarWash: async (req, res) => {
    try {
      const doesWashExist = await CarWash.find({ _id: req.params.id });
      if (!doesWashExist)
        return res.status(500).json({
          success: false,
          mesaage: "You cannot delete this wash as this wash does  not exist",
        });
      await CarWash.findByIdAndDelete(req.params.id);
      return res.status(200).json({ success: true, data: [] });
    } catch (error) {
      return res.status(500).json({
        success: false,
        mesaage: error.message,
      });
    }
  },
};

const fileSizeFormatter = (bytes, decimal) => {
  if (bytes === 0) {
    return "0 Bytes";
  }
  const dm = decimal || 2;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "YB", "ZB"];
  const index = Math.floor(Math.log(bytes) / Math.log(1000));
  return (
    parseFloat((bytes / Math.pow(1000, index)).toFixed(dm)) + " " + sizes[index]
  );
};


module.exports = carWash;
