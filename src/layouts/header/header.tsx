import React from 'react';
import Router, { useRouter } from 'next/router';
import { openModal, closeModal } from '@redq/reuse-modal';
import { AuthContext } from 'contexts/auth/auth.context';
import AuthenticationForm from 'features/authentication-form';
import { RightMenu } from './menu/right-menu/right-menu';
import { LeftMenu } from './menu/left-menu/left-menu';
import HeaderWrapper from './header.style';
import LogoImage from 'assets/images/logo.png';
import UserImage from 'assets/images/user.jpg';
import { isCategoryPage } from '../is-home-page';
import Search from 'features/search/search';
import useAuthStore from "hooks/globalStores/useAuthStore";

type Props = {
  className?: string;
};

const CANONICAL_URL = process.env.CANONICAL_URL

const Header: React.FC<Props> = ({ className }) => {
  const {
    authDispatch,
  } = React.useContext<any>(AuthContext);

  const {isAuthenticated} = useAuthStore()




  const { pathname, query } = useRouter();
  const handleLogout = () => {
    // if (typeof window !== 'undefined') {
    //   localStorage.removeItem('access_token');
    //   authDispatch({ type: 'SIGN_OUT' });
    //   Router.push('/');
    // }
    // Router.push('/logout');
    fetch(CANONICAL_URL + "/logout").then((res)=>res.json()).then((res)=>{
      console.log(res)
    },
      (err)=>{
        console.log(err)
      })
  };

  const handleJoin = () => {
    authDispatch({
      type: 'SIGNIN',
    });

    openModal({
      show: true,
      overlayClassName: 'quick-view-overlay',
      closeOnClickOutside: true,
      component: AuthenticationForm,
      closeComponent: '',
      config: {
        enableResizing: false,
        disableDragging: true,
        className: 'quick-view-modal',
        width: 410,
        height: 'auto',
      },
    });
  };
  const type = pathname === '/restaurant' ? 'restaurant' : query.type;
  const showSearch = isCategoryPage(type);
  return (
    <HeaderWrapper className={className} id="layout-header">
      <LeftMenu logo={LogoImage} />
      {showSearch && <Search minimal={true} className="headerSearch" />}
      <RightMenu
        isAuthenticated={isAuthenticated}
        onJoin={handleJoin}
        onLogout={handleLogout}
        avatar={UserImage}
      />
    </HeaderWrapper>
  );
};

export default Header;
