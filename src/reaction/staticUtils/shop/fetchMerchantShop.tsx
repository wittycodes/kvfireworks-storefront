import graphQLRequest from "staticUtils/graphQLRequest";
import merchantShopQuery from "./merchantShop";
// import gql from "graphql-tag";

const shopBySlugQuery = `
query($slug: String!) {
  shopBySlug(slug: $slug) {
    _id
  }
}`;


/**
 * Fetch the primary shop's information
 *
 * @param {String} language - The shop's language
 * @returns {Object} The primary shop
 */
export default async function fetchMerchantShop(slug, language) {
  const queryRes = await graphQLRequest(shopBySlugQuery, { slug: slug});
  // console.log(queryRes, a"nkoamkml...PUlkit")
  const data = await graphQLRequest(merchantShopQuery, { id: queryRes.shopBySlug._id, language: language  });
  // console.log(data, "nkoamkml...laskkk")

  return (data && data.shop && { shop: data.shop });
}
