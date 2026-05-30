import jwt from "jsonwebtoken";


export const protect = (...roles) => {
  return (req, res, next) => {
  
    let token = req.cookies?.token;

    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - No token",
      });
    }

    try {
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
      req.user = decoded; 
    

      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden - Access denied",
        });
      }

      next();
    } catch (error) {
       console.log("JWT ERROR:", error.name, error.message);
      return res.status(401).json({
        success: false,
        message: "Invalid Token",
      });
    }
  };
};