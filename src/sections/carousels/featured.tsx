import React, { Component } from "react";
import Slider from "react-slick";
import styled from 'styled-components';
import { themeGet } from '@styled-system/theme-get';
import { Row as Rows, Col as Cols } from 'react-styled-flexboxgrid';

//
function getRandomColor() {
  var letters = 'ACEF'.split('');
  var color = '#';
  for (var i = 0; i < 6; i++ ) {
    color += letters[Math.floor(Math.random() * letters.length)];
  }
  return color + '57';
}


const CategoryCard  = styled.div`
      margin: 10px;
      border-radius: 16px;
      background: ${props => props.bg};
      height: 12rem;
      width: 14 rem;
      `;

// #f4fce9
// #f0f0f0
// #e9f8ff
// #e5f8fb#ffeced#ebeefc#f1effa


const Wrapper = ()=>{
  const bg = getRandomColor()
  return <CategoryCard bg={bg}/>
}

export default class Carousel extends Component {
  render() {
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 5.5,
      slidesToScroll: 1.5
    };
    return (<>

      <div style={{
        padding: '40px',
        color:"#fff"
      }}>
        <Slider {...settings} >
          <div>
            <Wrapper>1</Wrapper>
          </div>
          <div>
            <Wrapper>2</Wrapper>
          </div>
          <div>
            <Wrapper>3</Wrapper>
          </div>
          <div>
            <Wrapper>4</Wrapper>
          </div>
          <div>
            <Wrapper>5</Wrapper>
          </div>
          <div>
            <Wrapper>6</Wrapper>
          </div>
          <div>
            <Wrapper>7</Wrapper>
          </div>
          <div>
            <Wrapper>8</Wrapper>
          </div>
          <div>
            <Wrapper>9</Wrapper>
          </div>
          <div>
            <Wrapper>10</Wrapper>
          </div>
          <div>
            <Wrapper>11</Wrapper>
          </div>
          <div>
            <Wrapper>12</Wrapper>
          </div>
          <div>
            <Wrapper>13</Wrapper>
          </div>
          <div>
            <Wrapper>14</Wrapper>
          </div>
          <div>
            <Wrapper>15</Wrapper>
          </div>
          <div>
            <Wrapper>16</Wrapper>
          </div>
        </Slider>
      </div>
      </>
    );
  }
}
