import React from 'react';
import { NextPage, GetStaticProps } from 'next';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { SEO } from 'components/seo';
import CartPopUp from 'features/carts/cart-popup';
import { Modal } from '@redq/reuse-modal';

import {
  OfferPageWrapper,
  ProductsRow,
  MainContentArea,
  ProductsCol,
} from 'assets/styles/pages.style';
import GiftCard from 'components/gift-card/gift-card';
import Footer from 'layouts/footer';
import { initializeApollo } from 'utils/apollo';
import dynamic from 'next/dynamic';
const ErrorMessage = dynamic(() =>
  import('components/error-message/error-message')
);

const GET_COUPON = gql`
  query {
    coupons {
      id
      code
      image
      discountInPercent
    }
  }
`;
type GiftCardProps = {
  deviceType: {
    mobile: boolean;
    tablet: boolean;
    desktop: boolean;
  };
};

const GiftCardPage: NextPage<GiftCardProps> = ({ deviceType }) => {
  const data = {
    coupons: [
      {
        id: 1,
        title: 'Free Delivery',
        image: 'http://s3.amazonaws.com/redqteam.com/pickbazar/gift-card-1.png',
        code: 'RAMADAN15',
        discountInPercent: 15,
        number_of_coupon: 20,
        number_of_used_coupon: 10,
        products: [
          {
            id: '1',
            url: '',
          },
        ],
        status: 'active',
        expiration_date: new Date(),
        creation_date: new Date(),
      },
      {
        id: 2,
        title: 'Free Delivery',
        image: 'http://s3.amazonaws.com/redqteam.com/pickbazar/gift-card-2.png',
        code: 'RAMADAN20',
        discountInPercent: 20,
        number_of_coupon: 20,
        number_of_used_coupon: 10,
        products: [
          {
            id: '1',
            url: '',
          },
        ],
        status: 'revoked',
        expiration_date: new Date(),
        creation_date: new Date(),
      },
      {
        id: 3,
        title: 'cyber Monday Sale',
        code: 'CYBERMONDAY10',
        image: 'http://s3.amazonaws.com/redqteam.com/pickbazar/gift-card-1.png',
        discountInPercent: 10,
        number_of_coupon: 20,
        number_of_used_coupon: 10,
        products: [
          {
            id: '1',
            url: '',
          },
        ],
        status: 'active',
        expiration_date: new Date(),
        creation_date: new Date(),
      },
      {
        id: 4,
        title: 'Boxing Day Sale',
        code: 'DISCOUNT10',
        image: 'http://s3.amazonaws.com/redqteam.com/pickbazar/gift-card-2.png',
        discountInPercent: 10,
        number_of_coupon: 10,
        number_of_used_coupon: 5,
        products: [
          {
            id: '1',
            url: '',
          },
        ],
        status: 'active',
        expiration_date: new Date(),
        creation_date: new Date(),
      },

      {
        id: 5,
        title: 'Summer Discount',
        code: 'SUMMER10',
        image: 'http://s3.amazonaws.com/redqteam.com/pickbazar/gift-card-2.png',
        discountInPercent: 10,
        number_of_coupon: 10,
        number_of_used_coupon: 5,
        products: [
          {
            id: '1',
            url: '',
          },
        ],
        status: 'active',
        expiration_date: new Date(),
        creation_date: new Date(),
      },
      {
        id: 6,
        title: 'Winter Discount',
        code: 'WINTER10',
        image: 'http://s3.amazonaws.com/redqteam.com/pickbazar/gift-card-1.png',
        discountInPercent: 10,
        number_of_coupon: 10,
        number_of_used_coupon: 15,
        products: [
          {
            id: '1',
            url: '',
          },
        ],
        status: 'active',
        expiration_date: new Date(),
        creation_date: new Date(),
      },
      {
        id: 7,
        title: 'Autumn Discount',
        code: '1AUTUMN10',
        image: 'http://s3.amazonaws.com/redqteam.com/pickbazar/gift-card-2.png',
        discountInPercent: 10,
        number_of_coupon: 10,
        number_of_used_coupon: 15,
        products: [
          {
            id: '1',
            url: '',
          },
        ],
        status: 'active',
        expiration_date: new Date(),
        creation_date: new Date(),
      },

      {
        id: 8,
        title: 'Winter Discount',
        code: 'WINTER10',
        image: 'http://s3.amazonaws.com/redqteam.com/pickbazar/gift-card-1.png',
        discountInPercent: 10,
        number_of_coupon: 10,
        number_of_used_coupon: 15,
        products: [
          {
            id: '1',
            url: '',
          },
        ],
        status: 'active',
        expiration_date: new Date(),
        creation_date: new Date(),
      },

      {
        id: 9,
        title: 'Winter Sale',
        code: 'WINTER15',
        image: 'http://s3.amazonaws.com/redqteam.com/pickbazar/gift-card-1.png',
        discountInPercent: 15,
        number_of_coupon: 10,
        number_of_used_coupon: 15,
        products: [
          {
            id: '1',
            url: '',
          },
        ],
        status: 'active',
        expiration_date: new Date(),
        creation_date: new Date(),
      },
      {
        id: 10,
        title: 'Halloween Sale',
        code: 'HALLOWEEN20',
        image: 'http://s3.amazonaws.com/redqteam.com/pickbazar/gift-card-1.png',
        discountInPercent: 20,
        number_of_coupon: 10,
        number_of_used_coupon: 15,
        products: [
          {
            id: '1',
            url: '',
          },
        ],
        status: 'active',
        expiration_date: new Date(),
        creation_date: new Date(),
      },
    ]
  }

  return (
    <Modal>
      <SEO title="Offer - PickBazar" description="Offer Details" />
      <OfferPageWrapper>
        <MainContentArea>
          <div style={{ width: '100%' }}>
            <ProductsRow>
              {data && data.coupons
                ? data.coupons.map((coupon) => (
                    <ProductsCol key={coupon.id}>
                      <GiftCard image={coupon.image} code={coupon.code} />
                    </ProductsCol>
                  ))
                : null}
            </ProductsRow>
          </div>
        </MainContentArea>

        <Footer />
      </OfferPageWrapper>
      <CartPopUp deviceType={deviceType} />
    </Modal>
  );
};

export const getStaticProps: GetStaticProps = async () => {


  return {
    props: {
      initialApolloState: null//apolloClient.cache.extract(),
    },
  };
};
export default GiftCardPage;
