import React from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import Sticky from 'react-stickynode';
import { useAppState } from 'contexts/app/app.provider';
import Header from './header/header';
import { LayoutWrapper } from './layout.style';
import { isCategoryPage } from './is-home-page';
import useStores from "hooks/useStores";
import Grid from '@material-ui/core/Grid';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
// import Sidebar from 'react-sidebar';
const MobileHeader = dynamic(() => import('./header/mobile-header'), {
  ssr: false,
});

const SidebarMenu = dynamic(() => import('src/layouts/sidebar/sidebarMenu'));
import { push as Menu } from 'react-burger-menu'
// import set = Reflect.set;
// type LayoutProps = {
//   className?: string;
//   token?: string;
//   children?: any;
//
// };


// const ScrollContainer = React.forwardRef((ref, contentId, renderContent)=>{
//   return (<div>
//
//   </div>)
// })

import { makeStyles, useTheme, Theme, createStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    appBar: {
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    hide: {
      display: 'none',
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
      zIndex: 600
    },
    drawerPaper: {
      width: drawerWidth,
      zIndex: 600
    },
    drawerHeader: {
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
      justifyContent: 'flex-end',
    },
    content: {
      flexGrow: 1,
      // padding: theme.spacing(3),
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginLeft: 0,
    },
    contentShift: {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: drawerWidth,
    },
  }),
);

const Layout = ({
  className,
  children,
  token,
  deviceType
}) => {
  // console.log(JSON.stringify(deviceType))

  const {uiStore} = useStores();
  // const [isMenu, setMenu] = React.useState(true)

  // React.useEffect(() => {
  //   setMenu(uiStore.isMenuDrawerOpen)
  // }, [uiStore.isMenuDrawerOpen]);

  console.log(uiStore)
  const isSticky = useAppState('isSticky');
  const { pathname, query } = useRouter();
  const type = pathname === '/restaurant' ? 'restaurant' : query.type;
  const isHomePage = isCategoryPage(type);


  const classes = useStyles();
  const theme = useTheme();
  return (
      <LayoutWrapper >

        <Sticky enabled={isSticky} innerZ={999}>
          <MobileHeader
            className={`${isSticky ? 'sticky' : 'unSticky'} ${
              isHomePage ? 'home' : ''
            } desktop`}
          />
          <Header
            className={`${isSticky && isHomePage ? 'sticky' : 'unSticky'} ${
              isHomePage ? 'home' : ''
            }`}
          />
        </Sticky>
        {/*<div id="rrr-outer-container">*/}

        {/*<Grid container>*/}
        {/*  <Grid  item xs={2} style={isMenu ? {} : { display: 'none' }}>*/}
        {/*    <div style={{background: "#fff", height: "100%"}}>*/}
        {/*      <SidebarMenu type={'grocery'} deviceType={{desktop: true, mobile: 'false', tablet: 'false'}}  />*/}
        {/*    </div>*/}
        {/*  </Grid>*/}
        {/*  <Grid  item xs={isMenu ? 10:12} >*/}
        {/*    {children}*/}
        {/*  </Grid>*/}
        {/*</Grid>*/}

          {/*<Sidebar*/}
          {/*  sidebar={ <div id={"rrr-sidebar"}><SidebarMenu type={'grocery'} deviceType={deviceType}  /></div>}*/}
          {/*  open={uiStore.isMenuDrawerOpen}*/}
          {/*  styles={{ sidebar: { background: "white" } }}*/}
          {/*  shadow={!!deviceType.mobile}*/}
          {/*  docked={!deviceType.mobile && uiStore.isMenuDrawerOpen}*/}
          {/*  transitions={true}*/}
          {/*  sidebarId={"rrr-sidebar"}*/}
          {/*  contentId={"rrr-content"}*/}
          {/*>*/}

          <SwipeableDrawer
            variant="persistent"
            anchor={'left'}
            open={uiStore.isMenuDrawerOpen}
            onOpen={uiStore.toggleMenuDrawerOpen}
            onClose={uiStore.toggleMenuDrawerOpen}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            classes={{
              paper: classes.drawerPaper,
            }}
            className={classes.drawer}
          >
            <SidebarMenu type={'grocery'} deviceType={deviceType} />
          </SwipeableDrawer>

          <main
            className={clsx(classes.content, {
              [classes.contentShift]: uiStore.isMenuDrawerOpen,
            })}
          >
            {children}
          </main>


        {/*<Menu noOverlay isOpen={isMenu} onOpen={setMenu} pageWrapId={ "rrr-page-wrap" } outerContainerId={ "rrr-outer-container" }>*/}
        {/*    <SidebarMenu type={'grocery'} deviceType={deviceType}  />*/}
        {/*  </Menu>*/}
        {/*</div>*/}


      </LayoutWrapper>
  );
};

export default Layout;
