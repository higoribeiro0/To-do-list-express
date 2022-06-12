const { default: mongoose } = require("mongoose");
const mongooose = require("mongoose");
const taskSchema = mongooose.Schema({
  name: { type: String, required: true },
  done: { type: Boolean, default: false },

  //referência com o checklist
  checklist: {
    type: mongooose.Schema.Types.ObjectId,
    ref: "Checklist",
    required: true,
  },
});

module.exports = mongoose.model("Task", taskSchema);
