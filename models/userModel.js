const sql = require("mssql");
const dbConfig = require("../dbConfig");

const userModel = {
  getUserByUsername: async (username) => {
    try {
      let pool = await sql.connect(dbConfig);
      let result = await pool
        .request()
        .input("TenDangNhap", sql.VarChar, username).query(`
                    SELECT *
                    FROM NguoiDung
                    WHERE TenDangNhap = @TenDangNhap
                `);
      return result.recordset[0]; // Return first user found (unique username)
    } catch (err) {
      console.error("Error getting user by username:", err);
      throw err;
    }
  },

  createUser: async (userData) => {
    try {
      let pool = await sql.connect(dbConfig);
      let result = await pool
        .request()
        .input("TenNguoiDung", sql.NVarChar, userData.TenNguoiDung)
        .input("TenDangNhap", sql.VarChar, userData.TenDangNhap)
        .input("SoDienThoai", sql.VarChar, userData.SoDienThoai)
        .input("Email", sql.VarChar, userData.Email)
        .input("MaQR", sql.VarChar, userData.MaQR)
        .input("MatKhau", sql.VarChar, userData.MatKhau) // Hashed password will be passed here from service
        .input("LoaiNguoiDung", sql.Int, userData.LoaiNguoiDung).query(`
                    INSERT INTO NguoiDung (TenNguoiDung, TenDangNhap, SoDienThoai, Email, MaQR, MatKhau, LoaiNguoiDung)
                    VALUES (@TenNguoiDung, @TenDangNhap, @SoDienThoai, @Email, @MaQR, @MatKhau, @LoaiNguoiDung);
                    SELECT * FROM NguoiDung WHERE MaNguoiDung = SCOPE_IDENTITY();
                `);
      return result.recordset[0]; // Return the newly created user object
    } catch (err) {
      console.error("Error creating user:", err);
      throw err;
    }
  },
};

module.exports = userModel;
