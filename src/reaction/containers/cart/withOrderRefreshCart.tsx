import React from "react";
import useRCart from "hooks/cart/useCart";
import hoistNonReactStatic from "hoist-non-react-statics";
import useCartStore from "hooks/globalStores/useCartStore";
// import Checkout from "../../../features/checkouts/checkout-two/checkout-two";
import { useApolloClient } from "@apollo/client";
import {buildOrderMutation} from "hooks/orders/buildOrder.gql";















const buildOrder = async (cart, props) => {
  // alert('buildo')
  const { cartStore, orderEmailAddress} = props;
  const cartId = cartStore.hasAccountCart ? cartStore.accountCartId : cartStore.anonymousCartId;

  const fulfillmentGroups = cart?.checkout?.fulfillmentGroups.map((group) => {
    const {data} = group;
    const {selectedFulfillmentOption} = group;

    const items = cart.items.map((item) => ({
      addedAt: item.addedAt,
      price: item.price.amount,
      productConfiguration: item.productConfiguration,
      quantity: item.quantity
    }));

    // console.log(data)
    // alert(data)

    return {
      data,
      items,
      selectedFulfillmentMethodId: selectedFulfillmentOption.fulfillmentMethod._id,
      shopId: group.shop._id,
      totalPrice: 0,
      type: group.type
    };
  });


  const order = {
    cartId,
    currencyCode: cart?.checkout?.summary.total.currency.code,
    email: orderEmailAddress,
    fulfillmentGroups,
    shopId: cart?.shop?._id
  };
  // console.log(order, fulfillmentGroups, "mkslkmlsksmlkwmldm")
  return order
}

// @ts-ignore
const postBuildOrder = async (order, props) => {
  const {cartStore, clearAuthenticatedUsersCart, apolloClient} = props;

  // Payments can have `null` amount to mean "remaining".
  let remainingAmountDue = order.fulfillmentGroups.reduce((sum, group) => sum + group.totalPrice, 0);
  props.cartStore.resetCheckoutPayments()
  props.cartStore.addCheckoutPayment({payment: {amount: order.fulfillmentGroups[0].totalPrice, method: "iou_example"}});

  const payments = cartStore.checkoutPayments.map(({payment}) => {
    // remainingAmountDue = 10881
    console.log(remainingAmountDue, payment, "ononnon")
    // payment.amount = remainingAmountDue
    const amount = payment.amount ? Math.min(payment.amount, remainingAmountDue) : remainingAmountDue;
    remainingAmountDue -= amount;
    return {...payment, amount};
  });

  try {
    const {data} = await apolloClient.mutate({
      mutation: buildOrderMutation,
      variables: {
        input: {
          order,
          payments: {amount: 0, method: "iou_example"}
        }
      }
    });

    // Placing the order was successful, so we should clear the
    // anonymous cart credentials from cookie since it will be
    // deleted on the server.
    // cartStore.clearAnonymousCartCredentials();
    // clearAuthenticatedUsersCart();
    //
    // // Also destroy the collected and cached payment input
    // cartStore.resetCheckoutPayments();

    const {buildOrder: {orders, token}} = data;
    // console.log(data, "chtuyaa")

    return data.buildOrder

    // Send user to order confirmation page
    // Router.push(`/checkout/order?orderId=${orders[0].referenceId}${token ? `&token=${token}` : ""}`);
  }
  catch (error) {
    console.log(error)
    // alert(error)
    // if (_isMounted) {
    //   setRState({
    //     hasPaymentError: true,
    //     isPlacingOrder: false,
    //     actionAlerts: {
    //       3: {
    //         alertType: "error",
    //         title: "Payment method failed",
    //         message: error.toString().replace("Error: GraphQL error:", "")
    //       }
    //     }
    //   });
    // }
  }
};






/**
 * withCart higher order query component for creating, fetching, and updating carts
 * @name WithCart
 * @param {React.Component} Component to decorate
 * @returns {React.Component} - Component with `cart` props and callbacks
 */
export default async function withCart(Component) {
  async function WithCart(componentProps) { // eslint-disable-line require-jsdoc
    const {
      cart,
      isLoadingCart,
      checkoutMutations,
      clearAuthenticatedUsersCart
    } = useRCart("cmVhY3Rpb24vc2hvcDpvRXNybmM5bXFCRHZ0NTJUVw==")

    const apolloClient = useApolloClient();
    const cartStore = useCartStore();
    const orderEmailAddress = (cart && cart.account && Array.isArray(cart.account.emailRecords) &&
      cart.account.emailRecords[0].address) || (cart ? cart.email : null);

    // console.log(rest, cart, cartStore, orderEmailAddress)
    const paymentMethods = [
      {
        displayName: "Credit Card",
        InputComponent: <>{"Credit Card"}</>,
        name: "stripe_card",
        shouldCollectBillingAddress: true
      },
      {
        displayName: "IOU",
        InputComponent: <>{"IOU"}</>,
        name: "iou_example",
        shouldCollectBillingAddress: true
      }
    ];

    const props = {
      apolloClient,
      cartStore,
      checkoutMutations,
      clearAuthenticatedUsersCart,
      orderEmailAddress,
      paymentMethods
    }

    const order = await buildOrder(cart, props)
    const postBuildOrderResult = await postBuildOrder(order, props);

    return (
      <Component {...componentProps} {...cart}/>
    );
  }

  hoistNonReactStatic(WithCart, Component);

  return WithCart;
}
