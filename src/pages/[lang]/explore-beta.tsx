// @ts-nocheck
import Immutable from 'immutable';
import PropTypes from 'prop-types';
import * as React from 'react';
import dynamic from 'next/dynamic';
//import {LabeledInput, InputRow} from './demo/LabeledInput';
import createCellPositioner from './Masonry/createCellPositioner';
const GeneralCard = dynamic(
  import('src/components/product-card/product-card-listing/product-card-listing')
);
const Sidebar = dynamic(() => import('src/layouts/sidebar/sidebar'));
import Fade from 'react-reveal/Fade';

import { Link, Element } from 'react-scroll';
import { Button } from 'src/components/button/button';
import {
  ProductDetailsWrapper,
  ProductPreview,
  RestaurantMeta,
  RestaurantNameAddress,
  RestaurantName,
  RestaurantAddress,
  RestaurantOtherInfos,
  InfoBlock,
  Label,
  Infos,
  DeliveryOpt,
  CategoriesWrapper,
  CategoriesInner,
  MainContent,
  MenuContainer,
  ItemCategoryWrapper,
  ItemCategoryName,
  ItemWrapper,
  ItemNameDetails,
  ItemName,
  ItemDetails,
  ItemNamePricing,
  HelpText,
  ItemPrice,
  CartWrapper,
} from 'src/components/product-details/product-details-three/product-details-three.style';
import { CURRENCY } from 'src/utils/constant';
import FixedCart from 'src/features/carts/fixed-cart';
import FixedCartPopup from 'src/features/carts/fixed-cart-popup';
import { FormattedMessage } from 'react-intl';
import Sticky from 'react-stickynode';
import { groupBy } from 'src/utils/groupBy';
import { useCart } from 'src/contexts/cart/use-cart';
import { PlusOutline } from 'src/components/AllSvgIcon';
import { NextPage, GetStaticProps } from 'next';
import StoreNav from "src/components/store-nav/store-nav";
import storeType from "src/constants/storeType";
import {useRefScroll} from "src/utils/use-ref-scroll";
import {Banner} from "src/components/banner/banner";
import {useAppDispatch} from "src/contexts/app/app.provider";
import { useCallback } from 'react';
import {withApollo} from "lib/apollo/withApollo";
import withCatalogItems from "containers/catalog/withCatalogItems";
import inject from "hocs/inject";
import { inPageSizes } from "lib/utils/pageSizes";
import PageLoading from "components/PageLoading/PageLoading";
import ProductGridEmptyMessage from "components/ProductGrid/ProductGridEmptyMessage";
import {Masonry, WindowScroller, AutoSizer, CellMeasurer, CellMeasurerCache} from 'react-virtualized';
import {SEO} from "src/components/seo";
import {
  ContentSection,
  MainContentArea, MobileCarouselDropdown,
  OfferPageWrapper,
  ProductsCol,
  ProductsRow,
  SidebarSection
} from "src/assets/styles/pages.style";
import GiftCard from "src/components/gift-card/gift-card";
import Footer from "src/layouts/footer";
import CartPopUp from "src/features/carts/cart-popup";
import { Modal } from '@redq/reuse-modal';
import fetchPrimaryShop from "staticUtils/shop/fetchPrimaryShop";
import fetchTranslations from "staticUtils/translations/fetchTranslations";
// import PriceSlider from "../../components/price-slider/price-slider";
// import {Box, Flag, MenuItem, SelectedItem} from "../../layouts/header/menu/language-switcher/language-switcher.style";
// import {useLocale} from "../../contexts/language/language.provider";
// import Popover from "../../components/popover/popover";
// import {LangSwitcher} from "../../layouts/header/header.style";
import { Row, Col } from 'react-styled-flexboxgrid';


let slug_language;
import { useSize, useScroller } from "mini-virtual-list";
import { usePositioner, useResizeObserver, MasonryScroller, useMasonry, useContainerPosition } from "masonic";

import {useWindowSize} from "../../utils/useWindowSize";
// import {useWindowSize} from '@react-hook/window-size'
import {Parallax, ParallaxLayer} from 'react-spring/renderprops-addons'
import handleViewport from 'react-in-viewport';
import { useQuery } from '@apollo/react-hooks';
import hoistNonReactStatic from "hoist-non-react-statics";
import { pagination, paginationVariablesFromUrlParams } from "lib/utils/pagination";
import catalogItemsQuery from "containers/catalog/catalogItems.gql";
// import PriceSlider from "../../components/price-slider/price-slider";
import ColorFilter from "../../components/color-filter/color-filter";
import {DynamicRangeSlider, ReactiveList} from '@appbaseio/reactivesearch'

const Card = ({index, width, data}) => {
  // console.log("heyy", {index, width, data})
  // const cardRef = React.useRef()
  // const [inView, setInView]= setState()
  // useEffect(() => {
  //   setView(useOnScreen(cardRef))
  //   // code to run on component mount
  // }, [])

  // console.log(inView, 'index:', index)
  const inViewport = true

  const p = data.product;
  console.log(p,data, "asdfaoisdjfoij09--0")
  // this.props.products[index % this.props.products.length];
  const media = JSON.parse(p.metafields[0].value)
  // let elem = (document.compatMode === "CSS1Compat") ?
  //   document.documentElement :
  //   document.body;
  //
  // let height = elem.clientHeight;
  // let width = elem.clientWidth;
  // let windowSize =
  const imgW = width
  const imgH = Math.ceil((imgW / media[0].full_width ) * media[0].full_height)
  //Math.ceil(200 + ((1 + (index % 10)) / 10) * 400)
  //--console.log(p.pricing[0].maxPrice, "klkllk")

  return (<div
    style={{
      width: width,
      transform: 'translate(0, '+(inViewport? 0:20)+'px)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      transitionDelay: '0.05s',
      opacity: inViewport? 1:0
    }}
  >
    <div
      style={{
        backgroundColor: p.color,
        borderRadius: '0.5rem',
        height: (imgH + 130) / 16 + 'rem',
        marginBottom: '0.5rem',
        width: '100%',
        fontSize: 20,
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>


      <GeneralCard
        title={p.title}
        description={p.description}
        image={media[0].url_570xN}
        imgH={imgH / 16 + "rem"}
        imgW={imgW / 16 + "rem"}
        currency="USD"
        price={p.pricing.USD.maxPrice + ""}
        salePrice={(p.pricing.USD.maxPrice) * 0.8 + ""}
        discountInPercent={2}
        product_data={{}}
        onClick={() => {
          const as = `../product/${p.slug}`;
          window.open(as, '_blank');
        }
        }
      />
    </div>
  </div>)
}



export const App = ({ deviceType, data, loading, routingStore, props}) => {
  const {
    uiStore,
    tag
  } = props;

  const {query}= routingStore

  // const containerRef = React.useRef(null);
  // const { scrollTop, isScrolling } = useScroller(containerRef);
  const [items, setItems]=React.useState([])
  // const [width, height} = useWindowSize()
  // const [width, height] = [500, 400]
  // const width, height
  const {height} = useWindowSize();
  const width=1200
  // const { offset, width } = useContainerPosition([
  //   windowWidth,
  //   windowHeight
  // ]);




  const calcCardWidth = (width, gutter, X) => (width-(X+1)*gutter)/(X) - 2*gutter

  const [grid, setGrid] = React.useState({
    columnGutter: 10
  })

  const [gridCol, setGridCol] = React.useState({
    columnWidth: calcCardWidth(width, grid.columnGutter, 4)
  })

  React.useEffect(()=>{
    setItems(data)
  }, [data])


  React.useEffect(()=>{
    setGrid({columnGutter: deviceType.mobile ? 15 : 30})
  }, [deviceType])

  React.useEffect(()=>{
    setGridCol({
      columnWidth: deviceType.mobile? calcCardWidth(width, grid.columnGutter, 2): calcCardWidth(width, grid.columnGutter, 4)
    })
  }, [grid])

  console.log(grid, gridCol, width)
  console.log(data)

  const positioner = usePositioner({
    width: width - 2*grid.columnGutter,
    columnWidth: gridCol.columnWidth,
    columnGutter: grid.columnGutter
    },
    [items]
  );

  const resizeObserver = useResizeObserver(positioner);

  // const setPageSize = (pageSize) => {
  //   props.routingStore.setSearch({ limit: pageSize });
  //   props.uiStore.setPageSize(pageSize);
  // };
  //
  // const setSortBy = (sortBy) => {
  //   props.routingStore.setSearch({ sortby: sortBy });
  //   props.uiStore.setSortBy(sortBy);
  // };
  //
  //
  //
  //
  // const pageSize = query && inPageSizes(query.limit) ? parseInt(query.limit, 10) : uiStore.pageSize;
  // let [sortBy, sortOrder] = uiStore.sortBy.split("-");
  // // sortBy = query && query.sortby ? query.sortby : uiStore.sortBy;
  // let tagIds = tag && [tag._id];
  //
  //
  // const variables = {
  //   shopId: "oEsrnc9mqBDvt52TW",
  //   ...paginationVariablesFromUrlParams(routingStore.query, { defaultPageLimit: 50 }),
  //   tagIds,
  //   sortBy: sortBy,
  //   sortByPriceCurrencyCode: uiStore.sortByCurrencyCode,
  //   sortOrder,
  //   searchConfig: {
  //     content: ["mein chutiya naaui hu mdc" , "dekh hota dikha"]
  //   }
  // };
  //
  // const { data, error, fetchMore, loading } = useQuery(catalogItemsQuery, {
  //   variables
  // })
  //
  // const [items, setItems] = React.useState([])
  // const [pageTools, setPageTools] = React.useState()
  //
  // React.useEffect(()=>{
  //   const { catalogItems } = data || {};
  //   console.log(catalogItems, ":::asdfasdfasdf")
  //   setItems((curr)=>[...curr, ...((catalogItems && catalogItems.edges) || []).map((item) => item.node.product)])
  //   setPageTools(pagination({
  //     fetchMore,
  //     routingStore,
  //     data,
  //     queryName: "catalogItems",
  //     limit: uiStore.pageSize
  //   }))
  // }, [data])
  //
  //
  //
  //
  //
  //
  // const fetchMoreItems = async (startIndex, stopIndex, currentItems) => {
  //   console.log(startIndex, stopIndex)
  //   console.log(currentItems.length)
  //     pageTools.loadNextPage()
  //     // const nextItems = []
  //     // setItems((current) => [...current, ...nextItems])
  //   // }
  // }
  //
  // const maybeLoadMore = useInfiniteLoader(fetchMoreItems, {
  //   isItemLoaded: (index, items) => loading? true: (!!items[index])
  // })

  return (
    <main style={{paddingLeft: grid.columnGutter, margin: 'auto'}}>
            {/*<div style={{paddingLeft: grid.columnGutter}} ref={containerRef}>*/}
            {/*  <Masonry*/}
            {/*    items={items}*/}
            {/*    render={Card}*/}
            {/*    height={height}*/}
            {/*    overscanBy={12}*/}
            {/*    width={width - 2*grid.columnGutter}*/}
            {/*    columnWidth= {gridCol.columnWidth}*/}
            {/*    columnGutter= {grid.columnGutter}*/}
            {/*  />*/}
      <MasonryScroller
        positioner={positioner}
        resizeObserver={resizeObserver}
        items={items}
        height={height}
        width={width}
        overscanBy={12}
        render={Card}
        style={{
          display: 'flex',
          alignItems: 'center',
          width: width,
          margin: 'auto'
        }}
      />

              {/*{useMasonry({*/}
              {/*  positioner,*/}
              {/*  resizeObserver,*/}
              {/*  items: data,*/}
              {/*  height: '100vh',*/}
              {/*  scrollTop,*/}
              {/*  isScrolling,*/}
              {/*  overscanBy: 12,*/}
              {/*  render: Card,*/}

              {/*})}*/}
            {/*</div>*/}
    </main>
  );
};

// const FakeCard = ({ data: { id, name, src } }) => (
//   <div>
//     <img alt="kitty" src={src} />
//     <span children={name} />
//   </div>
// );
//
// const Header = () => {
//   const scrollY = useWindowScroll(5);
//   return (
//     <h1 >
//       <span role="img" aria-label="bricks">
//         🧱
//       </span>{" "}
//       MASONIC
//     </h1>
//   );
// };
//
//
// const randomChoice = items => items[Math.floor(Math.random() * items.length)];
// const getFakeItems = (cur = 0) => {
//   const fakeItems = [];
//   for (let i = 5000 * cur; i < cur * 5000 + 5000; i++)
//     fakeItems.push({ id: i, name: catNames.random(), src: randomChoice(cats) });
//   return fakeItems;
// };
// const items;

// if (typeof window !== 'undefined') {
//   ReactDOM.render(<App />, document.getElementById("XXgscrollXX"));
// }







const LanguageMenu = ({ onClick }) => {
  return (
    <>
      {LANGUAGES.map((item) => (
        <MenuItem onClick={onClick} key={item.id} value={item.id}>
          <span>{item.icon}</span>
          <FormattedMessage
            id={item.intlLangName}
            defaultMessage={item.label}
          />
        </MenuItem>
      ))}
    </>
  );
};


// const AppWithCatalog = inject("routingStore", "uiStore", "authStore")(App)




const ProductListingPage: NextPage = ({ deviceType, ...props }) => {
  //--console.log(props, "sdsdd---pulkit")
  slug_language = props.lang

  // const { elRef: targetRef, scroll } = useRefScroll({
  //   percentOfElement: 0,
  //   percentOfContainer: 0,
  //   offsetPX: -110,
  // });
  const dispatch = useAppDispatch();
  const setSticky = useCallback(() => dispatch({ type: 'SET_STICKY' }), [
    dispatch,
  ]);
  setSticky()


  const productGroups = [
      "sort",
      "price",
      "color",
      "occasion"
  ]
  props.routingStore.setTagId(null);
  const {shop} = props


  let pageTitle;
  if (shop) {
      pageTitle = shop.name;
      if (shop.description) pageTitle = `${pageTitle} | ${shop.description}`;
  } else {
    pageTitle = "Storefront";
  }
  const headerOffset = deviceType.mobile || deviceType.tablet ? -137 : -177;
  // let appWidth = 0, appHeight=0
  // if (typeof window !== "undefined") {
  //   // browser code
  //   const dim = useWindowSize()
  //   appWidth = dim.width - 20
  //   appHeight = dim.height
  // }

  return (
    <>
    <SEO title="Browse Listings - Craflo" description="find your own craft" />
    <Modal>

      {/*<MobileCarouselDropdown>*/}
      {/*  <StoreNav items={storeType} />*/}
      {/*</MobileCarouselDropdo1`wn>*/}

            <ProductPreview>
              <img src={"https://media.gettyimages.com/photos/making-paper-flowersart-and-craft-concept-picture-id1149218784"} />
            </ProductPreview>


            <Sticky
              top={deviceType.mobile || deviceType.tablet ? 68 : 78}
              innerZ={99}
              bottomBoundary={300}
            >
              <Row style={{ alignItems: 'flex-end', margin:'auto', height:72, backgroundColor: "#fff" }}>
                <Col xs={4} sm={3} md={3} lg={3} style={{position:"relative", top: -80}}>
                  <ColorFilter/>
                </Col>
                <Col xs={4} sm={3} md={3} lg={3} style={{position:"relative", top: -80}}>
                  <DynamicRangeSlider
                    componentId="PriceRangeSensor"
                    dataField="product.pricing.USD.minPrice"
                    showHistogram={true}
                  />
                </Col>
              </Row>

              {/*<PriceSlider />*/}
              {/*<LangSwitcher/>*/}
              {/*<CategoriesWrapper>*/}
              {/*  <CategoriesInner>*/}
              {/*    {Object.keys(productGroups).map((item, index) => (*/}
              {/*      <Link*/}
              {/*        activeClass="active"*/}
              {/*        className="category"*/}
              {/*        to={Object.keys(productGroups)[index]}*/}
              {/*        offset={headerOffset}*/}
              {/*        spy={true}*/}
              {/*        smooth={true}*/}
              {/*        duration={500}*/}
              {/*        key={item}*/}
              {/*      >*/}
              {/*        {item}*/}
              {/*      </Link>*/}
              {/*    ))}*/}
              {/*  </CategoriesInner>*/}
              {/*</CategoriesWrapper>*/}
            </Sticky>


            <div style={{height: "90px"}} />
            <ReactiveList
              react={{
                "and": ["CrafloSearch", "PriceRangeSensor"]
              }}
              componentId="SearchResult"
              stream={true}
              infiniteScroll={true}
              size={45}
              // scrollTarget={"rrr-content"}
              dataField={"reaction.catalog"}
            >
              {
                ({ data, error, loading, ...rest }) => (
                  // <div>{"pulkit"}</div>
                  <App props={props} loading={loading} data={data} routingStore={props.routingStore} deviceType={deviceType}/>
                )
              }
            </ReactiveList>
        <Footer />
      <CartPopUp deviceType={deviceType}/>
    </Modal>
    </>
  )
};

export const getStaticProps: GetStaticProps = async ({ params: { lang } }) => {
  lang = "en"
  const primaryShop = await fetchPrimaryShop(lang);
  //const translations = await fetchTranslations(lang, ["common"]);

  if (!primaryShop) {
    return {
      props: {
        shop: null,
        //...translations,
        type: 'grocery',
        lang,
        initialApolloState: null  //apolloClient.cache.extract(),
      },
      // eslint-disable-next-line camelcase
      unstable_revalidate: 1 // Revalidate immediately
    };
  }
  //--console.log(primaryShop, "pulkit0009")

  return {
    props: {
      ...primaryShop,
      //...translations,
      type: 'grocery',
      lang,
      initialApolloState: null  //apolloClient.cache.extract(),
    },
    // eslint-disable-next-line camelcase
    unstable_revalidate: 120 // Revalidate each two minutes
  };
};

export async function getStaticPaths() {
  return {
    paths: [
      { params: { lang: 'in' } },
      { params: { lang: 'us' } },
      { params: { lang: 'fr' } },
      { params: { lang: 'gb' } },
      { params: { lang: 'ru' } },
      { params: { lang: 'ca' } },
      { params: { lang: 'au' } },
    ],
    fallback: false,
  };
}

export default withApollo()(inject("routingStore", "uiStore", "authStore")(ProductListingPage));


