import styled, { createGlobalStyle } from 'styled-components';
import { themeGet } from '@styled-system/theme-get';
const TIMEOUT = 400;

export const InjectRTL = styled.div`
  ${({ lang }) =>
    (lang === 'ar' || lang === 'he') &&
    `
    font-family: 'Cairo', sans-serif;
    `}
`;

export const GlobalStyle = createGlobalStyle`
  html {
    box-sizing: border-box;
  }
  *, *:before, *:after {
    box-sizing: inherit;
  }
  :focus {
    outline: none;
  }
  body{
    margin: 0;
    font-family: ${themeGet('fontFamily.0', 'sans-serif')};
  }

  h1,h2,h3,h4,h5,h6  {
    font-family: ${themeGet('fontFamily.1', 'sans-serif')};
    margin: 0;
  }

  p,a,span,button,li,div  {
    font-family: ${themeGet('fontFamily.0', 'sans-serif')};
    margin: 0;
  }
  ul{
    margin: 0;
    padding: 0;
  }
  li{
    list-style: none;
  }

  a{
    text-decoration: none;
  }

  .quick-view-overlay{
    background-color: rgba(30,41,51,.45);
    transition: opacity 1s;
    opacity: 1
  }

  .add-address-modal,
  .add-contact-modal{
    box-shadow: 0 10px 40px rgba(0,0,0,0.16);
    border-radius: 3px !important;
    .innerRndComponent{
      width: 100%;
      padding: 30px;
      height: auto;
      background-color: #f7f8f9;
      border: 0;
      box-sizing: border-box;
    }
  }

  .search-modal-mobile{
    transform: none!important;
    max-width: none!important;
    max-height: none!important;
    top: 0!important;
    left: 0!important;
    background: transparent!important;;
    border-radius: 0!important;
  }

  .reuseModalCloseBtn{
    right: 10px!important;
    background-color: #ffffff!important;
    color: #222222!important;
    border-radius: 15px!important;
    padding: 0 9px!important;
    box-shadow: 0 2px 8px rgba(0,0,0,0.4);
  }



  .page-transition-enter {
    opacity: 0;
    transform: translate3d(0, 20px, 0);
  }
  .page-transition-enter-active {
    opacity: 1;
    transform: translate3d(0, 0, 0);
    transition: opacity ${TIMEOUT}ms, transform ${TIMEOUT}ms;
  }
  .page-transition-exit {
    opacity: 1;
  }
  .page-transition-exit-active {
    opacity: 0;
    transition: opacity ${TIMEOUT}ms;
  }
  .loading-indicator-appear,
  .loading-indicator-enter {
    opacity: 0;
  }
  .loading-indicator-appear-active,
  .loading-indicator-enter-active {
    opacity: 1;
    transition: opacity ${TIMEOUT}ms;
  }

  .image-item{
    padding: 0 15px;
  }

  @media (max-width: 1199px) and (min-width: 991px) {
    .image-item{
      padding-left: 10px;
      padding-right: 10px;
    }
  }
  @media (max-width: 768px) {
    .image-item{
      padding-left: 7.5px;
      padding-right: 7.5px;
    }
  }

  .rc-table-fixed-header .rc-table-scroll .rc-table-header{
    margin-bottom: 0 !important;
    padding-bottom: 0 !important;

    th {
      padding: 8px 20px;
      }
  }

  .drawer-content-wrapper{
    *:focus {
      outline: none;
    }
  }

  .rc-table-content{
    border: 0;
  }

  .elastic-search-title{
    display: none
  }

  .search-icon {
    height: 100%;
    font-size: 16px;
    color: #77798C !important;
    fill: #77798C !important;
    width: 16px;
    margin: 5px;

    &.right {
      right: 0;
      left: auto;
    }
  }

  .elastic-search-input{
    flex-grow: 1;
    font-size: 16px;
    height: 48px;
    background-color: #FFFFFF !important;
    border: 0px !important;
    display: flex;
    border-radius: 6px;
    overflow: visible;
    padding-left: 48px !important;
    width: 700px !important;
    color: #77798C;
    height: 50px !important;
    box-shadow: 0 21px 36px rgba(0,0,0,0.05);
  }


   .elastic-search-input-minimal{
    flex-grow: 1;
    font-size: 16px;
    height: 48px;
    background-color: #F0F0F0 !important;
    border: 0px !important;
    display: flex;
    border-radius: 6px;
    overflow: visible;
    padding-left: 48px !important;
    width: 100% !important;
    color: #77798C;
    height: 50px !important
  }


 `;
