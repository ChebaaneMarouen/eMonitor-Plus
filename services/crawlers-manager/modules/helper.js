// ? is unsupported and equivalent to *
exports.fixScheduleFormat = (schedule) => schedule.replace(/\?/g, "*");
