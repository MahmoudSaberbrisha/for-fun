const Attendance = require("../models/Attendance");

// Mark attendance for a member in a session
exports.markAttendance = async (req, res, next) => {
  try {
    const { sessionId, memberId, status } = req.body;

    let attendance = await Attendance.findOne({ sessionId, memberId });

    if (!attendance) {
      attendance = new Attendance({ sessionId, memberId, status });
    } else {
      attendance.status = status;
    }

    await attendance.save();

    res.status(200).json({
      success: true,
      message: "Attendance marked successfully",
      data: attendance,
    });
  } catch (err) {
    next(err);
  }
};

// Get attendance for a session
exports.getAttendanceBySession = async (req, res, next) => {
  try {
    const { sessionId } = req.params;

    const attendanceList = await Attendance.find({ sessionId }).populate(
      "memberId"
    );

    res.status(200).json({
      success: true,
      data: attendanceList,
    });
  } catch (err) {
    next(err);
  }
};

// Render attendance page for a session
exports.renderAttendancePage = async (req, res, next) => {
  try {
    const { sessionId } = req.params;

    const attendanceList = await Attendance.find({ sessionId }).populate(
      "memberId"
    );
    res.render("attendance", { attendanceList, sessionId });
  } catch (err) {
    next(err);
  }
};

// Get all attendance records
exports.getAllAttendance = async (req, res, next) => {
  try {
    const attendanceList = await Attendance.find().populate(
      "memberId sessionId"
    );
    res.status(200).json({
      success: true,
      data: attendanceList,
    });
  } catch (err) {
    next(err);
  }
};

// Render interactive attendance page with all attendance records
exports.renderAllAttendancePage = async (req, res, next) => {
  try {
    const attendanceList = await Attendance.find().populate(
      "memberId sessionId"
    );
    res.render("attendance", { attendanceList, sessionId: null });
  } catch (err) {
    next(err);
  }
};
