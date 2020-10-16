// @ts-nocheck
import { NextPage } from 'next';
import { useQuery } from '@apollo/react-hooks';
import { Modal } from '@redq/reuse-modal';
import { GET_LOGGED_IN_CUSTOMER } from 'graphql/query/customer.query';
import { ProfileProvider } from 'contexts/profile/profile.provider';
import SettingsContent from 'features/user-profile/settings/settings';
import {
  PageWrapper,
  SidebarSection,
  ContentBox,
} from 'features/user-profile/user-profile.style';
import Sidebar from 'features/user-profile/sidebar/sidebar';
import { SEO } from 'components/seo';
import Footer from 'layouts/footer';
import ErrorMessage from 'components/error-message/error-message';
import useViewer from "hooks/viewer/useViewer";
import {withApollo} from "lib/apollo/withApollo";
import withAddressBook from "containers/address/withAddressBook";
import inject from "hocs/inject";
import {MainContentArea} from "../assets/styles/pages.style";


type Props = {
  deviceType?: {
    mobile: boolean;
    tablet: boolean;
    desktop: boolean;
  };
};
const ProfilePage: NextPage<Props> = ({ deviceType, ...props }) => {
  const [
    account,
    loading,
    refetch
  ] = useViewer();



  // Create data object to pass to AddressBook component



  console.log(props, "props....")
  //--console.log('pulkittt')

  if (!account || loading) {
    return <div>loading...</div>;
  }
  if (!account) return <ErrorMessage message={"User Not logged in"} />;
  return (
    <>
      <SEO title="Profile - PickBazar" description="Profile Details" />
      <MainContentArea>
        <ProfileProvider initData={account}>
          <PageWrapper>

            <SidebarSection>
              <Sidebar />
            </SidebarSection>
            <ContentBox>
              <SettingsContent deviceType={deviceType} />
            </ContentBox>

            <Footer />
          </PageWrapper>
        </ProfileProvider>
      </MainContentArea>
    </>
  );
};

export default withApollo()(withAddressBook(inject("authStore", "uiStore")(ProfilePage)));
