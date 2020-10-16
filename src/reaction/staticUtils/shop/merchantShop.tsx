export default `
query shop($id: ID!, $language: String! = "en") {
  shop(id: $id) {
        _id
    currency {
      code
    }
    defaultNavigationTree(language: $language) {
      ...NavigationTreeFragment
    }
    description
    name

    brandAssets {
      navbarBrandImage {
        large
        small
        thumbnail
      }
      navbarBrandImageId
    }
    emails {
      address
      provides
      verified
    }

    productCount
  }
}

fragment NavigationTreeFragment on NavigationTree {
  _id
  shopId
  name
  items {
    navigationItem {
      data {
        ...NavigationItemFields
      }
    }
    items {
      navigationItem {
        data {
          ...NavigationItemFields
        }
      }
      items {
        navigationItem {
          data {
            ...NavigationItemFields
          }
        }
      }
    }
  }
}
fragment NavigationItemFields on NavigationItemData {
  contentForLanguage
  classNames
  url
  isUrlRelative
  shouldOpenInNewWindow
}
`;
