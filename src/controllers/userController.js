import initModels from "../models/init-models.js";
import sequelize from "../models/connect.js";
import { response } from "../config/response.js";
import bcrypt from "bcrypt";
import { createToken, decodeToken } from "../config/jwt.js";
const model = initModels(sequelize);

const generateRandomString = () => {
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var randomString = "";
  for (var i = 0; i < 6; i++) {
    var randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomIndex);
  }
  return randomString;
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  let key = generateRandomString();
  const checkEmail = await model.user.findOne({
    where: {
      email,
    },
  });
  if (checkEmail) {
    if (bcrypt.compareSync(password, checkEmail.dataValues.password)) {
      const token = createToken({
        userId: checkEmail.dataValues.user_id,
        key,
      });
      response(res, token, "Login success", 200);
    } else {
      response(res, "", "Error password", 400);
    }
  } else {
    response(res, "", "Email is not exist !", 400);
  }
};

export const signUp = async (req, res) => {
  const { email, password, full_name } = req.body;
  const checkEmail = await model.user.findOne({ where: { email } });
  if (checkEmail !== null) {
    response(res, checkEmail.dataValues.email, "Email already exist !", 400);
    return;
  }
  const newUser = {
    full_name,
    email,
    password: bcrypt.hashSync(password, 10),
  };
  const data = await model.user.create(newUser);
  return response(res, data, "Create user success", 200);
};

export const like = async (req, res) => {
  const { token } = req.headers;
  const { data } = decodeToken(token);
  const { resId } = req.body;

  const find = await model.like_res.findOne({
    where: {
      user_id: data.userId,
      res_id: resId,
    },
  });
  if (find) {
    await model.like_res.destroy({
      where: {
        like_id: find.dataValues.like_id,
      },
    });
    response(res, "", "Unlike restaurant success", 200);
  } else {
    const newLike = { user_id: data.userId, res_id: resId };
    await model.like_res.create(newLike);
    response(res, "", "Like restaurant success", 200);
  }
};

export const rateRes = async (req, res) => {
  const { token } = req.headers;
  const { data } = decodeToken(token);
  const { resId, amount } = req.body;

  const find = await model.rate_res.findOne({
    where: {
      user_id: data.userId,
      res_id: resId,
    },
  });
  if (find) {
    await model.rate_res.update(
      {
        amount,
        date_rate: new Date(),
      },
      {
        where: {
          rate_id: find.dataValues.rate_id,
          user_id: data.userId,
          res_id: resId,
        },
      }
    );
    response(res, "", "Rate restaurant success", 200);
  } else {
    const newRate = {
      user_id: data.userId,
      amount,
      res_id: resId,
      date_rate: new Date(),
    };
    await model.rate_res.create(newRate);
    response(res, "", "Rate restaurant success", 200);
  }
};

export const order = async (req, res) => {
  const { token } = req.headers;
  const { data } = decodeToken(token);
  const { foodId, amount } = req.body;
  const key = generateRandomString();

  const getSubfood = await model.sub_food.findAll({
    where: {
      food_id: foodId,
    },
  });
  const arrSubId = [];
  for (let i = 0; i < getSubfood.length; i++) {
    const subFoodItem = getSubfood[i];
    const subFoodItemId = subFoodItem.dataValues.sub_id;
    arrSubId.push(subFoodItemId);
  }

  const newOrder = {
    user_id: data.userId,
    food_id: foodId,
    amount,
    code: key,
    arr_sub_id: arrSubId.join(", "),
  };

  await model.order_item.create(newOrder);
  response(res, "", "Order success", 200);
};
