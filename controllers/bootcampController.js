const Bootcamp = require("../models/BootcampModel");
const AysncHandler = require("../middleware/AsyncHandler");
const ErrorResponse = require("../utils/ErrorResponse");

exports.getAllBootcamps = AysncHandler(async (req, res, next) => {
  const bootcamps = await Bootcamp.find();
  res.status(200).json({
    success: true,
    data: bootcamps,
  });
});

exports.createBootcamp = AysncHandler(async (req, res, next) => {
  const bootcamps = await Bootcamp.create(req.body);
  res.status(201).json({
    success: true,
    data: bootcamps,
  });
});

exports.updateBootcamp = AysncHandler(async (req, res, next) => {
  let bootcamps = await Bootcamp.findById(req.params.id);
  if (!bootcamps) {
    return next(
      new ErrorResponse(`Bootcamp with id ${req.params.id} not found`, 401)
    );
  }
  bootcamps = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true,
  });
  res.status(200).json({ success: true, data: bootcamps });
});

exports.deleteBootcamp = AysncHandler(async (req, res, next) => {
  let bootcamps = await Bootcamp.findById(req.params.id);
  if (!bootcamps)
    return next(
      new ErrorResponse(`Bootcamp with id ${req.params.id} not found`, 401)
    );

  bootcamps = await Bootcamp.remove();

  res.status(200).json({ success: true, data: {} });
});
