import { ReactiveBase, DynamicRangeSlider } from '@appbaseio/reactivesearch';

const PriceSlider = ()=>{

  return (
    <ReactiveBase
      app="good-books-ds"
      url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@arc-cluster-appbase-demo-6pjy6z.searchbase.io"
      enableAppbase
    >
    {/*<ReactiveBase*/}
    {/*  showFilter*/}
    {/*  defaultQuery={() => ({*/}
    {/*    aggs: {*/}
    {/*      'brand.keyword': {*/}
    {/*        terms: {*/}
    {/*          field: 'brand.keyword',*/}
    {/*          order: {*/}
    {/*            _count: 'desc',*/}
    {/*          },*/}
    {/*          size: 5,*/}
    {/*        },*/}
    {/*      },*/}
    {/*    },*/}
    {/*  })}*/}
    {/*  url="https://elastic.craflo.com"*/}
    {/*  app="carstore-dataset"*/}
    {/*  credentials="4HWI27QmA:58c731f7-79ab-4f55-a590-7e15c7e36721">*/}
      <DynamicRangeSlider
        dataField="books_count"
        componentId="BookSensor"
        rangeLabels={(min, max) => ({
          start: `${min} book`,
          end: `${max} books`,
        })}
        tooltipTrigger={"hover"}
        innerClass={{
          title: 'search-title',
          label: 'search-label'
        }}
        style={{'.search-label':{display: 'none'}}}
      />
      {/*<DynamicRangeSlider*/}
      {/*  componentId="DynamicRangeSensor"*/}
      {/*  dataField="guests"*/}
      {/*  title="Guests"*/}
      {/*  defaultValue={(min, max) => (*/}
      {/*    {*/}
      {/*      "start": min,*/}
      {/*      "end": Math.min(min + 5, max)*/}
      {/*    }*/}
      {/*  )}*/}
      {/*  rangeLabels={(min, max) => (*/}
      {/*    {*/}
      {/*      "start": min + " guest",*/}
      {/*      "end": max + " guests"*/}
      {/*    }*/}
      {/*  )}*/}
      {/*  stepValue={1}*/}
      {/*  showHistogram={true}*/}
      {/*  showFilter={true}*/}
      {/*  interval={2}*/}
      {/*  react={{*/}
      {/*    and: ["CategoryFilter", "SearchFilter"]*/}
      {/*  }}*/}
      {/*  URLParams={true}*/}
      {/*  loader="Loading ..."*/}
      {/*/>*/}
    </ReactiveBase>)
}

export default PriceSlider
