export const addCommentInProduct = function (schema, request) {
  console.log(schema);
  // const userId = requiresAuth.call(this, request);
  console.log('userid', userId);
  try {
    // if (!userId) {
    //   return new Response(
    //     404,
    //     {},
    //     {
    //       errors: ["The email you entered is not Registered. Not Found error"],
    //     }
    //   );
    // }
    const products = schema.users.findBy({ _id: userId }).products;
    const { productId, comment } = JSON.parse(request.requestBody); 
    console.log(productId);
    const product = schema.products.find(productId);
    console.log(product);
    if (product) {
      product.comment.push(comment);
      schema.users.update({ _id: userId }, products);
      return new Response(201, {}, { comment: product.comment });
    } else {
      return new Response(404, {}, { error: "Product not found" });
    }
  } catch (error) {
    console.error("Error in addCommentInProduct:", error);
    return new Response(
      500,
      {},
      {
        error: "Internal Server Error",
      }
    );
  }
};
