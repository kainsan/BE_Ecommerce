const UserService = require("../services/UserService");
const JwtService = require("../services/JwtService");

const createUser = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, phone } = req.body;
    const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    const isEmail = reg.test(email);
    if (!email || !password || !confirmPassword) {
      return res.status(200).json({
        status: "error",
        message: "Please enter an input",
      });
    } else if (!isEmail) {
      return res.status(200).json({
        status: "error",
        message: "Wrong format email",
      });
    } else if (password !== confirmPassword) {
      return res.status(200).json({
        status: "error",
        message: "password does not match with confirmPassword",
      });
    }
    const response = await UserService.createUser(req.body);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    const isEmail = reg.test(email);
    if (!email || !password) {
      return res.status(200).json({
        status: "error",
        message: "Please enter an input",
      });
    } else if (!isEmail) {
      return res.status(200).json({
        status: "error",
        message: "Wrong format email",
      });
    }
    const response = await UserService.loginUser(req.body);
    const { refresh_token, ...newReponse } = response
    res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            path: '/',
        })
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const data = req.body;
    if (!userId) {
      return res.status(200).json({
        status: "error",
        message: "Email not found",
      });
    }
    const response = await UserService.updateUser(userId, data);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(200).json({
        status: "ERR",
        message: "The userId is required",
      });
    }
    const response = await UserService.deleteUser(userId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const deleteManyUser = async (req, res) => {
  try {
      const ids = req.body.ids
      
      if (!ids) {
          return res.status(200).json({
              status: 'ERR',
              message: 'The ids is required'
          })
      }
      
      const response = await UserService.deleteManyUser(ids)
      
      return res.status(200).json(response)
  } catch (e) {
      return res.status(404).json({
          message: e
      })
  }
}

const getAllUser = async (req, res) => {
  try {
    const response = await UserService.getAllUser();
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getDetailsUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const response = await UserService.getDetailsUser(userId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const refreshToken = async (req, res) => {
  try {
      const token = req.cookies.refresh_token
      if (!token) {
          return res.status(200).json(
        {
            status: "ERR",
            message: "required token"
          });
      }
      const response = await JwtService.refreshTokenJwtService(token);
      return res.status(200).json(response);
  } catch (e) {
      return res.status(404).json({
          message: e,
      });
  }
};

const logoutUser = async (req, res) => {
  try {
      res.clearCookie('refresh_token')
      return res.status(200).json({
          status: 'OK',
          message: 'Logout successfully'
      })
  } catch (e) {
      return res.status(404).json({
          message: e
      })
  }
}

module.exports = {
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  deleteManyUser,
  getAllUser,
  getDetailsUser,
  refreshToken,
  logoutUser
};
