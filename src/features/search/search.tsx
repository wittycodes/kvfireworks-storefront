import React from 'react';
import { SearchBox } from 'components/search-box/search-box';
import { useAppState, useAppDispatch } from 'contexts/app/app.provider';
import { useRouter } from 'next/router';
import { useIntl } from 'react-intl';
import {ReactiveBase,ReactiveList, DataSearch} from '@appbaseio/reactivesearch'
import {StyledSearchButton} from "../../components/search-box/search-box.style";
import {SearchIcon} from "../../assets/icons/SearchIcon";
interface Props {
  minimal?: boolean;
  showButtonText?: boolean;
  onSubmit?: () => void;
  [key: string]: unknown;
}

const Search: React.FC<Props> = ({ onSubmit, ...props }) => {
  const searchTerm = useAppState('searchTerm');
  const dispatch = useAppDispatch();
  const router = useRouter();
  const intl = useIntl();
  // console.log("yeyeyieeieiepieepieepipieipepie")

  const handleOnChange = (e) => {
    const { value } = e.target;
    dispatch({ type: 'SET_SEARCH_TERM', payload: value });
  };
  const { pathname, query } = router;
  const onSearch = (e) => {
    e.preventDefault();
    const { type, ...rest } = query;
    router.push(
      {
        pathname,
        query: { ...rest, text: searchTerm },
      },
      {
        pathname: `/${type}`,
        query: { ...rest, text: searchTerm },
      }
    );
    dispatch({ type: 'SET_SEARCH_TERM', payload: '' });
    if (onSubmit) {
      onSubmit();
    }
  };
  return (
    <>
      <DataSearch
        style={{
          width: '80%',
          marginLeft: 124
        }}
        name="search"
        componentId="CrafloSearch"
        dataField={["product.description"]}
        title="Search"
        fieldWeights={[1, 3]}
        placeholder="Start Typing your Imagination.."
        autosuggest={true}
        highlight={true}
        highlightField="group_city"
        queryFormat="or"
        fuzziness={0}
        debounce={100}
        size={10}
        showFilter={true}
        URLParams={false}
        innerClass={{
          title: 'elastic-search-title',
          input: props?.minimal ? 'elastic-search-input-minimal': 'elastic-search-input'
        }}
      />
      {
        props?.minimal? null :
        (<StyledSearchButton>
          <SearchIcon style={{marginRight: 10, marginLeft: 10}}/>
          {intl.formatMessage({
            id: 'searchButtonText',
            defaultMessage: 'Search',
          })}
        </StyledSearchButton>)
      }
    {/*<SearchBox*/}
    {/*  onEnter={onSearch}*/}
    {/*  onChange={handleOnChange}*/}
    {/*  value={searchTerm}*/}
    {/*  */}
    {/*  placeholder={intl.formatMessage({*/}
    {/*    id: 'searchPlaceholder',*/}
    {/*    defaultMessage: 'Search your products from here',*/}
    {/*  })}*/}
    {/*  categoryType={query.type}*/}
    {/*  buttonText={intl.formatMessage({*/}
    {/*    id: 'searchButtonText',*/}
    {/*    defaultMessage: 'Search',*/}
    {/*  })}*/}
    {/*  {...props}*/}
    {/*/>*/}

      {/*<ReactiveList*/}
      {/*  react={{*/}
      {/*    "and": ["CrafloSearch"]*/}
      {/*  }}*/}
      {/*  componentId="SearchResult"*/}
      {/*>*/}
      {/*  {*/}
      {/*    ({ data, error, loading, ...rest }) => (<>*/}

      {/*      {console.log(data, "search result")}*/}
      {/*    </>)*/}
      {/*  }*/}
      {/*</ReactiveList>*/}
    </>
  );
};

export default Search;
