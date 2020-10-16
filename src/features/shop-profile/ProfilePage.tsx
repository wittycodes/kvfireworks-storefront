/*!

=========================================================
* Paper Kit React - v1.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/paper-kit-react

* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/paper-kit-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";

// reactstrap components
import {
  Label,
  FormGroup,
  Input,
  Nav,
  TabContent,
  TabPane,
  Container,
  Row,
  Col,
} from "reactstrap";
import { Button } from 'components/button/button';
// core components
import ExamplesNavbar from "src/paper-kit-react/src/components/Navbars/ExamplesNavbar.js";
import ProfilePageHeader from "src/paper-kit-react/src/components/Headers/ProfilePageHeader.js";
import DemoFooter from "src/paper-kit-react/src/components/Footers/DemoFooter.js";
import Footer from "../../layouts/footer";
import CartPopUp from "../../features/carts/cart-popup";
import {
  CategoriesInner,
  CategoriesWrapper,
  DeliveryOpt,
  InfoBlock, Infos, ProductDetailsWrapper,
  ProductPreview, RestaurantAddress,
  RestaurantMeta, RestaurantName, RestaurantNameAddress, RestaurantOtherInfos
} from "src/components/product-details/product-details-three/product-details-three.style";
import {CURRENCY} from "src/utils/constant";
import {useCart} from "src/contexts/cart/use-cart";
import {groupBy} from "src/utils/groupBy";
import Sticky from 'react-stickynode';
import { themeGet } from '@styled-system/theme-get';
// import Carousel from 'react-multi-carousel';
import styled from 'styled-components';
import {ButtonText} from "../../components/product-card/product-card.style";


export const SettingsButton = styled(Button)`
  background: ${themeGet('colors.primary', '#009E7F')};
  border: 0;
  color: #ffffff;
  border-radius: 18px;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  padding-left: 0;
  padding-right: 0;
  font-size: ${themeGet('fontSizes.1', '13')}px;
  font-weight: ${themeGet('fontWeights.6', '700')};
  position: absolute;
  bottom: 20px;
  right: 15px;
  box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.3);
  z-index: 1;

  @media (max-width: 767px) {
    width: 32px;
    height: 32px;
    padding: 0;
    border-radius: 50%;
  }
  .btn-text {
    padding: 0 0 0 6px;
    @media (max-width: 767px) {
      display: none;
    }
  }
  &:hover {
    background: ${themeGet('colors.primary', '#009E7F')};
  }
  svg {
    fill: currentColor;
  }
`;


function ProfilePage({deviceType, ...props}) {
  // console.log(props)
  const [activeTab, setActiveTab] = React.useState("1");

  const toggle = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };
  const { addItem, clearCart, toggleRestaurant, isInCart } = useCart();
  const handleAddClick = (values) => {
    addItem(values);
  };
  const checkoutStatus = React.useRef(null);
  const data = {
    previewUrl:"https://www.artwaley.com/images/stories/virtuemart/product/2595.jpg",
    name:"jake",
    categories:"",
    address:"knknkn",

  };

  React.useEffect(() => {
    clearCart();
    return () => {
      if (checkoutStatus.current === null) {
        clearCart();
      }
    };
  }, []);
  // const productGroups = groupBy(data?.products, 'type');

  const headerOffset = deviceType.mobile || deviceType.tablet ? -137 : -177;


  // document.documentElement.classList.remove("nav-open");
  // React.useEffect(() => {
  //   document.body.classList.add("landing-page");
  //   return function cleanup() {
  //     document.body.classList.remove("landing-page");
  //   };
  // });
  return (
    <>
      <ProfilePageHeader />
      <ProductDetailsWrapper>
        <ProductPreview>
          <img src={data?.previewUrl} alt={data?.name} />
        </ProductPreview>
        <Sticky
          top={deviceType.mobile || deviceType.tablet ? 68 : 78}
          innerZ={9999}
        >
          <RestaurantMeta id="restaurantMeta">
            <RestaurantNameAddress>
              <RestaurantName>{props.merchantShop?.shop.name}</RestaurantName>
              <RestaurantAddress>{props.merchantShop?.shop.emails[0]?.address}</RestaurantAddress>
            </RestaurantNameAddress>
            <div className="owner">
              <div className="avatar">
                <img
                  alt="..."
                  className="img-circle img-no-padding img-responsive"
                  src={require("assets/img/faces/joe-gardner-2.jpg")}
                  style={{border: "#fff solid 12px"}}
                />
              </div>
            </div>

            {/*<RestaurantOtherInfos>*/}
            {/*  <InfoBlock>*/}
            {/*    <Label>*/}
            {/*      {"Cuisine" }*/}
            {/*    </Label>*/}
            {/*    <Infos>{["knkn", "nkkn"].join(', ')}</Infos>*/}
            {/*  </InfoBlock>*/}

            {/*  <InfoBlock>*/}
            {/*    <Label>*/}
            {/*      {"Min Order"}*/}
            {/*    </Label>*/}
            {/*    <Infos>*/}
            {/*      {CURRENCY}*/}
            {/*      /!*{data?.deliveryDetails?.minimumOrder}*!/*/}
            {/*    </Infos>*/}
            {/*  </InfoBlock>*/}

            {/*  <DeliveryOpt>*/}
            {/*    /!*{data?.deliveryDetails?.isFree ? '' : CURRENCY}*!/*/}
            {/*    /!*{data?.deliveryDetails?.charge}*!/*/}
            {/*    <br />{' '}*/}
            {/*    {"Delivery"}*/}
            {/*  </DeliveryOpt>*/}
            {/*</RestaurantOtherInfos>*/}
          </RestaurantMeta>
        </Sticky>
        {/*<div id="cart-sticky">*/}


          {/*<Sticky*/}
          {/*  top={deviceType.mobile || deviceType.tablet ? 68 : 78}*/}
          {/*  innerZ={999}*/}
          {/*>*/}
          {/*  <CategoriesWrapper>*/}
          {/*    <CategoriesInner>*/}
          {/*      {Object.keys(productGroups).map((item, index) => (*/}
          {/*        <Link*/}
          {/*          activeClass="active"*/}
          {/*          className="category"*/}
          {/*          to={Object.keys(productGroups)[index]}*/}
          {/*          offset={headerOffset}*/}
          {/*          spy={true}*/}
          {/*          smooth={true}*/}
          {/*          duration={500}*/}
          {/*          key={index}*/}
          {/*        >*/}
          {/*          {item}*/}
          {/*        </Link>*/}
          {/*      ))}*/}
          {/*    </CategoriesInner>*/}
          {/*  </CategoriesWrapper>*/}
          {/*</Sticky>*/}
        {/*</div>*/}
      </ProductDetailsWrapper>
      <div className="section profile-content">
        <Container>
          <div className="owner">
            {/*<div className="avatar">*/}
            {/*  <img*/}
            {/*    alt="..."*/}
            {/*    className="img-circle img-no-padding img-responsive"*/}
            {/*    src={require("assets/img/faces/joe-gardner-2.jpg")}*/}
            {/*    style={{border: "#fafafa solid 4px"}}*/}
            {/*  />*/}
            {/*</div>*/}
            {/*<div className="name">*/}
            {/*  <h4 className="title">*/}
            {/*    Jane Faker <br />*/}
            {/*  </h4>*/}
            {/*  <h6 className="description">Music Producer</h6>*/}
            {/*</div>*/}
          </div>
          <Row>
            <Col style={{margin: 'auto'}} className="ml-auto mr-auto text-center" md="6">
              <p>
                {props.merchantShop?.shop.description}
              </p>
              <br />
              <Button  className="cart-button"
                      variant="secondary"
                      borderRadius={100} >
                <ButtonText>
                  <i className="fa fa-cog" /> {"Settings"}
                </ButtonText>
              </Button>
            </Col>
          </Row>
          <br />
          {/*<div className="nav-tabs-navigation">*/}
          {/*  <div className="nav-tabs-wrapper">*/}
          {/*    <Nav role="tablist" tabs>*/}
          {/*      <div>*/}
          {/*        <div*/}
          {/*          className={activeTab === "1" ? "active" : ""}*/}
          {/*          onClick={() => {*/}
          {/*            toggle("1");*/}
          {/*          }}*/}
          {/*        >*/}
          {/*          Follows*/}
          {/*        </div>*/}
          {/*      </div>*/}
          {/*      <div>*/}
          {/*        <div*/}
          {/*          className={activeTab === "2" ? "active" : ""}*/}
          {/*          onClick={() => {*/}
          {/*            toggle("2");*/}
          {/*          }}*/}
          {/*        >*/}
          {/*          Following*/}
          {/*        </div>*/}
          {/*      </div>*/}
          {/*    </Nav>*/}
          {/*  </div>*/}
          {/*</div>*/}
          {/*/!* Tab panes *!/*/}
          {/*<TabContent className="following" activeTab={activeTab}>*/}
          {/*  <TabPane tabId="1" id="follows">*/}
          {/*    <Row>*/}
          {/*      <Col className="ml-auto mr-auto" md="6">*/}
          {/*        <ul className="list-unstyled follows">*/}
          {/*          <li>*/}
          {/*            <Row>*/}
          {/*              <Col className="ml-auto mr-auto" lg="2" md="4" xs="4">*/}
          {/*                <img*/}
          {/*                  alt="..."*/}
          {/*                  className="img-circle img-no-padding img-responsive"*/}
          {/*                  src={require("assets/img/faces/clem-onojeghuo-2.jpg")}*/}
          {/*                />*/}
          {/*              </Col>*/}
          {/*              <Col className="ml-auto mr-auto" lg="7" md="4" xs="4">*/}
          {/*                <h6>*/}
          {/*                  Flume <br />*/}
          {/*                  <small>Musical Producer</small>*/}
          {/*                </h6>*/}
          {/*              </Col>*/}
          {/*              <Col className="ml-auto mr-auto" lg="3" md="4" xs="4">*/}
          {/*                <FormGroup check>*/}
          {/*                  <Label check>*/}
          {/*                    <Input*/}
          {/*                      defaultChecked*/}
          {/*                      defaultValue=""*/}
          {/*                      type="checkbox"*/}
          {/*                    />*/}
          {/*                    <span className="form-check-sign" />*/}
          {/*                  </Label>*/}
          {/*                </FormGroup>*/}
          {/*              </Col>*/}
          {/*            </Row>*/}
          {/*          </li>*/}
          {/*          <hr />*/}
          {/*          <li>*/}
          {/*            <Row>*/}
          {/*              <Col className="mx-auto" lg="2" md="4" xs="4">*/}
          {/*                <img*/}
          {/*                  alt="..."*/}
          {/*                  className="img-circle img-no-padding img-responsive"*/}
          {/*                  src={require("assets/img/faces/ayo-ogunseinde-2.jpg")}*/}
          {/*                />*/}
          {/*              </Col>*/}
          {/*              <Col lg="7" md="4" xs="4">*/}
          {/*                <h6>*/}
          {/*                  Banks <br />*/}
          {/*                  <small>Singer</small>*/}
          {/*                </h6>*/}
          {/*              </Col>*/}
          {/*              <Col lg="3" md="4" xs="4">*/}
          {/*                <FormGroup check>*/}
          {/*                  <Label check>*/}
          {/*                    <Input defaultValue="" type="checkbox" />*/}
          {/*                    <span className="form-check-sign" />*/}
          {/*                  </Label>*/}
          {/*                </FormGroup>*/}
          {/*              </Col>*/}
          {/*            </Row>*/}
          {/*          </li>*/}
          {/*        </ul>*/}
          {/*      </Col>*/}
          {/*    </Row>*/}
          {/*  </TabPane>*/}
          {/*  <TabPane className="text-center" tabId="2" id="following">*/}
          {/*    <h3 className="text-muted">Not following anyone yet :(</h3>*/}
          {/*    <Button className="btn-round" color="warning">*/}
          {/*      Find artists*/}
          {/*    </Button>*/}
          {/*  </TabPane>*/}
          {/*</TabContent>*/}
        </Container>
      </div>
    </>
  );
}

export default ProfilePage;
