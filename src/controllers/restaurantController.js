import initModels from "../models/init-models.js";
import sequelize from "../models/connect.js";
import { response } from "../config/response.js";
const model = initModels(sequelize);

export const getLike = async (req, res) => {
  const data = await model.like_res.findAll({
    include: ["user", "re"],
  });
  return response(res, data, "Get all like success", 200);
};

export const getRate = async (req, res) => {
  const data = await model.rate_res.findAll({
    include: ["user", "re"],
  });
  return response(res, data, "Get all rate success", 200);
};
