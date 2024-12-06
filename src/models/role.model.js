const mongoose = require('mongoose');
const schemaFields = require("../utils/schemaFieldUtils");
const { schema } = require('./authModel');


const RoleSchema = mongoose.Schema({
    _id:schemaFields.idWithV4UUID,
    roleName: schemaFields.StringAndUnique,
    permissions: schemaFields.ArrayOfStrings,
    hierarchyLevel: schemaFields.NumberWithDefault(1),
    isArchive: schemaFields.BooleanWithDefault,
    isActive: schemaFields.BooleanWithDefaultTrue
  },{timestamp:true,collection:"Role"});


  const RoleModel = mongoose.model('Role',RoleSchema);

  module.exports = { RoleModel }