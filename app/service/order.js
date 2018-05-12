const orderModel = require('../model/order');
const restaurantService = require('./restaurantAccount');
const tableService = require('./table');
const dishService = require('./dish');
const assert = require('../../lib/assert');

exports.createOrder = async (customer_id, info) => {
  // 确认餐厅和桌子存在
  assert(await restaurantService.exist(info.restaurant_id), '餐厅不存在');
  const tables = await tableService.getAll(info.restaurant_id);
  assert(tables.includes(info.table), '桌号不存在');
  // 总价格
  let price = 0;
  const dishes = [];
  // 对于用户下单的每个菜品
  for (const one of info.dish) {
    const specAnswer = one.specifications;
    const dish = await dishService.getOne(one.dish_id);
    // 确认菜品存在
    assert(dish, `菜品${one.dish_id}不存在`);
    // 确认菜品属于这个餐厅
    assert(dish.restaurant_id === info.restaurant_id, `菜品${one.dish_id}不属于餐厅${info.restaurant_id}`);
    dish.specifications = JSON.parse(dish.specifications);
    // 确认规格数量和选项合法
    let priceDelta = 0;
    let specificationName = [];
    assert(dish.specifications.length === specAnswer.length, `菜品${one.dish_id}的规格数量错误`);
    assert(specAnswer.every((selected, index) => {
      const thatSpec = dish.specifications[index];
      return selected <= thatSpec.options.length - 1;
    }), `菜品${one.dish_id}的选项不存在`);
    // 计算当前规格对于价格的影响 并 生成规格描述
    for (const [index, spec] of dish.specifications.entries()) {
      const selectedOption = spec.options[one.specifications[index]];
      priceDelta += selectedOption.delta;
      specificationName.push(selectedOption.name);
    }
    const dishPrice = dish.price + priceDelta;
    dishes.push({
      name: dish.name,
      specifications: specificationName.join(','),
      price: dishPrice
    });
    // 计算总价
    price += dishPrice;
  }
  assert(price === info.price, `价格错误，应该为${price}`);
  const order = {
    customer_id,
    restaurant_id: info.restaurant_id,
    price,
    table: info.table,
    dish: JSON.stringify(dishes),
    remark: info.remark
  };
  await orderModel.createOrder(order);
};

exports.deleteDish = async () => {

};

exports.getRestaurantOrder = async () => {

};

exports.updateOrder = async () => {

};

exports.exist = async id => {
  return Boolean(await orderModel.getOne(id));
};

exports.getOne = async id => {
  return orderModel.getOne(id);
};
