const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  radius : Number,
  texture: Number,
  perimeter: Number,
  area : Number,
  smoothness: Number,
  compactness: Number,
  concavity:Number,
  concave_point:Number,
  symmetry:Number,
  fractional_dimension:Number,
  radius_se:Number,
  texture_se:Number,
  perimeter_se: Number,
  area_se: Number,
  smoothness_se: Number,
  compactness_se: Number,
  concavity_se:Number,
  concave_point_se:Number,
  symmetry_se:Number,
  fractional_dimension_se:Number,


});

const User = mongoose.model("User", userSchema);

module.exports = User;
