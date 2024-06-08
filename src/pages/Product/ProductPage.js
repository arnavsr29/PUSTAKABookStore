import React, { useState, useEffect } from "react";
import "./ProductPage.css";
import "./Product.css";
import { useNavigate, useParams } from "react-router";
import { useAuth, useData } from "../../context";
import { addToCart, addToWishlist } from "../../services";
import { isProductInCart, isProductInWishlist } from "../../utils/cartUtils";
import { toast } from "react-toastify";
import { ProductCard } from "./components/ProductCard";
import axios from "axios";
import { addComment } from "../../services/comments/comments";

import { products as ALLProducts } from "../../backend/db/products";

export function ProductPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [btnWishlistDisabled, setWishlistBtnDisabled] = useState(false);
  const { token, user } = useAuth();
  const { products, cart, dataDispatch, wishlist, setLoader, changeTitle } =
    useData();
  const { firstName, lastName } = user;
  const [categoriesProducts, setCategoriesProducts] = useState([]);
  const product = products.find((product) => product.id === productId);

  const isInCart = isProductInCart(cart, product?._id);
  const isInWishlist = isProductInWishlist(wishlist, product?._id);

  const addToCartHandler = () => {
    token
      ? isInCart
        ? navigate("/cart")
        : addToCart(dataDispatch, product, token, toast, setBtnDisabled)
      : navigate("/login");
  };

  const addToWishlistHandler = () => {
    token
      ? isInWishlist
        ? navigate("/wishlist")
        : addToWishlist(
            dataDispatch,
            product,
            token,
            toast,
            setWishlistBtnDisabled
          )
      : navigate("/login");
  };

  const [commentText, setCommentText] = useState("");
  const [prevComments, setPrevComments] = useState([]);

  useEffect(() => {
    if (product?.name) {
      changeTitle(product?.name);
    }
  }, [product?.name]);

  const [mainProduct, setMainProduct] = useState(null);
  useEffect(() => {
    if (product) {
      setMainProduct(product);
      setPrevComments(product.comment);
    }
  }, [product]);

  useEffect(() => {
    if (product) {
      async function fetchData() {
        const { data: products } = await axios.get("/api/products");
        const allProducts = products?.products;
        const getProductsByCategory = (category) => {
          return allProducts?.filter(
            (product) => product?.category == category
          );
        };
        const books = getProductsByCategory(product?.category);
        setCategoriesProducts(
          books?.slice(1, 7).filter((product) => product?._id !== productId)
        );
      }
      fetchData();
    }
  }, [product]);

  const addCommentHandler = (theProduct) => {
    // addComment(
    //   product._id,
    //   dataDispatch,
    //   {
    //     productId,
    //     comment: {
    //       name: "Rafi",
    //       comment: "commentText",
    //     },
    //   },
    //   token,
    //   toast,
    //   setWishlistBtnDisabled
    // );
    const newComment = {
      name: `${firstName} ${lastName}`,
      comment: commentText,
    };
    const updatedComments = [...prevComments, newComment];
    setPrevComments(updatedComments);
    setCommentText("");
  };

  if (products?.length === 0) {
    // setLoader(() => true);
    return <></>;
  }

  // setLoader(() => false);
  return (
    <div className="product-page">
      <div className="single-card-container  flex items-start justify-center gap-4">
        <div
          className="single-card flex-center max-w-xl"
          style={{
            flexWrap: "nowrap",
            // gap: "2rem",
          }}
        >
          <div className="single-card-left p-4">
            <img className="single-card-img" src={mainProduct?.img} alt="" />
            {mainProduct?.isBestSeller && (
              <span className="card-badge">Best Seller</span>
            )}
          </div>

          <div className="single-card-right">
            <div className="single-card-title">
              <h3 className="single-card-title-header">{mainProduct?.name}</h3>
              <div className="star-ratings">
                {mainProduct?.rating}
                <i className="fa fa-star"></i>
              </div>
            </div>
            <div className="price">
              <p className="disc-price">₹{mainProduct?.price}</p>
              <p className="actual-price">₹{mainProduct?.originalPrice}</p>
              <p className="price-percentage">
                {mainProduct?.percentageOff}% OFF
              </p>
            </div>
            <p className="paragraph-sm msg">
              <i className="fa fa-bolt" aria-hidden="true"></i> Hurry , Only Few
              Left !
            </p>
            <span className="tag-msg">
              <i className="fa fa-tag" aria-hidden="true"></i> Fastest Delivery
            </span>
            <span className="tag-msg">
              <i className="fa fa-tag" aria-hidden="true"></i> Inclusive of All
              Taxes
            </span>
            <span className="tag-msg">
              <i className="fa fa-tag" aria-hidden="true"></i> Cash On Delivery
              Available
            </span>
            <div className="other-info">
              <li>
                <ul>
                  Author : <p>{mainProduct?.author}</p>
                </ul>
                <ul>
                  Category : <p>{mainProduct?.category}</p>
                </ul>
                <ul>
                  Binding : <p>Hard Cover</p>
                </ul>
                <ul>
                  Language : <p>English</p>
                </ul>
              </li>
            </div>

            <button
              className={`btn default`}
              onClick={() => addToCartHandler()}
              disabled={btnDisabled}
            >
              <i className="fa fa-shopping-cart" aria-hidden="true"></i>{" "}
              {isInCart ? "Go to Cart" : "Add to Cart"}
            </button>

            <button
              className="btn outlined-default  wishlist-btn"
              onClick={() => addToWishlistHandler()}
              disabled={btnWishlistDisabled}
            >
              <i className="fa fa-heart-o" aria-hidden="true"></i>{" "}
              {isInWishlist ? "Go to Wishlist" : "Add to Wishlist"}
            </button>
          </div>
        </div>
        <div className="mt-6 hidden lg:block">
          <p className="comments-headline mb-3">Comments</p>
          <div>
            {prevComments?.map((comment) => (
              <div key={comment.name} className="flex items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="border p-2 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      class="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="M12 2C9.243 2 7 4.243 7 7c0 2.757 2.243 5 5 5s5-2.243 5-5c0-2.757-2.243-5-5-5zM19 22a1 1 0 0 1-1-1c0-3-4-4-6-4s-6 1-6 4a1 1 0 0 1-1 1" />
                    </svg>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold">{comment?.name}</h3>
                    <p className="text-gray-700">{comment?.comment}</p>
                  </div>
                </div>
              </div>
            ))}
            <div>
              <div className="flex items-start gap-3">
                <div className="border p-2 rounded-full w-11">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    class="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M12 2C9.243 2 7 4.243 7 7c0 2.757 2.243 5 5 5s5-2.243 5-5c0-2.757-2.243-5-5-5zM19 22a1 1 0 0 1-1-1c0-3-4-4-6-4s-6 1-6 4a1 1 0 0 1-1 1" />
                  </svg>
                </div>
                <div className=" space-y-2">
                  <h3 className="commenter">
                    {firstName} {lastName}
                  </h3>
                  <div className="flex-center gap-2">
                    <input
                      type="text"
                      className="comment-input border py-2"
                      placeholder="Write a comment"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                    />
                    <button
                      className="send-button bg-blue-500 text-white px-4 py-2 rounded-md"
                      onClick={() => addCommentHandler(mainProduct)}
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="center-card mt-24 hidden lg:block  px-4">
        <h3 className="heading">Recommendation:</h3>

        <div className="responsive-grid">
          {categoriesProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
