import React, {useContext, useState, useEffect} from 'react';
import Router from 'next/router';
import Link from 'next/link';
import {Button} from 'components/button/button';
import RadioCard from 'components/radio-card/radio-card';
import RadioGroup from 'components/radio-group/radio-group';
import PaymentGroup from 'components/payment-group/payment-group';
import UpdateAddress from 'components/address-card/address-card';
import UpdateContact from 'components/contact-card/contact-card';
import StripePaymentForm from 'features/payment/stripe-form';
import {DELETE_ADDRESS} from 'graphql/mutation/address';
import {DELETE_CARD} from 'graphql/mutation/card';
import {DELETE_CONTACT} from 'graphql/mutation/contact';
import {CURRENCY} from 'utils/constant';
import {openModal} from '@redq/reuse-modal';
import {useMutation} from '@apollo/react-hooks';
import {Scrollbars} from 'react-custom-scrollbars';
import CheckoutWrapper, {
  CheckoutContainer,
  CheckoutInformation,
  InformationBox,
  DeliverySchedule,
  Heading,
  ButtonGroup,
  CheckoutSubmit,
  HaveCoupon,
  CouponBoxWrapper,
  CouponInputBox,
  Input,
  CouponCode,
  RemoveCoupon,
  ErrorMsg,
  TermConditionText,
  TermConditionLink,
  CartWrapper,
  CalculationWrapper,
  OrderInfo,
  Title,
  ItemsWrapper,
  Items,
  Quantity,
  Multiplier,
  ItemInfo,
  Price,
  TextWrapper,
  Text,
  Bold,
  Small,
  NoProductMsg,
  IconWrapper, SubHeadings,
} from './checkout-two.style';

import {Plus} from 'assets/icons/PlusMinus';

import Sticky from 'react-stickynode';
// import { HeaderContext } from 'contexts/header/header.context';

import {ProfileContext} from 'contexts/profile/profile.context';
import {FormattedMessage} from 'react-intl';
import useCart from "hooks/cart/useCart";
import {useCart as usePBCart} from 'contexts/cart/use-cart';
import {APPLY_COUPON} from 'graphql/mutation/coupon';
import {useLocale} from 'contexts/language/language.provider';
import {useWindowSize} from 'utils/useWindowSize';
import {Header, SavedCard} from "src/components/payment-group/payment-group.style";
import {placeOrderMutation} from "hooks/orders/placeOrder.gql";
import {buildOrderMutation} from "hooks/orders/buildOrder.gql";
import PageLoading from "components/PageLoading/PageLoading";
import calculateRemainderDue from "lib/utils/calculateRemainderDue";
import {NextPage, GetStaticProps} from 'next';
import {useQuery} from '@apollo/react-hooks';
import {Modal} from '@redq/reuse-modal';
import {SEO} from 'src/components/seo';
import Checkout from 'src/features/checkouts/checkout-two/checkout-two';
import {GET_LOGGED_IN_CUSTOMER} from 'src/graphql/query/customer.query';

import {ProfileProvider} from 'src/contexts/profile/profile.provider';
import {useApolloClient} from "@apollo/client";
import CartEmptyMessage from "@reactioncommerce/components/CartEmptyMessage/v1";
import {StripeProvider} from "react-stripe-elements";
import {withApollo} from "lib/apollo/withApollo";

///reaction imports
import {isEqual} from "lodash";
import Actions from "@reactioncommerce/components/CheckoutActions/v1";
import ShippingAddressCheckoutAction from "@reactioncommerce/components/ShippingAddressCheckoutAction/v1";
import FulfillmentOptionsCheckoutAction from "@reactioncommerce/components/FulfillmentOptionsCheckoutAction/v1";
import PaymentsCheckoutAction from "@reactioncommerce/components/PaymentsCheckoutAction/v1";
import FinalReviewCheckoutAction from "@reactioncommerce/components/FinalReviewCheckoutAction/v1";
import {addTypographyStyles} from "@reactioncommerce/components/utils";
import withAddressValidation from "containers/address/withAddressValidation";
import Dialog from "@material-ui/core/Dialog";

import styled from "styled-components";
import useStores from "hooks/useStores";
import useShop from "hooks/shop/useShop";
import useTranslation from "hooks/useTranslation";
import useAvailablePaymentMethods from "hooks/availablePaymentMethods/useAvailablePaymentMethods";
import definedPaymentMethods from "custom/paymentMethods";
import CheckoutSummary from "components/CheckoutSummary/CheckoutSummary";
//import CheckoutActions from "components/CheckoutActions/CheckoutActions";
import Layout from "components/Layout/Layout";
import useAddressValidation from "hooks/address/useAddressValidation";

const MessageDiv = styled.div`
  ${addTypographyStyles("NoPaymentMethodsMessage", "bodyText")}
`;

const NoPaymentMethodsMessage = () => <MessageDiv>No payment methods available</MessageDiv>;

NoPaymentMethodsMessage.renderComplete = () => "";

///reaction imports

// The type of props Checkout Form receives
// interface MyFormProps {
//   token: string;
//   deviceType: any;
// }

type CartItemProps = {
  product: any;
};

const OrderItem: React.FC<CartItemProps> = ({product}) => {
  const {price} = product
  const displayPrice = price.displayAmount ? price.displayAmount : price.amount;
  return (
    <Items key={product._id}>
      <Quantity>{product.quantity}</Quantity>
      <Multiplier>x</Multiplier>
      <ItemInfo>
        {name ? name : product.title} {product.optionTitle ? `| ${product.optionTitle}` : ''}
      </ItemInfo>
      <Price>
        {CURRENCY}
        {(price.amount * product.quantity).toFixed(2)}
      </Price>
    </Items>
  );
};

const CheckoutWithSidebar = ({deviceType, ...props}) => {
  const [hasCoupon, setHasCoupon] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setError] = useState('');
  const {state, dispatch} = useContext(ProfileContext);
  const {isRtl} = useLocale();
  const {
    removeCoupon,
    coupon,
    applyCoupon,
    clearCart,
    cartItemsCount,
    calculatePrice,
    calculateDiscount,
    calculateSubTotalPrice,
    isRestaurant,
    toggleRestaurant,
  } = usePBCart();
  const [loading, setLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const {address, contact, card, schedules} = state;

  const [deleteContactMutation] = useMutation(DELETE_CONTACT);
  const [deleteAddressMutation] = useMutation(DELETE_ADDRESS);
  const [deletePaymentCardMutation] = useMutation(DELETE_CARD);
  const [appliedCoupon] = useMutation(APPLY_COUPON);
  const size = useWindowSize();
  //--console.log(props)



  // Add or edit modal
  const handleModal = (
    modalComponent: any,
    modalProps = {},
    className: string = 'add-address-modal'
  ) => {
    openModal({
      show: true,
      config: {
        width: 360,
        height: 'auto',
        enableResizing: false,
        disableDragging: true,
        className: className,
      },
      closeOnClickOutside: true,
      component: modalComponent,
      componentProps: {item: modalProps},
    });
  };


  const handleEditDelete = async (item: any, type: string, name: string) => {
    if (type === 'edit') {
      const modalComponent = name === 'address' ? UpdateAddress : UpdateContact;
      handleModal(modalComponent, item);
    } else {
      switch (name) {
        case 'payment':
          dispatch({type: 'DELETE_CARD', payload: item.id});

          return await deletePaymentCardMutation({
            variables: {cardId: JSON.stringify(item.id)},
          });
        case 'contact':
          dispatch({type: 'DELETE_CONTACT', payload: item.id});

          return await deleteContactMutation({
            variables: {contactId: JSON.stringify(item.id)},
          });
        case 'address':
          dispatch({type: 'DELETE_ADDRESS', payload: item.id});

          return await deleteAddressMutation({
            variables: {addressId: JSON.stringify(item.id)},
          });
        default:
          return false;
      }
    }
  };

  const handleApplyCoupon = async () => {
    const {data}: any = await appliedCoupon({
      variables: {code: couponCode},
    });
    if (data.applyCoupon && data.applyCoupon.discountInPercent) {
      applyCoupon(data.applyCoupon);
      setCouponCode('');
    } else {
      setError('Invalid Coupon');
    }
  };
  const handleOnUpdate = (code: any) => {
    setCouponCode(code);
  };

  // setIsValid(true)




  ///////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////////////
  let _isMounted = false;
  const [orderStatus, setOrderStatus] = useState("")
  const [postBuildOrderResult, setPostBuildOrderResult] = useState()
  const {
    cart,
    isLoadingCart
  } = useCart("cmVhY3Rpb24vc2hvcDpvRXNybmM5bXFCRHZ0NTJUVw==")
  // const [cart, setCart] = useState()
  const [stateForAction, setStateForAction] = useState({
    shipping:{
      isActive: true, isSaving: false, readyForSave: false
    },
    shippingMode:{
      isActive: true, isSaving: false, readyForSave: false
    }
  })
  const [RState, setRState] = useState({
    actionAlerts: {
      1: null,
      2: null,
      3: null,
      4: null
    },
    hasPaymentError: false,
    isPlacingOrder: false
  });
  let _refs = {shipping:{submit: ()=>{}}, shippingMode:{submit: ()=>{}}}
  const {cartStore} = useStores();
  // const shop = useShop();
  // Filter the hard-coded definedPaymentMethods list from the client to remove any
  // payment methods that were not returned from the API as currently available.



  const [availablePaymentMethods = [], isLoadingAvailablePaymentMethods] = useAvailablePaymentMethods();
  const hasIdentity = !!((cart && cart.account !== null) || (cart && cart.email));
  const paymentMethods = definedPaymentMethods.filter((method) =>
    !!availablePaymentMethods.find((availableMethod) => availableMethod.name === method.name));


  //const pageTitle = hasIdentity ? `Checkout | ${shop && shop.name}` : `Login | ${shop && shop.name}`;
  const orderEmailAddress = (cart && cart.account && Array.isArray(cart.account.emailRecords) &&
    cart.account.emailRecords[0].address) || (cart ? cart.email : null);

  // console.log(cart, "9857")


  const buildOrder = async (cart) => {
    console.log(RState)
    // alert('buildo')
    const { cartStore, orderEmailAddress} = props;
    // console.log(props, "bhehen hod")
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
  const postBuildOrder = async (order) => {
    const {cartStore, clearAuthenticatedUsersCart, apolloClient} = props;
    // console.log(props, "sxwsxwkoxnwoxsnkon")

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
      console.log(data, "chtuyaa")
      return data.buildOrder

      // Send user to order confirmation page
      // Router.push(`/checkout/order?orderId=${orders[0].referenceId}${token ? `&token=${token}` : ""}`);
    }
    catch (error) {
      console.log(error)
      // alert(error)
      if (_isMounted) {
        setRState({
          hasPaymentError: true,
          isPlacingOrder: false,
          actionAlerts: {
            3: {
              alertType: "error",
              title: "Payment method failed",
              message: error.toString().replace("Error: GraphQL error:", "")
            }
          }
        });
      }
    }
  };



  async function buildOrderOnLoad(cart) {
    setRState({isPlacingOrder: true})
    setOrderStatus("Loading your Bag of Crafts...")
    const order = await buildOrder(cart)
    //alert(order)
    // console.log(order, "pulkitt")
    const postBuildOrderResult = await postBuildOrder(order);
    //return postBuildOrderResult
    setPostBuildOrderResult(postBuildOrderResult)
    setRState({isPlacingOrder: false})
    setOrderStatus("")
  }

  useEffect(()=>{
    if(!isLoadingCart) {
      buildOrderOnLoad(cart)

    }
    // console.log(cart, "hrlpppppoooooo")
  }, [isLoadingCart])

  useEffect(() => {
    // Skipping if the `cart` is not available
    if (!cart) return;
    if (!hasIdentity) {
      Router.push("/signin");
    }
  }, [cart, hasIdentity, Router]) ; // eslint-disable-line no-sequences

  useEffect(() => {
    return () => {
      _isMounted = false;
    }
  });

  useEffect(() => {
    if (
      calculatePrice() > 0 &&
      cartItemsCount > 0 &&
      address.length &&
      contact.length &&
      card.length &&
      schedules.length
    ) {
      setIsValid(true);
    }
  }, [state]);






  if (cart.items.length < 1) {
    return (
      <div id="emptyCartContainer">
        <div id="emptyCart">
          <div>
            <PageLoading delay={0}/>
            {/*<CartEmptyMessage onClick={() => Router.push("/")} messageText="Your Shopping Cart is Empty"*/}
            {/*                  buttonText="Continue Shopping"/>*/}
          </div>
        </div>
      </div>
    );
  }

  if (hasIdentity && cart) {
    if (cart && Array.isArray(cart.items) && cart.items.length === 0) {
      return (
        <div id="emptyCartContainer">
          <div id="emptyCart">
            <div>
              <PageLoading delay={0}/>
              {/*<CartEmptyMessage onClick={() => Router.push("/")} messageText="Your Shopping Cart is Empty"*/}
              {/*                  buttonText="Continue Shopping"/>*/}
            </div>
          </div>
        </div>
      );
    }
  }




  ///////////////////////////////////////////////////////////////












  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////




  //
  // const {locale, t} = useTranslation("common"); // eslint-disable-line no-unused-vars, id-length
  // // TODO: implement address validation
  // const [addressValidation, addressValidationResults] = useAddressValidation();
  //
  // const [stripe, setStripe] = React.useState();
  /*
    React.useEffect(() => {
      if (!stripe && process.env.STRIPE_PUBLIC_API_KEY && window && window.Stripe) {
        //setStripe(window.Stripe(process.env.STRIPE_PUBLIC_API_KEY));
      }
    }), [stripe]; // eslint-disable-line no-sequences
  */

 // const token = 'true';





  //
  // if (isLoadingAvailablePaymentMethods) {
  //   return (
  //     <Layout shop={shop}>
  //       <PageLoading delay={0}/>
  //     </Layout>
  //   );
  // }



// rection checkout start here: cart/checkout.tsx

  const setShippingAddress = async (address) => {
    const {checkoutMutations: {onSetShippingAddress}} = props;
    delete address.isValid;
    const {data, error} = await onSetShippingAddress(address);

    if (data && !error && _isMounted) {
      setRState({
        actionAlerts: {
          1: {}
        }
      });
    }
  };

  const setShippingMethod = async (shippingMethod) => {
    const {checkoutMutations: {onSetFulfillmentOption}} = props;
    const {checkout: {fulfillmentGroups}} = cart;
    const fulfillmentOption = {
      fulfillmentGroupId: fulfillmentGroups[0]._id,
      fulfillmentMethodId: shippingMethod.selectedFulfillmentOption.fulfillmentMethod._id
    };
    await onSetFulfillmentOption(fulfillmentOption);
  };

  // const shippingMethod = () => {
  //   const {checkout: {fulfillmentGroups}} = cart;
  //   const {selectedFulfillmentOption} = fulfillmentGroups[0];
  //   return selectedFulfillmentOption ? selectedFulfillmentOption.fulfillmentMethod.displayName : null;
  // }
  //
  // const paymentMethod = () => {
  //   const [firstPayment] = props.cartStore.checkoutPayments;
  //   return firstPayment ? firstPayment.payment.method : null;
  // }
  //
  // const buildData = ({step, action}) => ({
  //   action,
  //   payment_method: paymentMethod(), // eslint-disable-line camelcase
  //   shipping_method: shippingMethod(), // eslint-disable-line camelcase
  //   step
  // });
  //
  // const handleValidationErrors = () => {
  //   const {addressValidationResults} = props;
  //   const {validationErrors} = addressValidationResults || [];
  //   const shippingAlert =
  //     validationErrors && validationErrors.length ? {
  //       alertType: validationErrors[0].type,
  //       title: validationErrors[0].summary,
  //       message: validationErrors[0].details
  //     } : null;
  //   setRState({actionAlerts: {1: shippingAlert}});
  // }
  //
  //
  // const handlePaymentSubmit = (paymentInput) => {
  //   props.cartStore.addCheckoutPayment(paymentInput);
  //   setRState({
  //     hasPaymentError: false,
  //     actionAlerts: {
  //       3: {}
  //     }
  //   });
  // };
  //
  // const handlePaymentsReset = () => {
  //   props.cartStore.resetCheckoutPayments();
  // }



    // order_id: "order_Ff7KkZqG7sprT4",

  //
  //
  //   /////////////////////
  //
  //   const { clearAuthenticatedUsersCart, apolloClient} = props;
  //
  //   // Payments can have `null` amount to mean "remaining".
  //   let remainingAmountDue = order.fulfillmentGroups.reduce((sum, group) => sum + group.totalPrice, 0);
  //   cartStore.resetCheckoutPayments()
  //   cartStore.addCheckoutPayment({payment: {amount: order.fulfillmentGroups[0].totalPrice, method: "iou_example"}});
  //
  //   const payments = cartStore.checkoutPayments.map(({payment}) => {
  //     // remainingAmountDue = 90
  //     console.log(remainingAmountDue, payment, "ononnon")
  //     // payment.amount = remainingAmountDue
  //     const amount = payment.amount ? Math.min(payment.amount, remainingAmountDue) : remainingAmountDue;
  //     remainingAmountDue -= amount;
  //     return {...payment, amount};
  //   });
  //
  //   try {
  //     const {data} = await apolloClient.mutate({
  //       mutation: buildOrderMutation,
  //       variables: {
  //         input: {
  //           order,
  //           payments
  //         }
  //       }
  //     });
  //
  //     // Placing the order was successful, so we should clear the
  //     // anonymous cart credentials from cookie since it will be
  //     // deleted on the server.
  //     //
  //     // cartStore.clearAnonymousCartCredentials();
  //     // clearAuthenticatedUsersCart();
  //     //
  //     // // Also destroy the collected and cached payment input
  //     // cartStore.resetCheckoutPayments();
  //
  //     const {buildOrder: {orders, token}} = data;
  //     console.log(data, "pulkit9999999999999999999999...........")
  //
  //     // Send user to order confirmation page
  //     Router.push(`/checkout/order?orderId=${orders[0].referenceId}${token ? `&token=${token}` : ""}`);
  //   }
  //   catch (error) {
  //     console.log(error)
  //     // alert(error)
  //     if (_isMounted) {
  //       setRState({
  //         hasPaymentError: true,
  //         isPlacingOrder: false,
  //         actionAlerts: {
  //           3: {
  //             alertType: "error",
  //             title: "Payment method failed",
  //             message: error.toString().replace("Error: GraphQL error:", "")
  //           }
  //         }
  //       });
  //     }
  //   }
  // };









  const placeOrder = async (order, paymentsOrderId) => {
    const {cartStore, clearAuthenticatedUsersCart, apolloClient} = props;
    console.log(postBuildOrderResult, "rishabh")

    // Payments can have `null` amount to mean "remaining".
    // props.cartStore.resetCheckoutPayments()
    // props.cartStore.addCheckoutPayment({payment: {amount: order.fulfillmentGroups[0].totalPrice, method: "iou_example"}});


    try {
      const {data} = await apolloClient.mutate({
        mutation: placeOrderMutation,
        variables: {
          input: {
            order: {paymentsOrderId, ...order},
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
      console.log(data, "chtuyaa")

      return data.buildOrder

      // Send user to order confirmation page
      // Router.push(`/checkout/order?orderId=${orders[0].referenceId}${token ? `&token=${token}` : ""}`);
    }
    catch (error) {
      console.log(error)
      // alert(error)
      if (_isMounted) {
        setRState({
          hasPaymentError: true,
          isPlacingOrder: false,
          actionAlerts: {
            3: {
              alertType: "error",
              title: "Payment method failed",
              message: error.toString().replace("Error: GraphQL error:", "")
            }
          }
        });
      }
    }
  };



  const razorpay_button_trigger = async (event)=>{
    setRState({isPlacingOrder: true})
    setOrderStatus("Waiting for Payment...")
    console.log(postBuildOrderResult, "huhuityyaiiii01")
    const order = await buildOrder()
    const placeOrderResult = await placeOrder(order, postBuildOrderResult.PaymentServiceOrder);
    console.log(placeOrderResult, "huhuityyaiiii02")

    // setRState({isPlacingOrder: false})

    await new Promise(r => setTimeout(r, 2000));

    const options = {
      "key": "rzp_test_VyHOtrGoIorndg", // Enter the Key ID generated from the Dashboard
      "amount": postBuildOrderResult?.orders[0].fulfillmentGroups[0].summary.total.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      "currency": "INR",
      "name": "Payment",
      "handler": function (response){
        alert(response.razorpay_payment_id);
        alert(response.razorpay_order_id);
        alert(response.razorpay_signature)
      },
      "description": "ID: " + postBuildOrderResult?.PaymentServiceOrder,
      "image": "https://make.craflo.com/assets/image/logo.png",
      "order_id": postBuildOrderResult?.PaymentServiceOrder, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      "callback_url": "https://eneqd3r9zrjok.x.pipedream.net/",
      "prefill": {
        "name": "Gaurav Kumar",
        "email": "gaurav.kumar@gmail.com",
        "contact": "9517734512"
      },
      "modal": {
        "ondismiss": function(){
          setRState({isPlacingOrder: false})
        }
      },
      "notes": {
        "address": "Craflo Retail POS"
      },
      "theme": {
        "hide_topbar": true,
        "color": "#009E7F"
      }

    };
    const rzp1 = new window.Razorpay(options);

    rzp1.open();
    event.preventDefault();
  }


  const renderPlacingOrderOverlay = () => {
    const {isPlacingOrder} = RState;

    return (
      <Dialog fullScreen disableBackdropClick={true} disableEscapeKeyDown={true} open={isPlacingOrder}>
        <PageLoading delay={0} message={orderStatus}/>
      </Dialog>
    );
  };

  // useEffect(({ addressValidationResults: prevAddressValidationResults }) => {
  //   const { addressValidationResults } = props;
  //   if (
  //     addressValidationResults &&
  //     prevAddressValidationResults &&
  //     !isEqual(addressValidationResults, prevAddressValidationResults)
  //   ) {
  //     handleValidationErrors();
  //   }
  //   _isMounted = true;
  // });


  const {checkout: {fulfillmentGroups, summary}} = cart;
  const [fulfillmentGroup] = fulfillmentGroups;

  // Order summary
  const {fulfillmentTotal, itemTotal, surchargeTotal, taxTotal, total} = summary;
  const checkoutSummary = {
    displayShipping: fulfillmentTotal && fulfillmentTotal.displayAmount,
    displaySubtotal: itemTotal.displayAmount,
    displaySurcharge: surchargeTotal.displayAmount,
    displayTotal: total.displayAmount,
    displayTax: taxTotal && taxTotal.displayAmount,
    items: cart.items
  };

  const addresses = fulfillmentGroups.reduce((list, group) => {
    if (group.shippingAddress) list.push(group.shippingAddress);
    return list;
  }, []);

  const payments = cartStore.checkoutPayments.slice();
  const remainingAmountDue = calculateRemainderDue(payments, total.amount);

  let PaymentComponent = PaymentsCheckoutAction;
  if (!Array.isArray(paymentMethods) || paymentMethods.length === 0) {
    PaymentComponent = NoPaymentMethodsMessage;
  }

  // const {actionAlerts} = RState;



  const handleActionSubmit = async (label, onSubmit, actionValue) => {
    label=="shipping" ? setStateForAction({shipping: {isActive: false, isSaving: true}}): null;
    label=="shippingMode" ? setStateForAction({shippingMode: {isActive: false, isSaving: true}}): null;

    await onSubmit(actionValue);

    label=="shipping" ? setStateForAction({shipping: {isSaving: false}}): null;
    label=="shippingMode" ? setStateForAction({shippingMode: {isSaving: false}}): null;
  };

  const actionSubmit = (label) => {
    _refs[label].submit();
  };

  actionSubmit("shipping")





  // const actions = [
  //   {
  //     id: "1",
  //     activeLabel: "Enter a shipping address",
  //     completeLabel: "Shipping address",
  //     incompleteLabel: "Shipping address",
  //     status: fulfillmentGroup.type !== "shipping" || fulfillmentGroup.shippingAddress ? "complete" : "incomplete",
  //     component: ShippingAddressCheckoutAction,
  //     onSubmit: setShippingAddress,
  //     props: {
  //       addressValidationResults,
  //       alert: () => {
  //       },
  //       fulfillmentGroup,
  //       onAddressValidation: addressValidation
  //     }
  //   },
  //   {
  //     id: "2",
  //     activeLabel: "Choose a shipping method",
  //     completeLabel: "Shipping method",
  //     incompleteLabel: "Shipping method",
  //     status: fulfillmentGroup.selectedFulfillmentOption ? "complete" : "incomplete",
  //     component: FulfillmentOptionsCheckoutAction,
  //     onSubmit: setShippingMethod,
  //     props: {
  //       alert: () => {
  //       },
  //       fulfillmentGroup
  //     }
  //   },
  //   // {
  //   //   id: "3",
  //   //   activeLabel: "Enter payment information",
  //   //   completeLabel: "Payment information",
  //   //   incompleteLabel: "Payment information",
  //   //   status: remainingAmountDue === 0 && !RState.hasPaymentError ? "complete" : "incomplete",
  //   //   component: PaymentComponent,
  //   //   onSubmit: handlePaymentSubmit,
  //   //   props: {
  //   //     addresses,
  //   //     alert: RState.actionAlerts["3"],
  //   //     onReset: handlePaymentsReset,
  //   //     payments,
  //   //     paymentMethods,
  //   //     remainingAmountDue
  //   //   }
  //   // },
  //   {
  //     id: "4",
  //     activeLabel: "Review and place order",
  //     completeLabel: "Review and place order",
  //     incompleteLabel: "Review and place order",
  //     status: "incomplete",
  //     component: FinalReviewCheckoutAction,
  //     onSubmit: buildOrder,
  //     props: {
  //       alert: (e) => {
  //         console.log(e)
  //       },
  //       checkoutSummary,
  //       productURLPath: "/api/detectLanguage/product/"
  //     }
  //   }
  // ];

  //

  return (
    <>
      {renderPlacingOrderOverlay()}
      {/*<Actions actions={actions}/>*/}
      <form>
        <CheckoutWrapper>
          <CheckoutContainer>
            <CheckoutInformation>

              {/* Login Form *//*
              <InformationBox>
                <Heading>
                  <FormattedMessage
                    id='loginCheckoutText'
                    defaultMessage='Login'
                  />
                </Heading>
                <ButtonGroup>
                  <RadioGroup
                    items={contact}
                    component={(item: any) => (
                      <RadioCard
                        id={item.id}
                        key={item.id}
                        title={item.type}
                        content={item.number}
                        checked={item.type === 'primary'}
                        onChange={() =>
                          dispatch({
                            type: 'SET_PRIMARY_CONTACT',
                            payload: item.id.toString(),
                          })
                        }
                        name='contact'
                        onEdit={() => handleEditDelete(item, 'edit', 'contact')}
                        onDelete={() =>
                          handleEditDelete(item, 'delete', 'contact')
                        }
                      />
                    )}
                  />
                </ButtonGroup>
              </InformationBox>*/
              }


              {/* DeliveryAddress */}
              <InformationBox>
                <Heading>
                  <FormattedMessage
                    id='checkoutDeliveryAddress'
                    defaultMessage='Delivery Address'
                  />
                </Heading>
                <ButtonGroup>
                  <RadioGroup
                    items={address}
                    component={(item: any) => (
                      <RadioCard
                        id={item.id}
                        key={item.id}
                        title={item.name}
                        content={item.info}
                        name='address'
                        checked={item.type === 'primary'}
                        onChange={() =>
                          dispatch({
                            type: 'SET_PRIMARY_ADDRESS',
                            payload: item.id.toString(),
                          })
                        }
                        onEdit={() => handleEditDelete(item, 'edit', 'address')}
                        onDelete={() =>
                          handleEditDelete(item, 'delete', 'address')
                        }
                      />
                    )}
                    secondaryComponent={
                      <Button
                        className='addButton'
                        variant='text'
                        type='button'
                        onClick={() =>
                          handleModal(UpdateAddress, 'add-address-modal')
                        }
                      >
                        <IconWrapper>
                          <Plus width='10px'/>
                        </IconWrapper>
                        <FormattedMessage id='addNew' defaultMessage='Add New'/>
                      </Button>
                    }
                  />
                </ButtonGroup>
                <ShippingAddressCheckoutAction
                  fulfillmentGroup={fulfillmentGroup}
                  onReadyForSaveChange={(ready) => {
                    setStateForAction({shipping:{readyForSave: ready}});
                  }}
                  label= ""
                  stepNumber = ""
                  isSaving={false}
                  ref={(el) => {
                    _refs["shipping"] = el;
                  }}
                  onSubmit={(value) => handleActionSubmit("shipping", setShippingAddress, value)}
                />
                <Button
                  type='button'
                  onClick={()=>actionSubmit("shipping")}
                  disabled={!true}
                  size='big'
                  // loading={loading}
                  style={{width: '6rem', float:'right'}}
                >
                  <FormattedMessage
                    id='proceesCheckoxut'
                    defaultMessage='Save'
                  />
                </Button>
              </InformationBox>

              {/* DeliverySchedule */}
              <InformationBox>
                <DeliverySchedule>
                  <Heading>
                    <FormattedMessage
                      id='deliverySchedule'
                      defaultMessage='Select Your Delivery Schedule'
                    />
                  </Heading>
                  <RadioGroup
                    items={schedules}
                    component={(item: any) => (
                      <RadioCard
                        id={item.id}
                        key={item.id}
                        title={item.title}
                        content={item.time_slot}
                        name='schedule'
                        checked={item.type === 'primary'}
                        withActionButtons={false}
                        onChange={() =>
                          dispatch({
                            type: 'SET_PRIMARY_SCHEDULE',
                            payload: item.id.toString(),
                          })
                        }
                      />
                    )}
                  />
                </DeliverySchedule>
                <Header>
                  <SavedCard>
                    <FormattedMessage id="deliveryContactId" defaultMessage="Contact for Delivery"/>
                  </SavedCard>

                  <Button
                    variant="text"
                    type="button"
                    className="addCard"
                  >
                    <IconWrapper>
                      <Plus width="10px"/>
                    </IconWrapper>
                    <FormattedMessage id="addContactBtn" defaultMessage="Add Contact"/>
                  </Button>
                </Header>
                <ButtonGroup>
                  <RadioGroup
                    items={contact}
                    component={(item: any) => (
                      <RadioCard
                        id={item.id}
                        key={item.id}
                        title={item.type}
                        content={item.number}
                        checked={item.type === 'primary'}
                        onChange={() =>
                          dispatch({
                            type: 'SET_PRIMARY_CONTACT',
                            payload: item.id.toString(),
                          })
                        }
                        name='contact'
                        onEdit={() => handleEditDelete(item, 'edit', 'contact')}
                        onDelete={() =>
                          handleEditDelete(item, 'delete', 'contact')
                        }
                      />
                    )}
                  />
                </ButtonGroup>
                {/*<FulfillmentOptionsCheckoutAction fulfillmentGroup={fulfillmentGroup} />*/}
                <FulfillmentOptionsCheckoutAction
                  fulfillmentGroup={fulfillmentGroup}
                  onReadyForSaveChange={(ready) => {
                    setStateForAction({shippingMode:{readyForSave: ready}});
                  }}
                  label= ""
                  stepNumber={""}
                  isSaving={false}
                  ref={(el) => {
                    _refs["shippingMode"] = el;
                  }}
                  onSubmit={(value) => handleActionSubmit("shippingMode", setShippingMethod, value)}
                />
                <Button
                  type='button'
                  onClick={()=>actionSubmit("shippingMode")}
                  disabled={!true}
                  size='big'
                  // loading={loading}
                  style={{width: '6rem', float:'right'}}
                >
                  <FormattedMessage
                    id='proceesCheckoxut'
                    defaultMessage='Save'
                  />
                </Button>
              </InformationBox>


              {/*/!* PaymentOption *!/*/}
              {/*<InformationBox*/}
              {/*  className='paymentBox'*/}
              {/*  style={{paddingBottom: 30}}*/}
              {/*>*/}
              {/*  <Heading>*/}
              {/*    <FormattedMessage*/}
              {/*      id='selectPaymentText'*/}
              {/*      defaultMessage='Select Payment Option'*/}
              {/*    />*/}
              {/*  </Heading>*/}
              {/*  <PaymentGroup*/}
              {/*    name='payment'*/}
              {/*    deviceType={deviceType}*/}
              {/*    items={[]}*/}
              {/*    onEditDeleteField={(item: any, type: string) =>*/}
              {/*      handleEditDelete(item, type, 'payment')*/}
              {/*    }*/}
              {/*    onChange={(item: any) =>*/}
              {/*      dispatch({*/}
              {/*        type: 'SET_PRIMARY_CARD',*/}
              {/*        payload: item.id.toString(),*/}
              {/*      })*/}
              {/*    }*/}
              {/*    handleAddNewCard={() => {*/}
              {/*      handleModal(*/}
              {/*        StripePaymentForm,*/}
              {/*        {totalPrice: calculatePrice()},*/}
              {/*        'add-address-modal stripe-modal'*/}
              {/*      );*/}
              {/*    }}*/}
              {/*  />*/}

              {/*  /!* Coupon start *!/*/}
              {/*  {coupon ? (*/}
              {/*    <CouponBoxWrapper>*/}
              {/*      <CouponCode>*/}
              {/*        <FormattedMessage id='couponApplied'/>*/}
              {/*        <span>{coupon.code}</span>*/}

              {/*        <RemoveCoupon*/}
              {/*          onClick={(e) => {*/}
              {/*            e.preventDefault();*/}
              {/*            removeCoupon();*/}
              {/*            setHasCoupon(false);*/}
              {/*          }}*/}
              {/*        >*/}
              {/*          <FormattedMessage id='removeCoupon'/>*/}
              {/*        </RemoveCoupon>*/}
              {/*      </CouponCode>*/}
              {/*    </CouponBoxWrapper>*/}
              {/*  ) : (*/}
              {/*    <CouponBoxWrapper>*/}
              {/*      {!hasCoupon ? (*/}
              {/*        <HaveCoupon onClick={() => setHasCoupon((prev) => !prev)}>*/}
              {/*          <FormattedMessage*/}
              {/*            id='specialCode'*/}
              {/*            defaultMessage='Have a special code?'*/}
              {/*          />*/}
              {/*        </HaveCoupon>*/}
              {/*      ) : (*/}
              {/*        <>*/}
              {/*          <CouponInputBox>*/}
              {/*            <Input*/}
              {/*              onUpdate={handleOnUpdate}*/}
              {/*              value={couponCode}*/}
              {/*              intlPlaceholderId='couponPlaceholder'*/}
              {/*            />*/}
              {/*            /!* <Button*/}
              {/*            onClick={handleApplyCoupon}*/}
              {/*            title='Apply'*/}
              {/*            intlButtonId='voucherApply'*/}
              {/*          /> *!/*/}
              {/*            <Button*/}
              {/*              type='button'*/}
              {/*              onClick={handleApplyCoupon}*/}
              {/*              size='big'*/}
              {/*            >*/}
              {/*              <FormattedMessage*/}
              {/*                id='voucherApply'*/}
              {/*                defaultMessage='Apply'*/}
              {/*              />*/}
              {/*            </Button>*/}
              {/*          </CouponInputBox>*/}

              {/*          {couponError && (*/}
              {/*            <ErrorMsg>*/}
              {/*              <FormattedMessage*/}
              {/*                id='couponError'*/}
              {/*                defaultMessage={couponError}*/}
              {/*              />*/}
              {/*            </ErrorMsg>*/}
              {/*          )}*/}
              {/*        </>*/}
              {/*      )}*/}
              {/*    </CouponBoxWrapper>*/}
              {/*  )}*/}

              {/*  <TermConditionText>*/}
              {/*    <FormattedMessage*/}
              {/*      id='termAndConditionHelper'*/}
              {/*      defaultMessage='By making this purchase you agree to our'*/}
              {/*    />*/}
              {/*    <Link href='#'>*/}
              {/*      <TermConditionLink>*/}
              {/*        <FormattedMessage*/}
              {/*          id='termAndCondition'*/}
              {/*          defaultMessage='terms and conditions.'*/}
              {/*        />*/}
              {/*      </TermConditionLink>*/}
              {/*    </Link>*/}
              {/*  </TermConditionText>*/}

              {/*  /!* CheckoutSubmit *!/*/}
              {/*  <CheckoutSubmit>*/}
              {/*    /!* <Button*/}
              {/*    onClick={handleSubmit}*/}
              {/*    type='button'*/}
              {/*    disabled={!isValid}*/}
              {/*    title='Proceed to Checkout'*/}
              {/*    intlButtonId='proceesCheckout'*/}
              {/*    loader={<Loader />}*/}
              {/*    isLoading={loading}*/}
              {/*  /> *!/*/}

              {/*    <Button*/}
              {/*      type='button'*/}
              {/*      onClick={handleSubmit}*/}
              {/*      disabled={!isValid}*/}
              {/*      size='big'*/}
              {/*      loading={loading}*/}
              {/*      style={{width: '100%'}}*/}
              {/*    >*/}
              {/*      <FormattedMessage*/}
              {/*        id='proceesCheckout'*/}
              {/*        defaultMessage='Proceed to Checkout'*/}
              {/*      />*/}
              {/*    </Button>*/}
              {/*  </CheckoutSubmit>*/}
              {/*</InformationBox>*/}
            </CheckoutInformation>

            <CartWrapper>
              {/* <Sticky enabled={true} top={totalHeight} innerZ={999}> */}
              <Sticky
                enabled={size.width >= 768 ? true : false}
                top={120}
                innerZ={999}
              >
                <OrderInfo>
                  <Title>
                    <FormattedMessage
                      id='cartTitle'
                      defaultMessage='Your Order'
                    />
                  </Title>

                  <Scrollbars
                    universal
                    autoHide
                    autoHeight
                    autoHeightMax='390px'
                    renderView={(props) => (
                      <div
                        {...props}
                        style={{
                          ...props.style,
                          marginLeft: isRtl ? props.style.marginRight : 0,
                          marginRight: isRtl ? 0 : props.style.marginRight,
                          paddingLeft: isRtl ? 15 : 0,
                          paddingRight: isRtl ? 0 : 15,
                        }}
                      />
                    )}
                  >
                    <ItemsWrapper>
                      {cart.items.length > 0 ? (
                        cart.items.map((item) => (
                          <OrderItem key={`cartItem-${item._id}`} product={item}/>
                        ))
                      ) : (
                        <NoProductMsg>
                          <FormattedMessage
                            id='noProductFound'
                            defaultMessage='No products found'
                          />
                        </NoProductMsg>
                      )}
                    </ItemsWrapper>
                  </Scrollbars>

                  <CalculationWrapper>
                    <TextWrapper>
                      <Text>
                        <FormattedMessage
                          id='subTotal'
                          defaultMessage='Subtotal'
                        />
                      </Text>
                      <Text>
                        {CURRENCY}
                        {calculateSubTotalPrice()}
                      </Text>
                    </TextWrapper>

                    <TextWrapper>
                      <Text>
                        <FormattedMessage
                          id='intlOrderDetailsDelivery'
                          defaultMessage='Delivery Fee'
                        />
                      </Text>
                      <Text>{CURRENCY}21</Text>
                    </TextWrapper>

                    <TextWrapper>
                      <Text>
                        <FormattedMessage
                          id='discountText'
                          defaultMessage='Discount'
                        />
                      </Text>
                      <Text>
                        {CURRENCY}
                        {calculateDiscount()}
                      </Text>
                    </TextWrapper>

                    <TextWrapper style={{marginTop: 20}}>
                      <Bold>
                        <FormattedMessage id='totalText' defaultMessage='Total'/>{' '}
                        <Small>
                          (
                          <FormattedMessage
                            id={"GSTLabel"}
                            defaultMessage='Incl. GST (IGST+CGST)'
                          />
                          )
                        </Small>
                      </Bold>
                      <Bold>
                        {CURRENCY}
                        {postBuildOrderResult?.orders[0].fulfillmentGroups[0].summary.total.amount}
                      </Bold>
                    </TextWrapper>
                  </CalculationWrapper>
                </OrderInfo>
                <Button
                  type='button'
                  onClick={(e)=>razorpay_button_trigger(e)}
                  disabled={!true}
                  size='big'
                  // loading={loading}
                  style={{width: '100%'}}
                >
                  <FormattedMessage
                    id='proceesCheckoxut'
                    defaultMessage='Proceed to Payment'
                  />
                </Button>
              </Sticky>
            </CartWrapper>
          </CheckoutContainer>
        </CheckoutWrapper>
      </form>
    </>
  );
};

export default withApollo()(withAddressValidation(CheckoutWithSidebar));
