const OrderList = (orderItems) => {
  function formatOrderItems(orderItems) {
    let formattedArray = [];
    formattedArray = orderItems.map((item, index) => {
      if (index == 0) {
        formattedArray[index] = item;
      } else {
        formattedArray[index] = ". " + item;
      }
    });

    return formattedArray;
  }

  return <p> {formatOrderItems(orderItems)}</p>;
};

export default OrderList;
