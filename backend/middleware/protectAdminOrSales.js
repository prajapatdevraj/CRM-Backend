exports.adminOrSales = (req, res, next) => {
  console.log("admin or sales protect route called",res.user)
  if (res.user && (res.user.role === "admin" || res.user.department === "sales")) {
    console.log("admin or sales pass");
    next();
  } else {
    res
      .status(401)
      .json({ message: "Not authorized. Admin or Sales team only" });
  }
};
